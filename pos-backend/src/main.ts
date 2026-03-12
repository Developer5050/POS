import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Your frontend URL
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Set API prefix
  app.setGlobal('prefix', 'api');

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
}