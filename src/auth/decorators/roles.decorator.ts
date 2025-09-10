import { SetMetadata } from '@nestjs/common';

/**
 * Roles Decorator
 * This decorator is used to specify which roles can access a route
 * Use with RolesGuard to protect routes based on user roles
 * 
 * @param roles - Array of roles that can access the route
 * @example @Roles('admin') - Only admin users can access
 * @example @Roles('admin', 'user') - Both admin and user can access
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
