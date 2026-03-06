import { Request, Response } from "express";
import { z } from "zod";
import {
  registerMember,
  approveMember,
  rejectMember,
  listMembers,
  updateMember,
  deleteMember,
  assignDivisionLeader,
} from "../services/memberService.js";

const memberRegisterSchema = z.object({
  studentId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  divisionId: z.string().uuid().optional(),
});

const memberUpdateSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  divisionId: z.string().uuid().optional(),
});

const assignLeaderSchema = z.object({
  divisionId: z.string().uuid(),
});

export async function registerMemberController(req: Request, res: Response) {
  const parse = memberRegisterSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const member = await registerMember(parse.data);
  return res.status(201).json(member);
}

export async function listMembersController(req: Request, res: Response) {
  const divisionId =
    typeof req.query.divisionId === "string" ? req.query.divisionId : undefined;
  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;

  const members = await listMembers({ divisionId, status });
  return res.json(members);
}

export async function approveMemberController(req: Request, res: Response) {
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "ID is required" });
  try {
    const updated = await approveMember(id);
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function rejectMemberController(req: Request, res: Response) {
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "ID is required" });
  try {
    const updated = await rejectMember(id);
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function assignDivisionLeaderController(req: Request, res: Response) {
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "ID is required" });
  const parse = assignLeaderSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  try {
    const result = await assignDivisionLeader(id, parse.data.divisionId);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function updateMemberController(req: Request, res: Response) {
  const parse = memberUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "ID is required" });
  const updated = await updateMember(id, parse.data);
  return res.json(updated);
}

export async function deleteMemberController(req: Request, res: Response) {
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "ID is required" });
  await deleteMember(id);
  return res.status(204).send();
}

