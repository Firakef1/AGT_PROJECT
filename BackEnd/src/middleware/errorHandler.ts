import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

// ── Typed application error ────────────────────────────────────────────────────
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
    // Restore prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ── Centralized error handler (must be registered LAST in Express) ─────────────
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  // ── Known application errors ────────────────────────────────────────────────
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // ── Prisma well-known errors ────────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErr = err;
    switch (prismaErr.code) {
      case "P2002":
        return res.status(409).json({
          message: "A record with this value already exists.",
          field: (prismaErr.meta?.target as string[] | undefined)?.join(", "),
        });

      case "P2025":
        return res.status(404).json({ message: "Record not found." });

      case "P2003":
        return res.status(400).json({
          message: "Referenced record does not exist.",
        });

      default:
        console.error("[Prisma]", prismaErr.code, prismaErr.message);
        return res.status(500).json({ message: "Database error." });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ message: "Invalid data provided." });
  }

  // ── Unknown / unexpected errors ─────────────────────────────────────────────
  console.error("[Unhandled]", err);
  res.status(500).json({ message: "Internal server error." });
}
