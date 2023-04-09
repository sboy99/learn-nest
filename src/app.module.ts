import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UtilityModule } from './helpers/utility/utility.module';
import { UtilityService } from './helpers/utility/utility.service';
import { AuthModule } from './resources/auth/auth.module';
import { BookmarkModule } from './resources/bookmark/bookmark.module';
import { CartModule } from './resources/cart/cart.module';
import { InventoryModule } from './resources/inventory/inventory.module';
import { ProductModule } from './resources/product/product.module';
import { UserModule } from './resources/user/user.module';
import { UserService } from './resources/user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    DatabaseModule,
    ProductModule,
    CartModule,
    InventoryModule,
    UtilityModule,
  ],
  providers: [UserService, UtilityService],
})
export class AppModule {}
