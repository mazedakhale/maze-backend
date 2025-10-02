import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { User } from '../users/entities/users.entity'; // Adjust import paths as needed
import { EditRequestStatus } from '../users/entities/users.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: 'Welcome to Maze Dakhle!',
        text: 'Thank you for registering. We are excited to have you on board!',
        html: '<h1>Welcome to Maze Dakhle!</h1><p>Thank you for registering. We are excited to have you on board!</p>',
      });
      this.logger.log(`Welcome email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}`, error);
    }
  }

  // Send welcome email with password (for registration emails)
  async sendWelcomeEmailWithPassword(email: string, password: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Registration Successful - Your Login Credentials',
        text: `Dear User,
        You have successfully registered.
        Your Username: ${email}
        Your Password: ${password}
        Please keep this information secure.
        Best regards,
        Team Maze Dakhle`,
      });
      this.logger.log(`Registration email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send registration email to ${email}`, error);
    }
  }

  // Send account status update email
  async sendStatusUpdateEmail(user: User, status: 'Active' | 'Inactive'): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: 'Account Status Update',
        text: `Dear ${user.name},
        Your account status has been updated to: ${status}.
        ${status === 'Active' ? 'You can now log in and access your account.' : 'Please contact support for further details.'}
        Best regards,
        Team Maze Dakhle`,
      });
      this.logger.log(`Status update email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send status update email to ${user.email}`, error);
    }
  }

  // Send password update notification email
  async sendPasswordUpdateEmail(user: User, newPassword: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: 'Your Password Has Been Updated',
        text: `Dear ${user.name},
          Your password has been successfully updated.
          Username: ${user.email}
          New Password: ${newPassword}
          For security reasons, please do not share this password with anyone.
          Best regards,
          Team Maze Dakhle`,
      });
      this.logger.log(`Password update email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send password update email to ${user.email}`, error);
    }
  }

  // Send profile edit request notification email to admin
  async sendEditRequestNotification(admin: User, user: User): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        replyTo: `${user.name} <${user.email}>`,
        to: admin.email,
        subject: `🔔 Profile Edit Requested by ${user.name}`,
        text: `
          Hello ${admin.name},
          User ${user.name} <${user.email}> has requested to edit their profile.
          Please review their request and either approve or reject:
            • Approve:   
            • Reject:   
          Best regards,
          Maze Dakhle`.trim(),
      });
      this.logger.log(`Edit request notification sent to admin ${admin.email}`);
    } catch (error) {
      this.logger.error(`Failed to send edit request notification to admin ${admin.email}`, error);
    }
  }

  // Send profile edit request result email to user
  async sendEditRequestResultEmail(user: User, status: EditRequestStatus): Promise<void> {
    const approved = status === EditRequestStatus.APPROVED;
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: approved ? '✅ Your profile edit request has been approved' : '❌ Your profile edit request was rejected',
        text: approved
          ? `
          Dear ${user.name},
          Your request to edit your profile has been approved! You may now log in and update your details at any time.
          Best regards,
          Maze Dakhle
          `.trim()
          : `
          Dear ${user.name},
          We’re sorry, but your request to edit your profile has been rejected. If you have any questions, please contact support.
          Best regards,
          Maze Dakhle
          `.trim(),
      });
      this.logger.log(`Edit request result email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send edit request result email to ${user.email}`, error);
    }
  }

  // Send password reset email with reset link
  async sendPasswordResetEmail(user: User, resetLink: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: '🔒 Password Reset Link',
        text: `
          Hello ${user.name},
          You requested to reset your password. Click the link below to choose a new one:
          ${resetLink}
          This link expires in one hour. If you didn’t request this, please ignore this email.
          Best regards,
          Maze Dakhle
          `.trim(),
      });
      this.logger.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${user.email}`, error);
    }
  }

  async sendEmailVerificationLink(email: string, link: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Please verify your email',
        text: `Click the link below to verify your email address:\n\n${link}\n\nThis link expires in 1 hour.`,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw error; // optional: rethrow or handle as needed
    }
  }

}
