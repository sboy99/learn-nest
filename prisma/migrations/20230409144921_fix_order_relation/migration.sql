/*
  Warnings:

  - You are about to drop the column `isCheckedOut` on the `shopping_session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id,product_id]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "order_details_user_id_key";

-- DropIndex
DROP INDEX "order_items_order_id_key";

-- DropIndex
DROP INDEX "order_items_product_id_key";

-- AlterTable
ALTER TABLE "shopping_session" DROP COLUMN "isCheckedOut";

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_id_product_id_key" ON "order_items"("order_id", "product_id");
