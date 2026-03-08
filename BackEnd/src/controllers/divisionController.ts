import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createDivision,
  deleteDivision,
  listDivisions,
  updateDivision,
} from "../services/divisionService.js";
import { assignDivisionLeader } from "../services/memberService.js";

const divisionCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const divisionUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

const setLeaderSchema = z.object({
  memberId: z.string().uuid(),
});

export async function createDivisionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parse = divisionCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }
  try {
    const division = await createDivision(parse.data);
    return res.status(201).json(division);
  } catch (err) {
    next(err);
  }
}

export async function listDivisionsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const divisions = await listDivisions();
    return res.json(divisions);
  } catch (err) {
    next(err);
  }
}

export async function updateDivisionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parse = divisionUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }
  const { id } = req.params;
  try {
    const updated = await updateDivision(id, parse.data);
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteDivisionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  try {
    await deleteDivision(id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * POST /divisions/:id/set-leader
 * Body: { memberId: string }
 *
 * Assigns an eligible member (approved + in division ≥ 6 months) as
 * the DIVISION_HEAD of division :id.
 */
export async function setDivisionLeaderController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  const parse = setLeaderSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }
  try {
    const result = await assignDivisionLeader(parse.data.memberId, id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
