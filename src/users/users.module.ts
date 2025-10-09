import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { AuthUser } from '../auth/entities/user.entity';
import { HybridStorageModule } from '../hybridStorageSystem/hybrid-storage.module'; // Import the module
import { MailModule } from '../auth/mail.module'; // Or wherever MailService is defined

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthUser]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h' },
      }),
    }),
    HybridStorageModule, // Import HybridStorageModule instead of providing individual services
    MailModule, // Import your dedicated MailModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    // Remove LocalStorageService, GoogleDriveService, HybridStorageService from here
    // They are now provided by HybridStorageModule
  ],
  exports: [
    UsersService,
    // Remove the storage services exports since they're handled by HybridStorageModule
  ],
})
export class UsersModule {}
