import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './resources/auth/auth.module';
import { BookmarkModule } from './resources/bookmark/bookmark.module';
import { UserModule } from './resources/user/user.module';
import { UserService } from './resources/user/user.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BookmarkModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [UserService],
})
export class AppModule {}
