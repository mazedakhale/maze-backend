import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { config } from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { DocumentsModule } from './documents/documents.module';
import { CertificatesModule } from './certificates/certificates.module';
import { RequiredDocumentsModule } from './required-documents/required-documents.module';
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
import { EmployeeModule } from './employee/employee.module';
import { ImageModule } from './image/image.module';
import { PricesModule } from './prices/prices.module';
import { NewsModule } from './news/news.module';
import { WalletModule } from './wallet/wallet.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { SmsModule } from './sms/sms.module';
import { HeaderModule } from './header/header.module';
import { ContactInfoModule } from './contact-info/contact-info.module';
import { AuthModule } from './auth/auth.module';
import { PaymentRequestsModule } from './payment-requests/payment-requests.module';

config(); // Load .env early

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,  // <-- use DB_USERNAME
      password: process.env.DB_PASSWORD,  // <-- use DB_PASSWORD
      database: process.env.DB_NAME,  // <-- use DB_DATABASE
      autoLoadEntities: true,
      synchronize: true, // Changed to false to prevent data loss
    }),

    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        baseURL: cfg.get<string>('LIVEONE_BASE_URL'),
        headers: { 'Content-Type': 'application/json' },
      }),
    }),

    // Your feature modules
    UsersModule,
    CategoriesModule,
    SubcategoriesModule,
    DocumentsModule,
    DocumentTypesModule,
    CertificatesModule,
    RequiredDocumentsModule,
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
    EmployeeModule,
    ImageModule,
    PricesModule,
    WalletModule,
    RazorpayModule,
    SmsModule,
    HeaderModule,
    ContactInfoModule,
    NewsModule,
    PrivacyPolicyModule,
    AuthModule,
    PaymentRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
