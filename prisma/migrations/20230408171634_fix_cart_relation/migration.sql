/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `cart_item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cart_item_product_id_key" ON "cart_item"("product_id");
