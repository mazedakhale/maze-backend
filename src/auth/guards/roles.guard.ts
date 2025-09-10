import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Roles Guard
 * This guard checks if the user has the required role to access a route
 * Use with @Roles() decorator to specify required roles
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from the route metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get user from request (populated by JWT strategy)
    const { user } = context.switchToHttp().getRequest();
    
    // Check if user has required role
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
