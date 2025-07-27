import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS
  app.useGlobalPipes(new ValidationPipe()); // Enable ValidationPipe
  await app.listen(3001);
}
bootstrap();
