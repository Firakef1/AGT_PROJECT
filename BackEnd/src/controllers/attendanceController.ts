import { Request, Response } from "express";
import { z } from "zod";
import {
  getEventAttendance,
  getMemberAttendanceSummary,
  markAttendance,
} from "../services/attendanceService";
import { sendEmail } from "../utils/email";
import { prisma } from "../prisma/client";

const attendanceMarkSchema = z.object({
  memberId: z.string().uuid(),
  eventId: z.string().uuid(),
  status: z.enum(["PRESENT", "ABSENT", "EXCUSED"]),
});

export async function markAttendanceController(req: Request, res: Response) {
  const parse = attendanceMarkSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const record = await markAttendance(parse.data);

  // Send attendance summary email for the member for this event
  const member = await prisma.member.findUnique({
    where: { id: parse.data.memberId },
  });
  const event = await prisma.event.findUnique({
    where: { id: parse.data.eventId },
  });

  if (member && event) {
    await sendEmail({
      to: member.email,
      subject: `Attendance for ${event.title}`,
      text: `Hi ${member.fullName}, your attendance for "${event.title}" is recorded as ${parse.data.status}.`,
    });
  }

  return res.status(200).json(record);
}

export async function getEventAttendanceController(
  req: Request,
  res: Response,
) {
  const { eventId } = req.params;
  const list = await getEventAttendance(eventId);
  return res.json(list);
}

export async function getMemberAttendanceSummaryController(
  req: Request,
  res: Response,
) {
  const { memberId } = req.params;
  const summary = await getMemberAttendanceSummary(memberId);
  return res.json(summary);
}

