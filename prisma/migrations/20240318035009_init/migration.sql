/*
  Warnings:

  - Made the column `name` on table `Jet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Jet" ALTER COLUMN "name" SET NOT NULL;
