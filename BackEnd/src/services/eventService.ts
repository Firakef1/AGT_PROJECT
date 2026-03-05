import { prisma } from "../prisma/client";

export async function createEvent(data: {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  divisionId?: string;
}) {
  return prisma.event.create({ data });
}

export async function listEvents(params?: { scope?: "upcoming" | "past" }) {
  const now = new Date();
  let where: Record<string, unknown> | undefined;

  if (params?.scope === "upcoming") {
    where = { startTime: { gte: now } };
  } else if (params?.scope === "past") {
    where = { endTime: { lt: now } };
  }

  return prisma.event.findMany({
    where,
    orderBy: { startTime: "asc" },
    include: { division: true },
  });
}

export async function updateEvent(
  id: string,
  data: Partial<{
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    divisionId?: string;
  }>,
) {
  return prisma.event.update({ where: { id }, data });
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
}

