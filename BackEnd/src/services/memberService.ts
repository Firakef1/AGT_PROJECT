import { prisma } from "../prisma/client.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AppError } from "../middleware/errorHandler.js";
import { sendApprovalEmail, sendRejectionEmail } from "./emailService.js";

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Generate a cryptographically random 8-character alphanumeric password */
function generatePassword(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

// ── Service functions ──────────────────────────────────────────────────────────

export async function registerMember(data: {
  studentId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  divisionId?: string | null;
}) {
  const prismaData: any = {
    studentId: data.studentId,
    fullName: data.fullName,
    email: data.email,
    status: "PENDING",
  };

  if (data.phone && data.phone.trim() !== "") {
    prismaData.phone = data.phone;
  }

  if (data.divisionId && data.divisionId.trim() !== "") {
    prismaData.divisionId = data.divisionId;
    prismaData.divisionJoinedAt = new Date();
  }

  return prisma.member.create({ data: prismaData });
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
    orderBy: { createdAt: "desc" },
    include: {
      division: true,
      user: {
        select: { id: true, role: true },
      },
    },
  });
}

export async function approveMember(id: string) {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw new AppError(404, "Member not found.");
  if (member.status !== "PENDING")
    throw new AppError(400, "Only pending members can be approved.");

  // Generate a random temporary password
  const plainPassword = generatePassword(8);
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Create user account
  const user = await prisma.user.create({
    data: {
      email: member.email,
      fullName: member.fullName,
      password: hashedPassword,
      role: "MEMBER",
    },
  });

  const updated = await prisma.member.update({
    where: { id },
    data: { status: "APPROVED", userId: user.id },
  });

  // Send approval email (non-blocking — errors are logged, not thrown)
  await sendApprovalEmail(member.email, member.fullName, plainPassword);

  return updated;
}

export async function rejectMember(id: string) {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw new AppError(404, "Member not found.");
  if (member.status !== "PENDING")
    throw new AppError(400, "Only pending members can be rejected.");

  const updated = await prisma.member.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  // Send rejection email (non-blocking)
  await sendRejectionEmail(member.email, member.fullName);

  return updated;
}

/**
 * Assign (or unassign) a member to/from a division.
 * Passing `null` as divisionId removes the member from their current division.
 */
export async function assignMemberToDivision(
  memberId: string,
  divisionId: string | null,
) {
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) throw new AppError(404, "Member not found.");
  if (member.status !== "APPROVED")
    throw new AppError(400, "Only approved members can be assigned to a division.");

  if (divisionId) {
    const division = await prisma.division.findUnique({ where: { id: divisionId } });
    if (!division) throw new AppError(404, "Division not found.");
  }

  return prisma.member.update({
    where: { id: memberId },
    data: {
      divisionId: divisionId ?? null,
      // Record join date when assigning; clear it when removing
      divisionJoinedAt: divisionId ? new Date() : null,
    },
    include: { division: true },
  });
}

/**
 * Promote a member to DIVISION_HEAD for the specified division.
 * Rules:
 *   - Member must be APPROVED and have a user account
 *   - Member must currently belong to that exact division
 *   - Member must have been in that division for at least 6 months
 *   - Division must not already have a leader
 */
export async function assignDivisionLeader(memberId: string, divisionId: string) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: { user: true },
  });

  if (!member) throw new AppError(404, "Member not found.");
  if (!member.userId)
    throw new AppError(400, "Member must be approved and have a user account.");

  // Must belong to the target division
  if (member.divisionId !== divisionId)
    throw new AppError(
      400,
      "Member does not belong to this division. Assign them first.",
    );

  // 6-month eligibility check
  if (!member.divisionJoinedAt) {
    throw new AppError(
      403,
      "Member must be in this division for at least 6 months to become a leader.",
    );
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  if (member.divisionJoinedAt > sixMonthsAgo) {
    const joinedDate = member.divisionJoinedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const eligibleDate = new Date(member.divisionJoinedAt);
    eligibleDate.setMonth(eligibleDate.getMonth() + 6);
    const eligibleDateStr = eligibleDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    throw new AppError(
      403,
      `Member joined this division on ${joinedDate} and will be eligible for leadership on ${eligibleDateStr} (6-month minimum required).`,
    );
  }

  // Division must not already have a leader
  const existingLeader = await prisma.user.findFirst({
    where: {
      role: "DIVISION_HEAD",
      member: { divisionId },
    },
  });

  if (existingLeader) {
    throw new AppError(
      409,
      "This division already has a leader. Remove the current leader first.",
    );
  }

  // Promote user to DIVISION_HEAD
  return prisma.user.update({
    where: { id: member.userId },
    data: { role: "DIVISION_HEAD" },
    select: { id: true, email: true, fullName: true, role: true },
  });
}

export async function updateMember(
  id: string,
  data: Partial<{
    fullName: string;
    email: string;
    phone?: string | null;
    divisionId?: string | null;
  }>,
) {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw new AppError(404, "Member not found.");

  return prisma.member.update({ where: { id }, data });
}

export async function deleteMember(id: string) {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw new AppError(404, "Member not found.");
  await prisma.member.delete({ where: { id } });
}
