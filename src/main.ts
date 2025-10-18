import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS
    app.enableCors({
      origin: [
        'http://mazhedakhle.in',
        'https://mazhedakhle.in',
        'http://www.mazhedakhle.in',
        'https://www.mazhedakhle.in',
        'http://localhost:5173',       // optional for local dev
        'http://72.60.206.65:5173',   // optional for local/testing
      ],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
    });

    // Validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    // Serve static assets
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Your API Title')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token to authorize requests',
        },
        'jwt-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = parseInt(process.env.PORT ?? '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await app.listen(port, host);

    const displayHost = host === '0.0.0.0' ? 'localhost' : host;
    console.log(`Application is running on: http://${displayHost}:${port}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
