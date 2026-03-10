import { prisma } from "../prisma/client";

export async function recordTransaction(data: {
  type: "INCOME" | "EXPENSE";
  amount: number;
  description?: string;
  divisionId?: string;
}) {
  return prisma.financeTransaction.create({
    data,
  });
}

export async function getFinanceSummary(params?: {
  divisionId?: string;
  from?: Date;
  to?: Date;
}) {
  const where: any = {};

  if (params?.divisionId) {
    where.divisionId = params.divisionId;
  }

  if (params?.from || params?.to) {
    where.occurredAt = {};
    if (params.from) {
      where.occurredAt.gte = params.from;
    }
    if (params.to) {
      where.occurredAt.lte = params.to;
    }
  }

  const transactions = await prisma.financeTransaction.findMany({
    where,
  });

  const income = transactions
    .filter((t: any) => t.type === "INCOME")
    .reduce((sum: number, t: any) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t: any) => t.type === "EXPENSE")
    .reduce((sum: number, t: any) => sum + t.amount, 0);
  const balance = income - expenses;

  return {
    income,
    expenses,
    balance,
    count: transactions.length,
  };
}

export async function listTransactions(params?: { divisionId?: string }) {
  const where: any = {};
  if (params?.divisionId) {
    where.divisionId = params.divisionId;
  }

  return prisma.financeTransaction.findMany({
    where,
    orderBy: { occurredAt: "desc" },
  });
}

const DEFAULT_BUDGET_CATEGORIES: { name: string; allocated: number; color: string }[] = [
  { name: "Events", allocated: 120000, color: "#1a56db" },
  { name: "Administrative", allocated: 50000, color: "#d97706" },
  { name: "Social Services", allocated: 80000, color: "#16a34a" },
  { name: "Maintenance", allocated: 40000, color: "#dc2626" },
  { name: "Other", allocated: 25000, color: "#7c3aed" },
];

export async function getBudget(params?: { divisionId?: string }) {
  const transactions = await listTransactions(params);
  const categoryTotals: Record<string, number> = {};
  for (const t of transactions) {
    if (t.type !== "EXPENSE") continue;
    const match = t.description?.match(/\bCategory:\s*([^|]+)/i);
    const category = (match && match[1] ? match[1].trim() : null) || "Other";
    categoryTotals[category] = (categoryTotals[category] || 0) + Number(t.amount);
  }
  return DEFAULT_BUDGET_CATEGORIES.map((c) => ({
    name: c.name,
    allocated: c.allocated,
    spent: Math.round(categoryTotals[c.name] || 0),
    color: c.color,
  }));
}

