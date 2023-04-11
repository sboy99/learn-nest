/*
  Warnings:

  - You are about to drop the column `order_id` on the `payment_details` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment_details" DROP CONSTRAINT "payment_details_order_id_fkey";

-- DropIndex
DROP INDEX "payment_details_order_id_key";

-- AlterTable
ALTER TABLE "payment_details" DROP COLUMN "order_id";

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
