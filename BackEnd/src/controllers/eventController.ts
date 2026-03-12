import { Request, Response } from "express";
import { z } from "zod";
import {
  createEvent,
  deleteEvent,
  listEvents,
  updateEvent,
} from "../services/eventService";
import { sendEmail } from "../utils/email";
import { prisma } from "../prisma/client";

/** Build Google Calendar "Add event" URL (UTC times in YYYYMMDDTHHmmssZ) */
function googleCalendarUrl(event: {
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: Date;
  endTime: Date;
}): string {
  const toUTC = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = toUTC(new Date(event.startTime));
  const end = toUTC(new Date(event.endTime));
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
  });
  if (event.description) params.set("details", event.description);
  if (event.location) params.set("location", event.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const eventCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: z.string().optional(),
  divisionId: z.string().uuid().optional(),
  expectedFamilyIds: z.array(z.string().uuid()).optional(),
});

const eventUpdateSchema = eventCreateSchema.partial();

export async function createEventController(req: Request, res: Response) {
  const parse = eventCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const data = parse.data;
  const created = await createEvent({
    ...data,
    startTime: new Date(data.startTime),
    endTime: new Date(data.endTime),
  });

  // Notify division members with event details and "Add to Google Calendar" link.
  if (created.divisionId) {
    const members = await prisma.member.findMany({
      where: { divisionId: created.divisionId },
      select: { email: true, fullName: true },
    });

    const addToCalUrl = googleCalendarUrl({
      title: created.title,
      description: created.description ?? undefined,
      location: created.location ?? undefined,
      startTime: created.startTime,
      endTime: created.endTime,
    });
    const startStr = created.startTime.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });
    const endStr = created.endTime.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });

    await Promise.all(
      members.map((m: { email: string; fullName: string }) =>
        sendEmail({
          to: m.email,
          subject: `New Event: ${created.title}`,
          text: `Dear ${m.fullName},\n\nYou are invited to the event "${created.title}".\n\n${created.description ? `Description: ${created.description}\n\n` : ""}When: ${startStr} – ${endStr}${created.location ? `\nWhere: ${created.location}` : ""}\n\nAdd to your Google Calendar: ${addToCalUrl}`,
          html: `<!DOCTYPE html><html><body style="font-family: sans-serif; max-width: 560px;">`
            + `<p>Dear ${m.fullName},</p>`
            + `<p>You are invited to the event <strong>${created.title}</strong>.</p>`
            + (created.description ? `<p>${created.description.replace(/\n/g, "<br>")}</p>` : "")
            + `<p><strong>When:</strong> ${startStr} – ${endStr}</p>`
            + (created.location ? `<p><strong>Where:</strong> ${created.location}</p>` : "")
            + `<p><a href="${addToCalUrl}" style="display: inline-block; padding: 10px 16px; background: #1a73e8; color: #fff; text-decoration: none; border-radius: 6px;">Add to Google Calendar</a></p>`
            + `</body></html>`,
        }),
      ),
    );
  }

  return res.status(201).json(created);
}

export async function listEventsController(req: Request, res: Response) {
  const scopeParam =
    typeof req.query.scope === "string" ? req.query.scope : undefined;
  const scope =
    scopeParam === "upcoming" || scopeParam === "past" ? scopeParam : undefined;
  const divisionIdParam =
    typeof req.query.divisionId === "string" ? req.query.divisionId : undefined;
  const divisionId =
    divisionIdParam && divisionIdParam.trim() !== ""
      ? divisionIdParam.trim()
      : undefined;
  const events = await listEvents({ scope, divisionId });
  return res.json(events);
}

export async function updateEventController(req: Request, res: Response) {
  const parse = eventUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  const data = parse.data;
  const updated = await updateEvent(id, {
    ...data,
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
  });
  return res.json(updated);
}

export async function deleteEventController(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    await deleteEvent(id);
    return res.status(204).send();
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      return res.status(404).json({ message: "Event not found" });
    }
    throw err;
  }
}

