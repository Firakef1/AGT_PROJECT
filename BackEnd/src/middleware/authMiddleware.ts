import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../prisma/client";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as {
      userId: string;
      role: string;
    };
    (req as AuthRequest).user = { id: payload.userId, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function authorize(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(authReq.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id },
      select: { id: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  };
}

