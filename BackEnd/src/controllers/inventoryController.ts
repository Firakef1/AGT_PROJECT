import { Request, Response } from "express";
import { z } from "zod";
import {
  createInventoryItem,
  deleteInventoryItem,
  listInventory,
  updateInventoryItem,
} from "../services/inventoryService";

const inventoryCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().int(),
  location: z.string().optional(),
});

const inventoryUpdateSchema = inventoryCreateSchema.partial();

export async function createInventoryItemController(req: Request, res: Response) {
  const parse = inventoryCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const item = await createInventoryItem(parse.data);
  return res.status(201).json(item);
}

export async function listInventoryController(_req: Request, res: Response) {
  const items = await listInventory();
  return res.json(items);
}

export async function updateInventoryItemController(req: Request, res: Response) {
  const parse = inventoryUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  const item = await updateInventoryItem(id, parse.data);
  return res.json(item);
}

export async function deleteInventoryItemController(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  await deleteInventoryItem(id);
  return res.status(204).send();
}

