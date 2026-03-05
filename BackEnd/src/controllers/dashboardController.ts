import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export async function dashboardSummaryController(_req: Request, res: Response) {
  const [memberCount, eventCount, inventoryCount, financeSummary] =
    await Promise.all([
      prisma.member.count(),
      prisma.event.count(),
      prisma.inventoryItem.count(),
      prisma.financeTransaction.groupBy({
        by: ["type"],
        _sum: { amount: true },
      }),
    ]);

  const incomeGroup = financeSummary.find((g) => g.type === "INCOME");
  const expenseGroup = financeSummary.find((g) => g.type === "EXPENSE");

  const income = incomeGroup?._sum.amount ?? 0;
  const expenses = expenseGroup?._sum.amount ?? 0;

  res.json({
    members: memberCount,
    events: eventCount,
    inventoryItems: inventoryCount,
    finance: {
      income,
      expenses,
      balance: income - expenses,
    },
  });
}

