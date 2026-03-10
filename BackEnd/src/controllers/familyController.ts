import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { z } from "zod";

const createFamilySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateFamilySchema = createFamilySchema.partial();

export const getFamilies = async (req: Request, res: Response) => {
  try {
    const families = await prisma.family.findMany({
      include: {
        members: {
          select: {
            id: true,
            fullName: true,
            email: true,
            gender: true,
            familyRole: true,
            status: true,
            studentId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(families);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch families", errors: err.message });
  }
};

export const createFamily = async (req: Request, res: Response) => {
  try {
    const data = createFamilySchema.parse(req.body);
    const family = await prisma.family.create({ data });
    res.status(201).json(family);
  } catch (err: any) {
    res.status(400).json({ message: "Invalid input", errors: err });
  }
};

export const updateFamily = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid id" });
    }
    const data = updateFamilySchema.parse(req.body);
    const family = await prisma.family.update({ where: { id }, data });
    res.json(family);
  } catch (err: any) {
    if (err?.code === "P2025") return res.status(404).json({ message: "Family not found" });
    res.status(400).json({ message: "Invalid input", errors: err });
  }
};

export const deleteFamily = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid id" });
    }
    await prisma.member.updateMany({ where: { familyId: id }, data: { familyId: null } });
    await prisma.family.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    if (err?.code === "P2025") return res.status(404).json({ message: "Family not found" });
    res.status(500).json({ message: "Failed to delete family" });
  }
};

export const autoDistributeMembers = async (req: Request, res: Response) => {
  try {
    const unassigned = await prisma.member.findMany({
      where: { familyId: null, status: "APPROVED" },
    });

    if (unassigned.length === 0) {
      return res.status(200).json({ message: "No unassigned members to distribute" });
    }

    const families = await prisma.family.findMany({
      include: { members: { select: { id: true, section: true } } },
    });

    if (families.length === 0) {
      return res.status(400).json({ message: "No families exist to distribute into." });
    }

    type MemberRow = { id: string; section: number | null; gender?: string | null };
    const bySection = new Map<number | null, MemberRow[]>();
    for (const m of unassigned) {
      const key = m.section ?? null;
      if (!bySection.has(key)) bySection.set(key, []);
      bySection.get(key)!.push(m);
    }

    const toProcess: MemberRow[] = [];
    for (const [, group] of bySection) {
      const males = group.filter((m: MemberRow) => m.gender?.toLowerCase() === "male");
      const females = group.filter((m: MemberRow) => m.gender?.toLowerCase() === "female");
      const others = group.filter(
        (m: MemberRow) =>
          !m.gender ||
          (m.gender.toLowerCase() !== "male" && m.gender.toLowerCase() !== "female")
      );
      toProcess.push(...males, ...females, ...others);
    }

    let updates = 0;

    for (const member of toProcess) {
      const memberSection = member.section ?? null;

      type FamilyWithMembers = { id: string; members: { id: string; section: number | null }[] };
      const familyCounts = await Promise.all(
        families.map(async (f: FamilyWithMembers) => {
          const count = await prisma.member.count({ where: { familyId: f.id } });
          const hasSameSection = f.members.some(
            (m: { id: string; section: number | null }) => m.section !== null && m.section === memberSection
          );
          return { id: f.id, count, hasSameSection };
        })
      );

      type FamilyCount = { id: string; count: number; hasSameSection: boolean };
      familyCounts.sort((a: FamilyCount, b: FamilyCount) => {
        if (a.hasSameSection && !b.hasSameSection) return -1;
        if (!a.hasSameSection && b.hasSameSection) return 1;
        return a.count - b.count;
      });
      const first = familyCounts[0];
      if (!first) continue;
      const targetFamilyId = first.id;

      await prisma.member.update({
        where: { id: member.id },
        data: { familyId: targetFamilyId, familyRole: "CHILD" },
      });
      updates++;

      // Refresh family member list so next iteration sees updated section composition
      const fam = families.find((f: { id: string; members: { id: string; section: number | null }[] }) => f.id === targetFamilyId);
      if (fam) {
        fam.members = [
          ...fam.members,
          { id: member.id, section: member.section },
        ] as typeof fam.members;
      }
    }

    res.status(200).json({ message: `Successfully distributed ${updates} members.` });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Auto distribution error:", err);
    res.status(500).json({ message: "Failed to distribute members", error: err.message });
  }
};
