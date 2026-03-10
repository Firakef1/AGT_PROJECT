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

