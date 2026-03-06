import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";

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
  const mmDivision = await prisma.division.findUnique({
    where: { name: "Members Management" },
  });

  if (!mmDivision) {
    await prisma.division.create({
      data: {
        name: "Members Management",
        description: "Initial management division for member oversight",
      },
    });
    // eslint-disable-next-line no-console
    console.log("[seed] Created 'Members Management' division.");
  }
}

