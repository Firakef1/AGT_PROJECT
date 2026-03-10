import { Request, Response } from "express";
import { z } from "zod";
import { getFinanceSummary, recordTransaction, listTransactions, getBudget } from "../services/financeService";
import { sendEmail } from "../utils/email";

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive(),
  description: z.string().optional(),
  divisionId: z.string().uuid().optional(),
});

export async function recordTransactionController(req: Request, res: Response) {
  const parse = transactionSchema.safeParse(req.body);
  if (!parse.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parse.error.flatten() });
  }

  const tx = await recordTransaction(parse.data);

  // Example: email financial report/notification to admins (hook for future enhancement)
  await sendEmail({
    to: "finance-reports@gubaetech.local",
    subject: "New financial transaction recorded",
    text: `A new ${tx.type.toLowerCase()} of ${tx.amount} has been recorded.`,
  });

  return res.status(201).json(tx);
}

export async function financeSummaryController(req: Request, res: Response) {
  const divisionId =
    typeof req.query.divisionId === "string" ? req.query.divisionId : undefined;
  const fromStr = typeof req.query.from === "string" ? req.query.from : undefined;
  const toStr = typeof req.query.to === "string" ? req.query.to : undefined;

  const from = fromStr ? new Date(fromStr) : undefined;
  const to = toStr ? new Date(toStr) : undefined;

  const summary = await getFinanceSummary({ divisionId, from, to });

  return res.json(summary);
}

export async function listTransactionsController(req: Request, res: Response) {
  const divisionId =
    typeof req.query.divisionId === "string" ? req.query.divisionId : undefined;

  const transactions = await listTransactions({ divisionId });
  return res.json(transactions);
}

export async function getBudgetController(req: Request, res: Response) {
  const divisionId =
    typeof req.query.divisionId === "string" ? req.query.divisionId : undefined;
  const categories = await getBudget({ divisionId });
  return res.json({ categories });
}

