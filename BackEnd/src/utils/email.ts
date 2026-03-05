import nodemailer from "nodemailer";
import { env } from "../config/env";

export const mailTransporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: env.smtpUser
    ? {
        user: env.smtpUser,
        pass: env.smtpPass,
      }
    : undefined,
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  if (!env.smtpHost) {
    // In development without SMTP set up, just log instead of failing hard.
    // This keeps local dev smooth during the hackathon.
    // eslint-disable-next-line no-console
    console.log("[email:dev-log]", options);
    return;
  }

  await mailTransporter.sendMail({
    from: env.smtpFrom,
    ...options,
  });
}

