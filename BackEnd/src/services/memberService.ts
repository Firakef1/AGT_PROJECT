import { prisma } from "../prisma/client.js";
import bcrypt from "bcryptjs";

export async function registerMember(data: {
  studentId: string;
  fullName: string;
  email: string;
  phone?: string;
  divisionId?: string;
}) {
  return prisma.member.create({
    data: {
      ...data,
      status: "PENDING",
    },
  });
}

export async function listMembers(filter?: {
  divisionId?: string;
  status?: string;
}) {
  const where: any = {};
  if (filter?.divisionId) where.divisionId = filter.divisionId;
  if (filter?.status) where.status = filter.status;

  return prisma.member.findMany({
    where,
    include: {
      division: true,
      user: {
        select: {
          id: true,
          role: true,
        },
      },
    },
  });
}

export async function approveMember(id: string) {
  const member = await prisma.member.findUnique({
    where: { id },
  });

  if (!member) throw new Error("Member not found");
  if (member.status !== "PENDING") throw new Error("Member is not pending");

  // Create user account for the member
  const temporaryPassword = await bcrypt.hash("Welcome123!", 10);
  const user = await prisma.user.create({
    data: {
      email: member.email,
      fullName: member.fullName,
      password: temporaryPassword,
      role: "MEMBER",
    },
  });

  const updated = await prisma.member.update({
    where: { id },
    data: {
      status: "APPROVED",
      userId: user.id,
    },
  });

  // Mock sending email
  // eslint-disable-next-line no-console
  console.log(`[Email] To: ${member.email} - Your membership has been APPROVED!`);

  return updated;
}

export async function rejectMember(id: string) {
  const member = await prisma.member.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  // Mock sending email
  // eslint-disable-next-line no-console
  console.log(`[Email] To: ${member.email} - Your membership application was REJECTED.`);

  return member;
}

export async function assignDivisionLeader(memberId: string, divisionId: string) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: { user: true },
  });

  if (!member || !member.userId) {
    throw new Error("Approved member with user account required");
  }

  // Check if division already has a leader
  const existingLeader = await prisma.user.findFirst({
    where: {
      role: "DIVISION_HEAD",
      member: {
        divisionId,
      },
    },
  });

  if (existingLeader) {
    throw new Error("Division already has a leader. Remove current leader first.");
  }

  // Update member's division
  await prisma.member.update({
    where: { id: memberId },
    data: { divisionId },
  });

  // Promote user to DIVISION_HEAD
  return prisma.user.update({
    where: { id: member.userId },
    data: { role: "DIVISION_HEAD" },
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

