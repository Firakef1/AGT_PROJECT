import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client";
import { env } from "../config/env";

export async function ensureInitialAdmin() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existingAdmin) {
    return;
  }

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

