import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Authentication Controller
 * Handles authentication endpoints for login, signup, and profile management
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User Login Endpoint
   * Authenticates user credentials and returns JWT token
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email and password, returns JWT token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginDto);
  }

  /**
   * User Registration Endpoint
   * Creates a new user account and returns JWT token
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'User registration',
    description: 'Create a new user account with email and password'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User already exists'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
  })
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    return await this.authService.signup(signupDto);
  }

  /**
   * Get User Profile Endpoint
   * Returns current user's profile information
   * Protected route - requires valid JWT token
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Get current authenticated user profile information'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token'
  })
  async getProfile(@Request() req): Promise<any> {
    // req.user is populated by JWT strategy
    return await this.authService.getUserProfile(req.user.id);
  }

  /**
   * Validate Token Endpoint
   * Checks if the provided JWT token is valid
   * Protected route - requires valid JWT token
   */
  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Validate token',
    description: 'Check if the provided JWT token is valid'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token is valid'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid token'
  })
  async validateToken(@Request() req): Promise<any> {
    // If we reach here, the token is valid (guarded by JwtAuthGuard)
    return {
      valid: true,
      user: req.user,
      message: 'Token is valid'
    };
  }
}
