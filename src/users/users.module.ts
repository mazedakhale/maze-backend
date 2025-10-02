import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/users.entity';
import { AuthUser } from '../auth/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LocalStorageService } from './local-storage.service';
import { MailModule } from '../auth/mail.module'; // Import MailModule here

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
    MailModule, // Import your dedicated MailModule
  ],
  controllers: [UsersController],
  providers: [UsersService, LocalStorageService],
})
export class UsersModule {}
