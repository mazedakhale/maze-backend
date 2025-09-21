import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthUser } from './entities/user.entity';
import { LoginDto, SignupDto, AuthResponseDto } from './dto/auth.dto';

/**
 * Authentication Service
 * Handles user authentication, registration, and JWT token management
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(AuthUser)
    private userRepository: Repository<AuthUser>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {
    // Initialize admin user on service startup
    this.initializeAdminUser();
  }

  /**
   * Initialize admin user if it doesn't exist
   * This method runs on service startup to ensure admin user is created
   */
  private async initializeAdminUser(): Promise<void> {
    try {
      const adminEmail = 'admin1@gmail.com';
      const existingAdmin = await this.userRepository.findOne({
        where: { email: adminEmail }
      });

      if (!existingAdmin) {
        // Hash the admin password securely
        const hashedPassword = await this.hashPassword('123456');
        
        const adminUser = this.userRepository.create({
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          isActive: true,
        });

        await this.userRepository.save(adminUser);
        this.logger.log('Admin user created successfully');
      } else {
        this.logger.log('Admin user already exists');
      }
    } catch (error) {
      this.logger.error('Failed to initialize admin user', error);
    }
  }

  /**
   * Hash password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // High salt rounds for better security
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare plain password with hashed password
   * @param password - Plain text password
   * @param hashedPassword - Hashed password from database
   * @returns Boolean indicating if passwords match
   */
  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate JWT token for authenticated user
   * @param user - User object
   * @returns JWT token
   */
  private generateToken(user: AuthUser): string {
    const payload = {
      sub: user.id, // Subject (user ID)
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
    });
  }

  /**
   * User login authentication
   * @param loginDto - Login credentials
   * @returns Authentication response with JWT token
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await this.comparePasswords(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const access_token = this.generateToken(user);

      // Log successful login (without sensitive data)
      this.logger.log(`User ${user.email} logged in successfully`);

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed for email: ${loginDto.email}`, error);
      throw error;
    }
  }

  /**
   * User registration
   * @param signupDto - Registration data
   * @returns Authentication response with JWT token
   */
  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: signupDto.email }
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(signupDto.password);

      // Create new user
      const newUser = this.userRepository.create({
        email: signupDto.email,
        password: hashedPassword,
        role: signupDto.role || 'user',
        isActive: true,
      });

      // Save user to database
      const savedUser = await this.userRepository.save(newUser);

      // Generate JWT token
      let access_token: string;
      if (savedUser) {
        access_token = this.generateToken(savedUser);
      } else {
        throw new ConflictException('Failed to save user');
      }

      // Send welcome email only if token is generated
      try {
        await this.mailService.sendWelcomeEmail(savedUser.email);
      } catch (emailError) {
        this.logger.error(`Failed to send welcome email to ${savedUser.email}`, emailError);
        // Optionally, you could add a field to the response to indicate email failure
      }

      // Log successful registration (without sensitive data)
      this.logger.log(`New user registered: ${savedUser.email}`);

      return {
        access_token,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          role: savedUser.role,
          isActive: savedUser.isActive,
        },
      };
    } catch (error) {
      this.logger.error(`Signup failed for email: ${signupDto.email}`, error);
      throw error;
    }
  }

  /**
   * Find user by ID (used by JWT strategy)
   * @param id - User ID
   * @returns User object or null
   */
  async findUserById(id: number): Promise<AuthUser | null> {
    try {
      return await this.userRepository.findOne({
        where: { id }
      });
    } catch (error) {
      this.logger.error(`Failed to find user by ID: ${id}`, error);
      return null;
    }
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User object or null
   */
  async findUserByEmail(email: string): Promise<AuthUser | null> {
    try {
      return await this.userRepository.findOne({
        where: { email }
      });
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, error);
      return null;
    }
  }

  /**
   * Get user profile (without password)
   * @param userId - User ID
   * @returns User profile data
   */
  async getUserProfile(userId: number): Promise<Partial<AuthUser>> {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Return user data without password
      const { password, ...userProfile } = user;
      return userProfile;
    } catch (error) {
      this.logger.error(`Failed to get user profile for ID: ${userId}`, error);
      throw error;
    }
  }
}