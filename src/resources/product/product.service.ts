import { DatabaseService } from '@/database/database.service';
import { IRes } from '@/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product as TProduct } from '@prisma/client';
import { InventoryService } from '../inventory/inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly db: DatabaseService,
    private readonly inventoryService: InventoryService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<IRes<TProduct>> {
    // create product
    const cProduct = await this.db.product.create({
      data: {
        name: createProductDto.name,
        desc: createProductDto.desc,
        price: createProductDto.price,
        SKU: createProductDto.SKU,
      },
    });
    // create inventory
    const cInventory = await this.inventoryService.create({
      product_id: cProduct.id,
      quantity: createProductDto.quantity,
    });
    const product = {
      ...cProduct,
      ProductInventory: {
        quantity: cInventory.quantity,
      },
    };
    return {
      code: 'SUCCESS',
      message: 'product created successfully',
      data: product,
    };
  }

  async findAll(): Promise<
    IRes<Array<Pick<TProduct, 'id' | 'name' | 'price'>>>
  > {
    const products = await this.db.product.findMany({
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });
    return {
      code: 'SUCCESS',
      message: `successfully found ${products.length} products`,
      data: products,
    };
  }

  async findOne(id: TProduct['id']): Promise<IRes<TProduct | never>> {
    const product = await this.db.product.findFirst({
      where: {
        id,
        is_deleted: false,
      },
      include: {
        ProductInventory: {
          select: {
            quantity: true,
          },
        },
      },
    });

    if (!product) throw new NotFoundException('product not found');
    delete product.is_deleted;
    delete product.deleted_at;
    return {
      code: 'SUCCESS',
      message: 'successfully found product',
      data: product,
    };
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<IRes<TProduct>> {
    this.isProductPresent(id);
    const uProduct = await this.db.product.update({
      where: {
        id,
      },
      data: updateProductDto,
      include: {
        ProductInventory: {
          select: {
            quantity: true,
          },
        },
      },
    });
    return {
      code: 'SUCCESS',
      message: 'updated successfully',
      data: uProduct,
    };
  }

  async remove(id: string): Promise<IRes> {
    await this.isProductPresent(id);
    await this.db.product.update({
      where: {
        id,
      },
      data: {
        is_deleted: true,
        ProductInventory: {
          update: {
            is_deleted: true,
          },
        },
      },
    });

    return {
      code: 'SUCCESS',
      message: 'product deleted successfully',
    };
  }

  async isProductPresent(productId: string): Promise<TProduct | never> {
    const isProduct = await this.db.product.findFirst({
      where: {
        id: productId,
        is_deleted: false,
      },
    });
    if (!isProduct) throw new NotFoundException('product not found');
    return isProduct;
  }
}
