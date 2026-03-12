import { Request, Response } from 'express';
import { prisma } from "../prisma/client";

// Get recent generated reports
export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const reports = await prisma.generatedReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    
    // Format response to match frontend expectations
    const formattedReports = reports.map((r: any) => ({
      id: r.id,
      name: r.name,
      date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      size: `${(r.sizeBytes / (1024 * 1024)).toFixed(1)} MB`,
      type: r.format,
    }));

    res.json(formattedReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// Generate an artificial report log
export const createReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, format } = req.body;

    if (!name || !type) {
      res.status(400).json({ error: 'Name and type are required' });
      return;
    }

    // Generate random size within a reasonable simulated megabyte boundary (1-10MB)
    const randomBytes = Math.floor(Math.random() * (10000000 - 1000000 + 1) + 1000000);

    const report = await prisma.generatedReport.create({
      data: {
        name,
        type,
        format: format || 'PDF', // Default format
        sizeBytes: randomBytes,
      },
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
};
