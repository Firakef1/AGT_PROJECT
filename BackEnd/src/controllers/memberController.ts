import { Request, Response } from "express";
import { z } from "zod";
import {
  createMember,
  deleteMember,
  listMembers,
  updateMember,
} from "../services/memberService";

const memberCreateSchema = z.object({
  studentId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  divisionId: z.string().uuid(),
});

const memberUpdateSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  divisionId: z.string().uuid().optional(),
});

export async function createMemberController(req: Request, res: Response) {
  const parse = memberCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const member = await createMember(parse.data);
  return res.status(201).json(member);
}

export async function listMembersController(req: Request, res: Response) {
  const divisionId =
    typeof req.query.divisionId === "string" ? req.query.divisionId : undefined;
  const members = await listMembers({ divisionId });
  return res.json(members);
}

export async function updateMemberController(req: Request, res: Response) {
  const parse = memberUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const { id } = req.params;
  const updated = await updateMember(id, parse.data);
  return res.json(updated);
}

export async function deleteMemberController(req: Request, res: Response) {
  const { id } = req.params;
  await deleteMember(id);
  return res.status(204).send();
}

