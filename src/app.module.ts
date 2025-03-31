import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Load environment variables early
import { config } from 'dotenv';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { DocumentsModule } from './documents/documents.module';
import { CertificatesModule } from './certificates/certificates.module';
import { RequiredDocumentsModule } from './required-documents/required-documents.module';
import { DocumentType } from './document-types/entities/document-type/document-type.entity.';
import { DocumentTypesModule } from './document-types/document-types.module';
import { StatisticsModule } from './statistics/statistics.module';
import { FeildNamesModule } from './feild_names/feild_names.module';
import { UserDashboardModule } from './userdashboard/userdashboard.module';
import { DownloadModule } from './download/download.module';
import { SingleDocumentModule } from './singledocument/singledocument.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RequestErrorsModule } from './request-errors/request-errors.module';
import { DownloadCertificateModule } from './download-certificate/download-certificate.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FieldModule } from './feild/feild.module';
import { ContactModule } from './contact/contact.module';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';


config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available across the entire application
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'myapp_user',
      password: 'Dalal691*',
      database: 'vmdb',
      autoLoadEntities: true,
      synchronize: true,

    }),
    UsersModule,
    CategoriesModule,
    SubcategoriesModule,
    DocumentsModule,
    DocumentTypesModule,
    CertificatesModule,
    RequiredDocumentsModule,
    DocumentType,
    FeildNamesModule,
    StatisticsModule,
    UserDashboardModule,
    DownloadModule,
    SingleDocumentModule,
    NotificationsModule,
    RequestErrorsModule,
    DownloadCertificateModule,
    FeedbackModule,
    FieldModule,
    ContactModule,
    PrivacyPolicyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
