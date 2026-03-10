import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { z } from "zod";

const createFamilySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  leaderId: z.string().uuid().optional().nullable().or(z.literal("")),
});

const updateFamilySchema = createFamilySchema.partial();

export const getFamilies = async (req: Request, res: Response) => {
  try {
    const families = await prisma.family.findMany({
      include: {
        leader: { select: { id: true, fullName: true, email: true } },
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

async function validateLeaderId(leaderId: string | null | undefined): Promise<void> {
  if (!leaderId || leaderId.trim() === "") return;
  const member = await prisma.member.findUnique({
    where: { id: leaderId },
    select: { status: true },
  });
  if (!member) throw new Error("Selected leader (member) not found.");
  if (member.status !== "APPROVED") throw new Error("Family leader must be an approved member.");
}

export const createFamily = async (req: Request, res: Response) => {
  try {
    const raw = createFamilySchema.parse(req.body);
    const leaderId = raw.leaderId && raw.leaderId.trim() !== "" ? raw.leaderId : null;
    await validateLeaderId(leaderId);
    const family = await prisma.family.create({
      data: { name: raw.name, description: raw.description ?? undefined, leaderId },
    });
    const withLeader = await prisma.family.findUnique({
      where: { id: family.id },
      include: { leader: { select: { id: true, fullName: true, email: true } }, members: true },
    });
    res.status(201).json(withLeader ?? family);
  } catch (err: any) {
    res.status(400).json({ message: err?.message ?? "Invalid input", errors: err });
  }
};

export const updateFamily = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid id" });
    }
    const raw = updateFamilySchema.parse(req.body);
    const leaderId = raw.leaderId !== undefined
      ? (raw.leaderId && raw.leaderId.trim() !== "" ? raw.leaderId : null)
      : undefined;
    if (leaderId !== undefined) await validateLeaderId(leaderId);
    const data: Record<string, unknown> = {};
    if (raw.name !== undefined) data.name = raw.name;
    if (raw.description !== undefined) data.description = raw.description;
    if (leaderId !== undefined) data.leaderId = leaderId;
    const family = await prisma.family.update({ where: { id }, data: data as any });
    const withLeader = await prisma.family.findUnique({
      where: { id },
      include: { leader: { select: { id: true, fullName: true, email: true } }, members: true },
    });
    res.json(withLeader ?? family);
  } catch (err: any) {
    if (err?.code === "P2025") return res.status(404).json({ message: "Family not found" });
    res.status(400).json({ message: err?.message ?? "Invalid input", errors: err });
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
