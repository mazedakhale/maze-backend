import { Controller, Get, Res, Query, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Response } from 'express';

@Controller('auth/google')
export class GoogleOAuthController {
  private readonly logger = new Logger(GoogleOAuthController.name);
  private oauth2Client;

  constructor(private configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );
  }

  @Get()
  async googleAuth(@Res() res: Response) {
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly'
    ];
    
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline', // Important: this gives us a refresh token
      scope: scopes,
      prompt: 'consent' // Forces consent screen to get refresh token
    });

    this.logger.log(`🔗 OAuth URL generated: ${url}`);
    res.redirect(url);
  }

  @Get('callback')
  async googleAuthRedirect(@Query('code') code: string, @Res() res: Response) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      
      this.logger.log('🎫 OAuth tokens received:');
      this.logger.log(`   - Access Token: ${!!tokens.access_token}`);
      this.logger.log(`   - Refresh Token: ${!!tokens.refresh_token}`);
      this.logger.log(`   - Expires: ${tokens.expiry_date}`);
      
      // Store the refresh token securely
      if (tokens.refresh_token) {
        this.logger.log(`✅ Add this to your .env file:`);
        this.logger.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
      }
      
      res.json({ 
        message: 'Authentication successful! Check server logs for refresh token.',
        hasRefreshToken: !!tokens.refresh_token,
        tokens: {
          access_token: tokens.access_token ? 'present' : 'missing',
          refresh_token: tokens.refresh_token ? 'present' : 'missing'
        }
      });
    } catch (error) {
      this.logger.error('Error getting tokens:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
}