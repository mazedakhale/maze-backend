import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, LoginStatus, EditRequestStatus } from './entities/users.entity';
import { AuthUser } from '../auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LocalStorageService } from './local-storage.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../auth/mail.service';
import { randomBytes } from 'crypto';


@Injectable()
export class UsersService {

  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(AuthUser)
    private readonly authUserRepository: Repository<AuthUser>,

    private readonly jwtService: JwtService,

    private configService: ConfigService,

    private readonly localStorageService: LocalStorageService,

    private readonly mailService: MailService, // Inject MailService here

  ) { }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async updateUserStatus(userId: number, status: 'Active' | 'Inactive'): Promise<string> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (status === 'Active') {
      user.user_login_status = LoginStatus.ACTIVE;
    }
    else {
      user.user_login_status = LoginStatus.INACTIVE;
    }
    await this.userRepository.save(user);
    await this.mailService.sendStatusUpdateEmail(user, status);

    return `User status updated to ${status}`;
  }

  async getDistributors(): Promise<User[]> {
    return await this.userRepository.find({ where: { role: UserRole.DISTRIBUTOR } });
  }

  async getCustomers(): Promise<User[]> {
    return await this.userRepository.find({ where: { role: UserRole.CUSTOMER } });
  }

  async getEmployee(): Promise<User[]> {
    return await this.userRepository.find({ where: { role: UserRole.EMPLOYEE } });
  }

  async getRegisteredUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async updatePassword(userId: number, newPassword: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.password = newPassword; // ⚠️ Plain text password review advised
    await this.userRepository.save(user);
    await this.mailService.sendPasswordUpdateEmail(user, newPassword);

    return 'Password updated successfully, and email notification sent.';
  }

  async editUser(
    userId: number,
    updateData: Partial<User>,
    files: Express.Multer.File[] = [],
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (files.length) {
      if (Array.isArray(user.user_documents) && user.user_documents.length) {
        await Promise.all(
          user.user_documents.map(doc => this.localStorageService.deleteFile(doc.file_path)),
        );
      }
      const uploadedDocs = await Promise.all(
        files.map(async file => ({
          document_type: file.originalname,
          mimetype: file.mimetype,
          file_path: await this.localStorageService.uploadFile(file),
        })),
      );
      updateData.user_documents = uploadedDocs;
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<string> {
    const result = await this.userRepository.delete(userId);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return 'User deleted successfully';
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: Number(userId) } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async sendRegistrationEmail(user: User, originalPassword: string): Promise<void> {
    await this.mailService.sendWelcomeEmailWithPassword(user.email, originalPassword);
  }

  async register(
    data: Partial<User & { district: string; taluka: string }>,
    files: Express.Multer.File[],
    documentTypes: string[],
    profilePhoto?: Express.Multer.File,
  ): Promise<User> {
    const originalPassword = data.password ?? '';
    if (!data.role) {
      this.logger.error('Registration failed: Role is missing');
      throw new BadRequestException('Role is required');
    }

    this.logger.log(`Registering user with email: ${data.email}`);

    const newUser = this.userRepository.create({
      ...data,
      district: data.district,
      taluka: data.taluka,
      user_login_status: LoginStatus.INACTIVE,
      isEmailVerified: false, // Initialize as not verified
    });

    try {
      if (profilePhoto) {
        this.logger.log(`Uploading profile photo for ${data.email}`);
        const profilePhotoUrl = await this.localStorageService.uploadFile(profilePhoto);
        newUser.profile_picture = profilePhotoUrl;
        this.logger.log(`Profile photo uploaded successfully: ${profilePhotoUrl}`);
      }

      if (files?.length) {
        this.logger.log(`Uploading ${files.length} document(s) for ${data.email}`);
        const uploadedDocuments = await Promise.all(
          files.map(async (file, idx) => ({
            document_type: documentTypes[idx] || 'Unknown',
            mimetype: file.mimetype,
            file_path: await this.localStorageService.uploadFile(file),
          })),
        );
        newUser.user_documents = uploadedDocuments;
        this.logger.log(`Documents uploaded successfully for ${data.email}`);
      }

      // Generate email verification token
      const token = randomBytes(32).toString('hex');
      newUser.emailVerificationToken = token;
      newUser.emailVerificationTokenExpiration = new Date(Date.now() + 3600 * 1000); // token valid for 1 hour

      this.logger.log(`Saving new user record in database for ${data.email}`);
      const savedUser = await this.userRepository.save(newUser);
      this.logger.log(`User record saved successfully with ID: ${savedUser.user_id}`);

      try {
        const hashedPassword = await this.hashPassword(originalPassword);
        const authUser = this.authUserRepository.create({
          email: savedUser.email,
          password: hashedPassword,
          role: savedUser.role.toLowerCase(),
          isActive: true,
        });
        this.logger.log(`Creating auth user for ${savedUser.email}`);
        await this.authUserRepository.save(authUser);
        this.logger.log(`Auth user created successfully for ${savedUser.email}`);
      } catch (authError) {
        this.logger.error(`Failed to create auth user for ${savedUser.email}`, authError);
        // Do not throw here to allow registration to succeed
      }

      /*
      try {
        const verificationLink = `https://maze-backend-production.up.railway.app/users/verify-email?token=${token}`;
        this.logger.log(`Sending email verification link to ${savedUser.email}`);
        await this.mailService.sendEmailVerificationLink(savedUser.email, verificationLink);
        this.logger.log(`Email verification link sent to ${savedUser.email}`);
      } catch (emailError) {
        this.logger.error(`Failed to send verification email to ${savedUser.email}`, emailError);
        // Proceed without throwing
      }
      */

      return savedUser;
    } catch (err: any) {
      const code = err.code || err.errno || err.driverError?.code || err.driverError?.errno;

      if (code === 'ER_DUP_ENTRY' || code === 1062 || code === '23505') {
        this.logger.warn(`Duplicate email registration attempted: ${data.email}`);
        throw new ConflictException('That email is already registered');
      }

      this.logger.error(`Unexpected error saving user ${data.email}`, err);
      throw new InternalServerErrorException('Unexpected error saving user');
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const user = await this.userRepository.findOne({ where: { emailVerificationToken: token } });
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (!user.emailVerificationTokenExpiration || user.emailVerificationTokenExpiration < new Date()) {
      throw new BadRequestException('Verification token expired');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiration = null;
    await this.userRepository.save(user);

    return { message: 'Email verified successfully.' };
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new token and expiration
    const token = randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    user.emailVerificationTokenExpiration = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
    await this.userRepository.save(user);
    const verificationLink = `https://maze-backend-production.up.railway.app/users/verify-email?token=${token}`;
    // Send email (assuming mailService has sendEmailVerificationLink)
    await this.mailService.sendEmailVerificationLink(email, verificationLink);
  }

  async login(email: string, password: string): Promise<{ token: string; role: UserRole }> {
    const user = await this.userRepository.findOne({ where: { email, password } });
    if (!user) throw new NotFoundException('Invalid email or password');

    if (user.user_login_status !== 'Active') {
      throw new UnauthorizedException('Wait for Admin Verification');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const payload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      shop_address: user.shop_address,
      role: user.role,
      user_login_status: user.user_login_status,
      created_at: user.created_at,
      profile_picture: user.profile_picture ?? null,
      user_documents: user.user_documents ?? [],
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
    });

    return { token, role: user.role };
  }


  async getUserId(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserWithDocuments(
    userId: number,
    body: any,
    files: Express.Multer.File[],
    documentTypes: string[],
  ) {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const { documentTypes: _dt, ...rest } = body;
    const shopAddr = rest.shopAddress ?? rest.shop_address;
    const toUpdate: Record<string, any> = {
      ...rest,
      shop_address: shopAddr,
      user_login_status: LoginStatus.INACTIVE,
    };

    this.userRepository.merge(user, toUpdate);

    if (files.length) {
      const updatedDocs = Array.isArray(user.user_documents)
        ? [...user.user_documents]
        : [];

      await Promise.all(
        files.map(async (file, idx) => {
          const type = documentTypes[idx];
          if (!type) throw new BadRequestException(`Missing documentType at index ${idx}`);

          const old = updatedDocs.find(d => d.document_type === type);
          if (old) await this.localStorageService.deleteFile(old.file_path);

          const url = await this.localStorageService.uploadFile(file);
          const entry = {
            document_type: type,
            mimetype: file.mimetype,
            file_path: url,
          };

          const i = updatedDocs.findIndex(d => d.document_type === type);
          if (i > -1) updatedDocs[i] = entry;
        }),
      );

      user.user_documents = updatedDocs;
    }

    await this.userRepository.save(user);
    return { message: 'User updated successfully', user };
  }

  async requestProfileEdit(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.edit_request_status = EditRequestStatus.PENDING;
    await this.userRepository.save(user);

    const admin = await this.userRepository.findOne({ where: { role: UserRole.ADMIN } });
    if (!admin) throw new NotFoundException('Admin user not found');

    await this.sendEditRequestNotification(admin, user);

    return 'Edit request submitted. The admin has been notified.';
  }

  async resolveProfileEditRequest(
    userId: number,
    status: EditRequestStatus.APPROVED | EditRequestStatus.REJECTED,
  ): Promise<string> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.edit_request_status = status;
    await this.userRepository.save(user);

    await this.sendEditRequestResultEmail(user, status);

    return `Edit request has been ${status.toLowerCase()}.`;
  }

  private async sendEditRequestNotification(admin: User, user: User) {
    await this.mailService.sendEditRequestNotification(admin, user);
  }

  private async sendEditRequestResultEmail(user: User, status: EditRequestStatus) {
    await this.mailService.sendEditRequestResultEmail(user, status);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const resetToken = Date.now().toString(36) + Math.random().toString(36).substring(2);
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600_000); // +1 hour
    await this.userRepository.save(user);
    const frontUrl = 'https://maze-backend-production.up.railway.app';
    const link = `${frontUrl}/reset-password?token=${resetToken}`;
    await this.mailService.sendPasswordResetEmail(user, link);
  }

  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<string> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userRepository.findOne({ where: { resetToken: token } });
    if (!user) throw new NotFoundException('Invalid reset token');

    if (!user.resetTokenExpiration || user.resetTokenExpiration < new Date()) {
      throw new UnauthorizedException('Reset token expired');
    }

    user.password = newPassword; // Plain text (review recommended)
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await this.userRepository.save(user);

    await this.mailService.sendPasswordUpdateEmail(user, newPassword);

    return 'Password reset successful; check your email.';
  }
}
