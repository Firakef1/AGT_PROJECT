import { prisma } from "../prisma/client";

export async function createEvent(data: {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  divisionId?: string;
  expectedFamilyIds?: string[];
}) {
  const { expectedFamilyIds, ...rest } = data;
  return prisma.event.create({
      data: {
          ...rest,
          expectedFamilies: expectedFamilyIds ? {
              connect: expectedFamilyIds.map(id => ({ id }))
          } : undefined
      }
  });
}

export async function listEvents(params?: {
  scope?: "upcoming" | "past";
  divisionId?: string;
}) {
  const now = new Date();
  const where: Record<string, unknown> = {};

  if (params?.scope === "upcoming") {
    where.startTime = { gte: now };
  } else if (params?.scope === "past") {
    where.endTime = { lt: now };
  }

  if (params?.divisionId) {
    where.divisionId = params.divisionId;
  }

  return prisma.event.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: { startTime: "asc" },
    include: { division: true, expectedFamilies: true },
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
    expectedFamilyIds?: string[];
  }>,
) {
  const { expectedFamilyIds, ...rest } = data;
  return prisma.event.update({ 
      where: { id },
      data: {
          ...rest,
          expectedFamilies: expectedFamilyIds ? {
              set: expectedFamilyIds.map(fid => ({ id: fid }))
          } : undefined
      }
  });
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
}

