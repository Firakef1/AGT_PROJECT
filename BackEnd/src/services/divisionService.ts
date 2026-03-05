import { prisma } from "../prisma/client";

export async function createDivision(data: {
  name: string;
  description?: string;
}) {
  return prisma.division.create({ data });
}

export async function listDivisions() {
  return prisma.division.findMany({
    include: {
      members: true,
      events: true,
    },
  });
}

export async function updateDivision(
  id: string,
  data: Partial<{
    name: string;
    description?: string;
  }>,
) {
  return prisma.division.update({ where: { id }, data });
}

export async function deleteDivision(id: string) {
  await prisma.division.delete({ where: { id } });
}

