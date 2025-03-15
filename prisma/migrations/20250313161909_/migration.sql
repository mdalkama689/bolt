/*
  Warnings:

  - The `message` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `files` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "message",
ADD COLUMN     "message" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "files",
ADD COLUMN     "files" TEXT[] DEFAULT ARRAY[]::TEXT[];
