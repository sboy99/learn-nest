/*
  Warnings:

  - Added the required column `payment_intent_id` to the `payment_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_details" ADD COLUMN     "payment_intent_id" TEXT NOT NULL;
