import * as dotenv from "dotenv";

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "no-reply@gubaetech.local",
  adminEmail: process.env.ADMIN_EMAIL || "admin@gubaetech.local",
  adminPassword: process.env.ADMIN_PASSWORD || "ChangeMe123!",
  adminFullName: process.env.ADMIN_FULL_NAME || "Gubae Admin",
};

