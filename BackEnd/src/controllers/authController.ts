import { Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "../services/authService";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  role: z.enum(["ADMIN", "DIVISION_HEAD", "MEMBER"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerController(req: Request, res: Response) {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  try {
    const user = await registerUser(parse.data);
    return res.status(201).json(user);
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ message: "Email already in use" });
    }
    throw err;
  }
}

export async function loginController(req: Request, res: Response) {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const result = await loginUser(parse.data);
  if (!result) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json(result);
}

