import { Request, Response } from "express";
import { z } from "zod";
import {
  createDivision,
  deleteDivision,
  listDivisions,
  updateDivision,
} from "../services/divisionService";

const divisionCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const divisionUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export async function createDivisionController(req: Request, res: Response) {
  const parse = divisionCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const division = await createDivision(parse.data);
  return res.status(201).json(division);
}

export async function listDivisionsController(_req: Request, res: Response) {
  const divisions = await listDivisions();
  return res.json(divisions);
}

export async function updateDivisionController(req: Request, res: Response) {
  const parse = divisionUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const { id } = req.params;
  const updated = await updateDivision(id, parse.data);
  return res.json(updated);
}

export async function deleteDivisionController(req: Request, res: Response) {
  const { id } = req.params;
  await deleteDivision(id);
  return res.status(204).send();
}

