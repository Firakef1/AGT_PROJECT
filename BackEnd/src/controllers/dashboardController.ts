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

