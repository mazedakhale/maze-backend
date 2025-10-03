import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    const port = parseInt(process.env.PORT ?? '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await app.listen(`maze-backend.railway.internal`, '3000');

    const displayHost = host === '0.0.0.0' ? 'localhost' : host;
    console.log(`Application is running on: http://localhost:3000`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
