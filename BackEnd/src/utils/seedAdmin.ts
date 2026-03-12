import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client";
import { env } from "../config/env";

export async function ensureInitialAdmin() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!existingAdmin) {
    const hashed = await bcrypt.hash(env.adminPassword, 10);

    await prisma.user.create({
      data: {
        email: env.adminEmail,
        password: hashed,
        fullName: env.adminFullName,
        role: "ADMIN",
      },
    });

    // eslint-disable-next-line no-console
    console.log(
      `[seed] Created initial admin user ${env.adminEmail}. Please change the password in production.`,
    );
  }

  // Seed "Members Management" division
  let mmDivision = await prisma.division.findUnique({
    where: { name: "Members Management" },
  });

  if (!mmDivision) {
    mmDivision = await prisma.division.create({
      data: {
        name: "Members Management",
        description: "Initial management division for member oversight",
      },
    });
    // eslint-disable-next-line no-console
    console.log("[seed] Created 'Members Management' division.");
  }

  // Seed or reset Members Division leader (MEMBERS_MANAGER) so you can log in as division leader
  if (!mmDivision) return;

  const hashedLead = await bcrypt.hash(env.membersLeadPassword, 10);
  const existingMembersLead = await prisma.user.findUnique({
    where: { email: env.membersLeadEmail },
  });

  let membersLeadUser: { id: string };

  if (existingMembersLead) {
    await prisma.user.update({
      where: { id: existingMembersLead.id },
      data: {
        password: hashedLead,
        fullName: env.membersLeadFullName,
        role: "MEMBERS_MANAGER",
      },
    });
    membersLeadUser = { id: existingMembersLead.id };
    // eslint-disable-next-line no-console
    console.log(
      `[seed] Reset Members Division leader password: ${env.membersLeadEmail} (password: ${env.membersLeadPassword}).`,
    );
  } else {
    membersLeadUser = await prisma.user.create({
      data: {
        email: env.membersLeadEmail,
        password: hashedLead,
        fullName: env.membersLeadFullName,
        role: "MEMBERS_MANAGER",
      },
    });
    // eslint-disable-next-line no-console
    console.log(
      `[seed] Created Members Division leader: ${env.membersLeadEmail} (password: ${env.membersLeadPassword}).`,
    );
  }

  const existingMember = await prisma.member.findUnique({
    where: { email: env.membersLeadEmail },
  });
  const studentId = `SEED-MEM-${membersLeadUser.id.slice(0, 8)}`;

  if (!existingMember) {
    await prisma.member.create({
      data: {
        studentId,
        fullName: env.membersLeadFullName,
        gender: "Other",
        email: env.membersLeadEmail,
        status: "APPROVED",
        divisionId: mmDivision.id,
        divisionJoinedAt: new Date(),
        userId: membersLeadUser.id,
      },
    });
  } else {
    await prisma.member.update({
      where: { id: existingMember.id },
      data: {
        userId: membersLeadUser.id,
        divisionId: mmDivision.id,
        divisionJoinedAt: new Date(),
        status: "APPROVED",
        fullName: env.membersLeadFullName,
      },
    });
  }
}

