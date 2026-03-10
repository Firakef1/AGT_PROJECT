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

/** Per-member attendance summary for a division (participation overview) */
export async function getDivisionAttendanceSummary(divisionId: string) {
  const [divisionEvents, members] = await Promise.all([
    prisma.event.findMany({
      where: { divisionId },
      select: { id: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.member.findMany({
      where: { divisionId },
      select: { id: true, fullName: true, email: true },
    }),
  ]);

  const eventIds = divisionEvents.map((e) => e.id);
  const totalEvents = eventIds.length;

  const attendances = await prisma.attendance.findMany({
    where: {
      eventId: { in: eventIds },
      memberId: { in: members.map((m) => m.id) },
    },
    select: { memberId: true, eventId: true, status: true },
  });

  const presentByMember = new Map<string, number>();
  for (const a of attendances) {
    if (a.status === "PRESENT") {
      presentByMember.set(
        a.memberId,
        (presentByMember.get(a.memberId) ?? 0) + 1,
      );
    }
  }

  return {
    totalDivisionEvents: totalEvents,
    members: members.map((m) => {
      const presentCount = presentByMember.get(m.id) ?? 0;
      const participationPercentage =
        totalEvents === 0 ? 0 : (presentCount / totalEvents) * 100;
      return {
        memberId: m.id,
        fullName: m.fullName,
        email: m.email,
        presentCount,
        totalEvents: totalEvents,
        participationPercentage: Math.round(participationPercentage * 10) / 10,
      };
    }),
  };
}

