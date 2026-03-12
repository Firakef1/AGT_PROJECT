-- CreateEnum (skip if exists)
DO $$ BEGIN
  CREATE TYPE "Language" AS ENUM ('AFAN_OROMO', 'AMHARIC');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable Family
CREATE TABLE IF NOT EXISTS "Family" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable SystemSetting
CREATE TABLE IF NOT EXISTS "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable GeneratedReport
CREATE TABLE IF NOT EXISTS "GeneratedReport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable _EventToFamily (implicit join table)
CREATE TABLE IF NOT EXISTS "_EventToFamily" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventToFamily_AB_unique" UNIQUE ("A", "B")
);

-- CreateIndex (only if table exists and index doesn't)
CREATE UNIQUE INDEX IF NOT EXISTS "Family_name_key" ON "Family"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "SystemSetting_key_key" ON "SystemSetting"("key");
CREATE INDEX IF NOT EXISTS "_EventToFamily_B_index" ON "_EventToFamily"("B");

-- AlterTable Member: add columns if not exist
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "gender" TEXT;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "familyId" TEXT;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "familyRole" TEXT;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "divisionJoinedAt" TIMESTAMP(3);
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "section" INTEGER;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "language" "Language";

-- AddForeignKey Member.familyId (only if not exists - we cannot do IF NOT EXISTS for FK in older PG, so use DO block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Member_familyId_fkey'
  ) THEN
    ALTER TABLE "Member" ADD CONSTRAINT "Member_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey _EventToFamily
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_EventToFamily_A_fkey') THEN
    ALTER TABLE "_EventToFamily" ADD CONSTRAINT "_EventToFamily_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_EventToFamily_B_fkey') THEN
    ALTER TABLE "_EventToFamily" ADD CONSTRAINT "_EventToFamily_B_fkey" FOREIGN KEY ("B") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
