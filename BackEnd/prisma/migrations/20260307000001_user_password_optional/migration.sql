-- AlterTable: make User.password nullable for Google-only accounts
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
