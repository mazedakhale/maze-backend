import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for User Login
 * Validates the incoming login request data
 */
export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

/**
 * Data Transfer Object for User Registration
 * Validates the incoming signup request data
 */
export class SignupDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  role?: string; // Optional role, defaults to 'user'
}

/**
 * Response DTO for Authentication
 * Contains the JWT token and user information (without password)
 */
export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: string;
    isActive: boolean;
  };
}
