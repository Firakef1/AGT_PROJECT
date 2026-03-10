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

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

