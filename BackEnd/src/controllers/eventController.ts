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

const eventCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: z.string().optional(),
  divisionId: z.string().uuid().optional(),
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

  // Notify members of the assigned division, if any.
  if (created.divisionId) {
    const members = await prisma.member.findMany({
      where: { divisionId: created.divisionId },
      select: { email: true, fullName: true },
    });

    await Promise.all(
      members.map((m) =>
        sendEmail({
          to: m.email,
          subject: `New Event: ${created.title}`,
          text: `Dear ${m.fullName},\n\nYou are invited to the event "${created.title}".`,
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
  const events = await listEvents({ scope });
  return res.json(events);
}

export async function updateEventController(req: Request, res: Response) {
  const parse = eventUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const { id } = req.params;
  const data = parse.data;
  const updated = await updateEvent(id, {
    ...data,
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
  });
  return res.json(updated);
}

export async function deleteEventController(req: Request, res: Response) {
  const { id } = req.params;
  await deleteEvent(id);
  return res.status(204).send();
}

