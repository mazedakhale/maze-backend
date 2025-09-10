import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * JWT Strategy for Passport Authentication
 * This strategy validates JWT tokens and extracts user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      // Extract JWT token from Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ignore token expiration (we handle this in the service)
      ignoreExpiration: false,
      // Use JWT secret from environment variables
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
    });
  }

  /**
   * Validate method called by Passport
   * This method is called after JWT token is verified
   * @param payload - Decoded JWT payload
   * @returns User object if valid, throws UnauthorizedException if invalid
   */
  async validate(payload: any) {
    try {
      // Find user by ID from JWT payload
      const user = await this.authService.findUserById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User account is deactivated');
      }

      // Return user object (will be attached to request.user)
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
