import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  registerMember,
  approveMember,
  rejectMember,
  listMembers,
  updateMember,
  deleteMember,
  assignDivisionLeader,
  assignMemberToDivision,
} from "../services/memberService";

// ── Validation schemas ─────────────────────────────────────────────────────────

const memberRegisterSchema = z.object({
  studentId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"]),
  divisionId: z.string().uuid().optional().nullable().or(z.literal("")),
  section: z.number().int().optional().nullable(),
  language: z.enum(["AFAN_OROMO", "AMHARIC", "BOTH"]),
});

const memberUpdateSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"]).optional().nullable(),
  divisionId: z.string().uuid().optional().nullable().or(z.literal("")),
  familyId: z.string().uuid().optional().nullable().or(z.literal("")),
  section: z.number().int().optional().nullable(),
  language: z.enum(["AFAN_OROMO", "AMHARIC", "BOTH"]).optional().nullable(),
});

const assignLeaderSchema = z.object({
  divisionId: z.string().uuid(),
});

const assignDivisionSchema = z.object({
  divisionId: z.string().uuid().nullable(),
});

// ── Controllers ────────────────────────────────────────────────────────────────

export async function registerMemberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parse = memberRegisterSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }
  try {
    const member = await registerMember(parse.data);
    return res.status(201).json(member);
  } catch (err) {
    next(err);
  }
}

export async function listMembersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const divisionId =
    typeof req.query.divisionId === "string" ? req.query.divisionId : undefined;
  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;

  try {
    const members = await listMembers({ divisionId, status });
    return res.json(members);
  } catch (err) {
    next(err);
  }
}

export async function approveMemberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const updated = await approveMember(id);
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function rejectMemberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const updated = await rejectMember(id);
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function assignDivisionLeaderController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  const parse = assignLeaderSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }
  try {
    const result = await assignDivisionLeader(id, parse.data.divisionId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function assignMemberToDivisionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  const parse = assignDivisionSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }
  try {
    const result = await assignMemberToDivision(id, parse.data.divisionId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateMemberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parse = memberUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }
  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const updated = await updateMember(id, parse.data);
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteMemberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    await deleteMember(id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
