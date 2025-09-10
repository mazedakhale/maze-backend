import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Load environment variables
  ConfigModule.forRoot();



  // Enable CORS (Optional, but useful for frontend)
  app.enableCors();

  // Apply body-parser middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS Auth API')
    .setDescription('Registration & Login API with JWT')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // await app.listen(3000, '0.0.0.0');
  // console.log(`Application is running on: https://mazedakhale.in/api`);
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);

}

bootstrap();
