import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
import { env } from "../config/env";

export async function registerUser(params: {
  email: string;
  password: string;
  fullName: string;
  role?: "ADMIN" | "DIVISION_HEAD" | "MEMBER" | "MEMBERS_MANAGER";
}) {
  const hashed = await bcrypt.hash(params.password, 10);
  const user = await prisma.user.create({
    data: {
      email: params.email,
      password: hashed,
      fullName: params.fullName,
      role: params.role ?? "MEMBER",
    },
  });

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}

export async function loginUser(params: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (!user) {
    return null;
  }

  if (user.password == null || user.password === "") {
    return null;
  }

  const match = await bcrypt.compare(params.password, user.password);
  if (!match) {
    return null;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: "8h" },
  );

  const userWithMember = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      member: {
        select: {
          id: true,
          divisionId: true,
          division: { select: { id: true, name: true } },
        },
      },
    },
  });

  return {
    token,
    user: userWithMember
      ? {
          id: userWithMember.id,
          email: userWithMember.email,
          fullName: userWithMember.fullName,
          role: userWithMember.role,
          member: userWithMember.member
            ? {
                id: userWithMember.member.id,
                divisionId: userWithMember.member.divisionId,
                division: userWithMember.member.division,
              }
            : null,
        }
      : {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          member: null,
        },
  };
}

/** Return current user with member and division for session restore / division scoping */
export async function getCurrentUser(userId: string) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      member: {
        select: {
          id: true,
          divisionId: true,
          division: { select: { id: true, name: true } },
        },
      },
    },
  });
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    member: u.member
      ? {
          id: u.member.id,
          divisionId: u.member.divisionId,
          division: u.member.division,
        }
      : null,
  };
}

