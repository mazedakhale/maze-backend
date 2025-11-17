import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../auth/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Database entity for admin settings
@Entity('admin_settings')
export class AdminSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'setting_key', unique: true, length: 100 })
  settingKey: string;

  @Column({ name: 'setting_value', type: 'text' })
  settingValue: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

interface OTPData {
  otp: string;
  expiresAt: Date;
}

@Injectable()
export class AdminSettingsService {
  private otpStorage = new Map<string, OTPData>();

  constructor(
    @InjectRepository(AdminSetting)
    private adminSettingRepository: Repository<AdminSetting>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
  ) {}

  // Generate random 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Get current deletion code from database
   * Falls back to environment variable if DB is unavailable
   * This allows hot-reloading without server restart
   */
  async getCurrentDeletionCode(): Promise<string> {
    try {
      const setting = await this.adminSettingRepository.findOne({
        where: { settingKey: 'DELETION_CODE' },
      });

      // Return DB value if exists, otherwise fallback to env
      return (
        setting?.settingValue ||
        this.configService.get<string>('DELETION_CODE', '123456')
      );
    } catch (error) {
      // Fallback to env variable on DB error
      console.warn('Failed to read deletion code from DB, using env fallback');
      return this.configService.get<string>('DELETION_CODE', '123456');
    }
  }

  // Get current deletion code (masked for security)
  async getMaskedCode(): Promise<{ code: string }> {
    const code = await this.getCurrentDeletionCode();
    const masked = code.substring(0, 2) + '*'.repeat(code.length - 2);
    return { code: masked };
  }

  // Request OTP to change deletion code
  async requestCodeChangeOTP(email: string): Promise<{ message: string }> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const otp = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    this.otpStorage.set(email, { otp, expiresAt });

    // Send OTP via email
    await this.mailService.sendEmail(
      email,
      'Deletion Code Change Request',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f58a3b;">🔐 Deletion Code Change Request</h2>
        <p>You have requested to change the system deletion code.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">Your verification OTP is:</p>
          <h1 style="margin: 10px 0; color: #f58a3b; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">⏰ This OTP will expire in 5 minutes</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this change, please ignore this email.</p>
      </div>
      `,
    );

    return { message: 'OTP sent to your email' };
  }

  /**
   * Verify OTP and update deletion code in DATABASE
   * This allows immediate effect without server restart
   * Production-safe: No .env file modification needed
   */
  async verifyAndUpdateDeletionCode(
    email: string,
    otp: string,
    newDeletionCode: string,
  ): Promise<{ message: string }> {
    // Validate inputs
    if (!email || !otp || !newDeletionCode) {
      throw new BadRequestException('Email, OTP, and new code are required');
    }

    if (newDeletionCode.length < 4) {
      throw new BadRequestException(
        'Deletion code must be at least 4 characters',
      );
    }

    // Verify OTP
    const storedOTP = this.otpStorage.get(email);

    if (!storedOTP) {
      throw new BadRequestException('No OTP request found for this email');
    }

    if (new Date() > storedOTP.expiresAt) {
      this.otpStorage.delete(email);
      throw new BadRequestException(
        'OTP has expired. Please request a new one.',
      );
    }

    if (storedOTP.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // OTP is valid - update deletion code in database
    try {
      let setting = await this.adminSettingRepository.findOne({
        where: { settingKey: 'DELETION_CODE' },
      });

      if (setting) {
        // Update existing setting
        setting.settingValue = newDeletionCode;
        setting.updatedBy = email;
        await this.adminSettingRepository.save(setting);
      } else {
        // Create new setting
        setting = this.adminSettingRepository.create({
          settingKey: 'DELETION_CODE',
          settingValue: newDeletionCode,
          description: 'Static deletion code for all delete operations',
          updatedBy: email,
        });
        await this.adminSettingRepository.save(setting);
      }

      // Clear OTP after successful update
      this.otpStorage.delete(email);

      // Send confirmation email
      await this.mailService.sendEmail(
        email,
        'Deletion Code Updated Successfully',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">✅ Deletion Code Updated</h2>
          <p>Your system deletion code has been successfully changed.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">New Deletion Code:</p>
            <h2 style="margin: 10px 0; color: #28a745;">${newDeletionCode}</h2>
          </div>
          <p style="color: #28a745; font-size: 16px; font-weight: bold;">✨ Active immediately - No server restart required!</p>
          <p style="color: #666; font-size: 14px;">This code is now active across all modules.</p>
          <p style="color: #999; font-size: 12px;">Changed on: ${new Date().toLocaleString()}</p>
          <p style="color: #999; font-size: 12px;">Changed by: ${email}</p>
        </div>
        `,
      );

      return {
        message:
          'Deletion code updated successfully in database. Change is active immediately!',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to update deletion code in database: ${error.message}`,
      );
    }
  }
}
