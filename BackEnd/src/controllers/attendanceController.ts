import { Request, Response } from "express";
import { z } from "zod";
import {
  getDivisionAttendanceSummary,
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

  // consecutive absence logic
  const member = await prisma.member.findUnique({
    where: { id: parse.data.memberId },
  });
  const currentEvent = await prisma.event.findUnique({
    where: { id: parse.data.eventId },
    include: { expectedFamilies: true },
  });

  if (member && currentEvent && parse.data.status === 'ABSENT') {
    // Check if the member was absent at the immediately preceding expected event
    const previousEvent = await prisma.event.findFirst({
        where: {
            startTime: { lt: currentEvent.startTime },
            OR: [
              { divisionId: member.divisionId },
              { expectedFamilies: { some: { id: member.familyId || undefined } } }
            ]
        },
        orderBy: { startTime: 'desc' },
    });

    if (previousEvent) {
        const previousAttendance = await prisma.attendance.findUnique({
            where: {
                memberId_eventId: {
                    memberId: member.id,
                    eventId: previousEvent.id
                }
            }
        });

        // if they were absent for the previous expected event, or didn't show up at all
        if (!previousAttendance || previousAttendance.status === 'ABSENT') {
            const familyParents = await prisma.member.findMany({
                where: {
                    familyId: member.familyId,
                    familyRole: { in: ['FATHER', 'MOTHER'] }
                }
            });

            const recipients = [member.email];
            familyParents.forEach((p: { email: string }) => recipients.push(p.email));
            
            // Assuming devision head is cc'd, mock division email for now
            const divisionEmail = 'members@genesis.org';
            recipients.push(divisionEmail);

            for(const recipient of recipients) {
                await sendEmail({
                    to: recipient,
                    subject: `Consecutive Absence Alert for ${member.fullName}`,
                    text: `Notice: ${member.fullName} has been absent for two consecutive expected events ("${previousEvent.title}" and "${currentEvent.title}").`,
                });
            }
        }
    }
  } else if (member && currentEvent && parse.data.status === 'PRESENT') {
      await sendEmail({
          to: member.email,
          subject: `Attendance for ${currentEvent.title}`,
          text: `Hi ${member.fullName}, your attendance for "${currentEvent.title}" is recorded as ${parse.data.status}.`,
      });
  }

  return res.status(200).json(record);
}

export async function getEventAttendanceController(
  req: Request,
  res: Response,
) {
  const eventId = req.params.eventId;
  if (typeof eventId !== "string") {
    return res.status(400).json({ message: "Invalid eventId" });
  }
  const list = await getEventAttendance(eventId);
  return res.json(list);
}

export async function getMemberAttendanceSummaryController(
  req: Request,
  res: Response,
) {
  const memberId = req.params.memberId;
  if (typeof memberId !== "string") {
    return res.status(400).json({ message: "Invalid memberId" });
  }
  const summary = await getMemberAttendanceSummary(memberId);
  return res.json(summary);
}

export async function getDivisionAttendanceSummaryController(
  req: Request,
  res: Response,
) {
  const divisionId = req.params.divisionId;
  if (typeof divisionId !== "string") {
    return res.status(400).json({ message: "Invalid divisionId" });
  }
  const summary = await getDivisionAttendanceSummary(divisionId);
  return res.json(summary);
}

