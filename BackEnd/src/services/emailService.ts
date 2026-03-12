import nodemailer from "nodemailer";
import { env } from "../config/env";

// ── Lazy-created transporter ───────────────────────────────────────────────────
function createTransporter() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    return null; // SMTP not configured — emails will be skipped
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
}

async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn(
      `[Email] SMTP not configured — skipping email to ${options.to}. ` +
        "Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env to enable real emails.",
    );
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"GubaeTech" <${env.smtpFrom}>`,
      ...options,
    });
    console.log(`[Email] Sent to ${options.to} — messageId: ${info.messageId}`);
  } catch (err) {
    // Log but do NOT throw — email failure should not block the API response
    console.error(`[Email] Failed to send to ${options.to}:`, err);
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Send a welcome email when a member is approved.
 * @param to        Recipient email address
 * @param fullName  Member's full name
 * @param password  Plain-text temporary password (will be shown once only)
 */
export async function sendApprovalEmail(
  to: string,
  fullName: string,
  password: string,
) {
  const subject = "🎉 Your GubaeTech Membership Has Been Approved!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: #1a56db; padding: 24px 32px;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">GubaeTech</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #111827;">Welcome, ${fullName}! 🎉</h2>
        <p style="color: #374151; line-height: 1.6;">
          Your membership application has been <strong style="color: #16a34a;">approved</strong>.
          You are now an official member of GubaeTech.
        </p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Your Temporary Password</p>
          <p style="margin: 0; font-size: 24px; font-family: monospace; color: #111827; letter-spacing: 0.15em; font-weight: bold;">${password}</p>
        </div>

        <p style="color: #374151; line-height: 1.6;">
          Please log in and <strong>change your password immediately</strong> to secure your account.
        </p>

        <p style="color: #6b7280; font-size: 13px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          This is an automated message from GubaeTech. Do not reply to this email.
        </p>
      </div>
    </div>
  `;

  console.log(
    `[Email] Approval email for ${to} — temporary password: ${password}`,
  );
  await sendMail({ to, subject, html });
}

/**
 * Send a rejection notification email.
 * @param to        Recipient email address
 * @param fullName  Member's full name
 */
export async function sendRejectionEmail(to: string, fullName: string) {
  const subject = "Update on Your GubaeTech Membership Application";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: #1a56db; padding: 24px 32px;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">GubaeTech</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #111827;">Dear ${fullName},</h2>
        <p style="color: #374151; line-height: 1.6;">
          Thank you for your interest in joining GubaeTech. After careful review, we regret to inform you
          that your membership application has <strong style="color: #dc2626;">not been approved</strong> at this time.
        </p>
        <p style="color: #374151; line-height: 1.6;">
          If you believe this is a mistake or would like more information, please contact the administration team.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          This is an automated message from GubaeTech. Do not reply to this email.
        </p>
      </div>
    </div>
  `;

  console.log(`[Email] Rejection email sent to ${to}`);
  await sendMail({ to, subject, html });
}
