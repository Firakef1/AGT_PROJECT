-- Add BOTH to Language enum (PostgreSQL 9.1+; IF NOT EXISTS in PG 9.5+)
ALTER TYPE "Language" ADD VALUE IF NOT EXISTS 'BOTH';

-- Backfill NULL gender then make column required
UPDATE "Member" SET gender = 'OTHER' WHERE gender IS NULL;
ALTER TABLE "Member" ALTER COLUMN "gender" SET NOT NULL;
