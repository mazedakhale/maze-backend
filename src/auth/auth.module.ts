import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { AuthController } from './auth.controller';
import { AuthUser } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleOAuthController } from './google-oauth.controller';

/**
 * Authentication Module
 * Provides JWT-based authentication functionality
 * Includes user management, login, signup, and protected routes
 */
@Module({
  imports: [
    // Import TypeORM module for database operations
    TypeOrmModule.forFeature([AuthUser]),
    
    // Import Passport module for authentication strategies
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Import JWT module with configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // JWT secret from environment variables
        secret: configService.get<string>('JWT_SECRET'),
        // Token expiration time from environment variables
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController,GoogleOAuthController],
  providers: [
    AuthService,
    JwtStrategy, // JWT strategy for token validation
    MailService, // Mail service for sending emails
  ],
  exports: [
    AuthService, // Export AuthService for use in other modules
    PassportModule, // Export PassportModule for use in other modules
    JwtModule, // Export JwtModule for use in other modules
    MailService
  ],
})
export class AuthModule {}