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

  const incomeGroup = financeSummary.find((g: any) => g.type === "INCOME");
  const expenseGroup = financeSummary.find((g: any) => g.type === "EXPENSE");

  const income = incomeGroup?._sum.amount ?? 0;
  const expenses = expenseGroup?._sum.amount ?? 0;

  res.json({
    members: memberCount,
    events: eventCount,
    inventory: inventoryCount, // Matches frontend Dashboard.jsx
    finance: {
      income,
      expenses,
      balance: income - expenses,
    },
  });
}

export async function dashboardActivitiesController(_req: Request, res: Response) {
  try {
    const [recentMembers, recentTransactions, recentEvents] = await Promise.all([
      prisma.member.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.financeTransaction.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.event.findMany({ orderBy: { createdAt: 'desc' }, take: 10 })
    ]);

    const activities: any[] = [];

    recentMembers.forEach((m: any) => {
      activities.push({
        type: 'member',
        icon: 'UserPlus',
        iconBg: '#e8f0fe',
        iconColor: '#1a56db',
        title: 'New Member Joined',
        description: `${m.fullName} joined the platform.`,
        createdAt: m.createdAt
      });
    });

    recentTransactions.forEach((t: any) => {
      activities.push({
        type: 'finance',
        icon: 'Wallet',
        iconBg: t.type === 'INCOME' ? '#e8f5e9' : '#fce4ec',
        iconColor: t.type === 'INCOME' ? '#16a34a' : '#dc2626',
        title: t.type === 'INCOME' ? 'Income Logged' : 'Expense Logged',
        description: `${t.amount.toLocaleString()} ETB ${t.type === 'INCOME' ? 'received' : 'spent'} - ${t.description || 'Transaction'}`,
        createdAt: t.createdAt
      });
    });

    recentEvents.forEach((e: any) => {
      activities.push({
        type: 'event',
        icon: 'Building2',
        iconBg: '#fef3e2',
        iconColor: '#d97706',
        title: 'Event Scheduled',
        description: `${e.title} is coming up.`,
        createdAt: e.createdAt
      });
    });

    // Sort combined by date descending
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Map time to relatively friendly string (or just let frontend handle)
    const formattedActivities = activities.slice(0, 15).map(a => {
      const now = new Date();
      const diffHrs = Math.floor((now.getTime() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60));
      let timeStr = `${diffHrs} HOURS AGO`;
      if (diffHrs === 0) timeStr = 'JUST NOW';
      else if (diffHrs === 1) timeStr = '1 HOUR AGO';
      else if (diffHrs > 24) timeStr = `${Math.floor(diffHrs/24)} DAYS AGO`;

      return {
        ...a,
        time: timeStr
      };
    });

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
}

/** GET /dashboard/chart — time-series income/expenses by month for charts */
export async function dashboardChartController(_req: Request, res: Response) {
  try {
    const transactions = await prisma.financeTransaction.findMany({
      orderBy: { occurredAt: 'asc' },
    });

    const byMonth: Record<string, { income: number; expenses: number }> = {};
    for (const t of transactions) {
      const d = new Date(t.occurredAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!byMonth[key]) byMonth[key] = { income: 0, expenses: 0 };
      if (t.type === 'INCOME') byMonth[key].income += Number(t.amount);
      else byMonth[key].expenses += Number(t.amount);
    }

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const sorted = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b));
    const monthly = sorted.slice(-12).map(([k, v]) => {
      const parts = k.split('-');
      const m = parts[1];
      const idx = m ? Math.max(0, Math.min(11, parseInt(m, 10) - 1)) : 0;
      return {
        name: monthNames[idx],
        income: Math.round(v.income),
        expenses: Math.round(v.expenses),
      };
    });

    const byYear: Record<string, { income: number; expenses: number }> = {};
    for (const t of transactions) {
      const y = new Date(t.occurredAt).getFullYear().toString();
      if (!byYear[y]) byYear[y] = { income: 0, expenses: 0 };
      if (t.type === 'INCOME') byYear[y].income += Number(t.amount);
      else byYear[y].expenses += Number(t.amount);
    }
    const yearly = Object.entries(byYear)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, v]) => ({ name, income: Math.round(v.income), expenses: Math.round(v.expenses) }));

    res.json({ monthly, yearly });
  } catch (error) {
    console.error('Dashboard chart error:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
}

