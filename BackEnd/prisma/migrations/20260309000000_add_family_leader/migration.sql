-- Add optional family leader (approved member) to Family
ALTER TABLE "Family" ADD COLUMN IF NOT EXISTS "leaderId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Family_leaderId_key" ON "Family"("leaderId");
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Family_leaderId_fkey'
  ) THEN
    ALTER TABLE "Family" ADD CONSTRAINT "Family_leaderId_fkey"
      FOREIGN KEY ("leaderId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
