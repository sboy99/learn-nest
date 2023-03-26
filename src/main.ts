import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // morgan
  app.use(morgan('dev'));

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Server started on port ${port}`);
}
bootstrap();
