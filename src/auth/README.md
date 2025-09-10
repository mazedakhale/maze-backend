# NestJS JWT Authentication Module

This module provides JWT-based authentication for your NestJS application with secure password hashing and role-based access control.

## Features

- ✅ JWT token-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ User registration and login
- ✅ Role-based access control
- ✅ Protected routes with guards
- ✅ Admin user auto-creation
- ✅ Environment variable configuration
- ✅ Comprehensive error handling
- ✅ Swagger API documentation

## Quick Start

### 1. Environment Variables

Make sure your `.env` file contains:

```env
JWT_SECRET=yourSuperSecretKey123!
JWT_EXPIRES_IN=1h
```

### 2. Admin User

The admin user is automatically created on startup:
- **Email**: `admin1@gmail.com`
- **Password**: `123456`
- **Role**: `admin`

### 3. API Endpoints

#### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/signup` | User registration | No |
| GET | `/auth/profile` | Get user profile | Yes |
| GET | `/auth/validate` | Validate token | Yes |

## Usage Examples

### 1. User Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin1@gmail.com",
    "password": "123456"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin1@gmail.com",
    "role": "admin",
    "isActive": true
  }
}
```

### 2. User Registration

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### 3. Access Protected Route

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Protecting Routes

### 1. Basic Authentication

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}
```

### 2. Role-Based Access

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAdminData() {
    return { message: 'This is admin-only data' };
  }
}
```

### 3. Access User Data in Controller

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getUserProfile(@Request() req) {
    // req.user contains the authenticated user data
    return {
      message: `Hello ${req.user.email}`,
      userId: req.user.id,
      role: req.user.role
    };
  }
}
```

## Security Features

### 1. Password Security
- Passwords are hashed using bcrypt with 12 salt rounds
- Passwords are never logged or exposed in responses
- Strong password validation (minimum 6 characters)

### 2. JWT Security
- JWT tokens are signed with a secret key
- Tokens have expiration time (configurable)
- Tokens are validated on every protected request

### 3. Error Handling
- Generic error messages to prevent information leakage
- Proper HTTP status codes
- Comprehensive logging without sensitive data

## Database Schema

The authentication module creates an `auth_users` table with the following structure:

```sql
CREATE TABLE auth_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Testing the Authentication

### 1. Test Admin Login
```bash
# Login as admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin1@gmail.com", "password": "123456"}'

# Use the returned token for protected routes
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Test User Registration
```bash
# Register a new user
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Troubleshooting

### Common Issues

1. **"User not found" error**: Make sure the admin user was created during startup
2. **"Invalid token" error**: Check if JWT_SECRET is set in environment variables
3. **Database connection error**: Ensure MySQL is running and database is accessible

### Logs

Check the application logs for authentication-related messages:
- Successful logins are logged (without passwords)
- Failed authentication attempts are logged
- Admin user creation is logged

## Security Best Practices

1. **Change Default Admin Password**: After first login, change the admin password
2. **Use Strong JWT Secret**: Use a strong, random JWT secret in production
3. **HTTPS Only**: Always use HTTPS in production
4. **Token Expiration**: Set appropriate token expiration times
5. **Rate Limiting**: Implement rate limiting for login endpoints
6. **Input Validation**: All inputs are validated using class-validator

## Integration with Other Modules

To use authentication in other modules:

1. Import `AuthModule` in your module
2. Use `JwtAuthGuard` for basic protection
3. Use `RolesGuard` with `@Roles()` decorator for role-based access
4. Access user data via `@Request() req` parameter

```typescript
// In your module
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  // ... other module configuration
})
export class YourModule {}
```
