import { prisma } from "../prisma/client";

export async function createInventoryItem(data: {
  name: string;
  description?: string;
  quantity: number;
  location?: string;
}) {
  return prisma.inventoryItem.create({ data });
}

export async function listInventory() {
  return prisma.inventoryItem.findMany();
}

export async function updateInventoryItem(
  id: string,
  data: Partial<{
    name: string;
    description?: string;
    quantity: number;
    location?: string;
  }>,
) {
  return prisma.inventoryItem.update({ where: { id }, data });
}

export async function deleteInventoryItem(id: string) {
  await prisma.inventoryItem.delete({ where: { id } });
}

