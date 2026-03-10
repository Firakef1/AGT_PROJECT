import { Request, Response } from 'express';
import { prisma } from "../prisma/client";

// Get all system settings as a key-value map
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.systemSetting.findMany();
    // Convert array to object map for easy frontend usage
    const settingsMap = settings.reduce((acc: Record<string, string>, current: any) => {
      acc[current.key] = current.value;
      return acc;
    }, {} as Record<string, string>);
    
    res.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Upsert a system setting
export const updateSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      res.status(400).json({ error: 'Key and value are required' });
      return;
    }

    const updatedSetting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json(updatedSetting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};
