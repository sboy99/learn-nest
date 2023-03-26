import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
