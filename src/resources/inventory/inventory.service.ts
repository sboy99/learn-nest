import { DatabaseService } from '@/database/database.service';
import { IRes } from '@/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductInventory as TProductInventory } from '@prisma/client';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly db: DatabaseService) {}

  async create(
    createInventoryDto: CreateInventoryDto
  ): Promise<TProductInventory> {
    const inventory = await this.db.productInventory.create({
      data: {
        product_id: createInventoryDto.product_id,
        quantity: createInventoryDto.quantity,
      },
    });
    return inventory;
  }

  async update(
    productId: CreateInventoryDto['product_id'],
    updateInventoryDto: UpdateInventoryDto
  ): Promise<IRes<TProductInventory | never>> {
    const isActiveProduct = await this.db.product.findFirst({
      where: {
        id: productId,
        is_deleted: false,
      },
    });
    if (!isActiveProduct) throw new NotFoundException('product not found');
    // update inventory data
    const inventory = await this.db.productInventory.update({
      where: {
        product_id: productId,
      },
      data: updateInventoryDto,
    });

    return {
      code: 'SUCCESS',
      message: 'successfully updated',
      data: inventory,
    };
  }
}
