import { prisma } from "../prisma/client";

export async function markAttendance(params: {
  memberId: string;
  eventId: string;
  status: "PRESENT" | "ABSENT" | "EXCUSED";
}) {
  return prisma.attendance.upsert({
    where: {
      memberId_eventId: {
        memberId: params.memberId,
        eventId: params.eventId,
      },
    },
    create: {
      memberId: params.memberId,
      eventId: params.eventId,
      status: params.status,
    },
    update: {
      status: params.status,
    },
  });
}

export async function getEventAttendance(eventId: string) {
  return prisma.attendance.findMany({
    where: { eventId },
    include: { member: true },
  });
}

export async function getMemberAttendanceSummary(memberId: string) {
  const records = await prisma.attendance.findMany({
    where: { memberId },
  });

  const total = records.length;
  const present = records.filter((r: { status: string }) => r.status === "PRESENT").length;
  const participationPercentage = total === 0 ? 0 : (present / total) * 100;

  return {
    totalEvents: total,
    presentCount: present,
    participationPercentage,
  };
}

