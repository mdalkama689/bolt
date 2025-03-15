/*
  Warnings:

  - The `files` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "dependencies" JSONB NOT NULL DEFAULT '{}',
DROP COLUMN "files",
ADD COLUMN     "files" JSONB NOT NULL DEFAULT '{}';
