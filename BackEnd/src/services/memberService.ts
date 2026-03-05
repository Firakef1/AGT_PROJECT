import { prisma } from "../prisma/client";

export async function createMember(data: {
  studentId: string;
  fullName: string;
  email: string;
  phone?: string;
  divisionId: string;
}) {
  return prisma.member.create({ data });
}

export async function listMembers(filter?: { divisionId?: string }) {
  return prisma.member.findMany({
    where: {
      divisionId: filter?.divisionId,
    },
    include: {
      division: true,
    },
  });
}

export async function updateMember(
  id: string,
  data: Partial<{
    fullName: string;
    email: string;
    phone?: string;
    divisionId: string;
  }>,
) {
  return prisma.member.update({
    where: { id },
    data,
  });
}

export async function deleteMember(id: string) {
  await prisma.member.delete({ where: { id } });
}

