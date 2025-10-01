import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Authentication API')
    .setDescription('API for user registration, login, and JWT authentication mechanisms')
    .setVersion('1.0')
    .setContact('Your Team', 'https://yourwebsite.example', 'support@example.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token to authorize requests',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  
  const port = parseInt(process.env.PORT ?? '3000', 10);
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  const displayHost = host === '0.0.0.0' ? 'localhost' : host;
  console.log(`Application is running on: http://${displayHost}:${port}/api`);
}

bootstrap();
