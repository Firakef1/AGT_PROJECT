import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env";

const connectionString = env.databaseUrl || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set for Prisma");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

