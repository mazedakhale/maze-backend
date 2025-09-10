import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * This guard protects routes that require authentication
 * It uses the JWT strategy to validate tokens
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Inherits all functionality from AuthGuard('jwt')
  // Can be extended with custom logic if needed
}
