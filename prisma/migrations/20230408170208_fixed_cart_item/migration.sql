/*
  Warnings:

  - A unique constraint covering the columns `[shopping_session_id,product_id]` on the table `cart_item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "cart_item_product_id_key";

-- DropIndex
DROP INDEX "cart_item_shopping_session_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_shopping_session_id_product_id_key" ON "cart_item"("shopping_session_id", "product_id");
