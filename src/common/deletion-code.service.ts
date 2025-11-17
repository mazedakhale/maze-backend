import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { MailService } from '../auth/mail.service';
import { AdminSettingsService } from './admin-settings.service';

interface DeletionCodeData {
  code: string;
  expiresAt: Date;
}

@Injectable()
export class DeletionCodeService {
  private deletionCodes: Map<string, DeletionCodeData> = new Map();

  constructor(
    private readonly mailService: MailService,
    @Inject(forwardRef(() => AdminSettingsService))
    private adminSettingsService: AdminSettingsService,
  ) {}

  // Get current static deletion code from AdminSettingsService (async for DB read)
  private async getCurrentCode(): Promise<string> {
    return this.adminSettingsService
      ? await this.adminSettingsService.getCurrentDeletionCode()
      : '123456';
  }

  // Generate unique key for storage
  private getKey(module: string, id: number): string {
    return `${module}_${id}`;
  }

  // Request deletion code - uses static code and sends via email
  async generateDeletionCode(
    module: string,
    id: number,
    email: string,
    itemName: string,
  ): Promise<{ message: string }> {
    // Use current static code from database
    const code = await this.getCurrentCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const key = this.getKey(module, id);
    this.deletionCodes.set(key, { code, expiresAt });

    try {
      await this.mailService.sendDeletionCode(email, code, itemName);
      return { message: 'Deletion code sent to your email' };
    } catch (error) {
      throw new BadRequestException('Failed to send deletion code email');
    }
  }

  // Verify deletion code
  verifyCode(module: string, id: number, code: string): boolean {
    const key = this.getKey(module, id);
    const storedData = this.deletionCodes.get(key);

    if (!storedData) {
      throw new BadRequestException(
        'No deletion code requested for this item',
      );
    }

    if (new Date() > storedData.expiresAt) {
      this.deletionCodes.delete(key);
      throw new BadRequestException(
        'Deletion code has expired. Please request a new code.',
      );
    }

    if (storedData.code !== code) {
      throw new BadRequestException('Invalid deletion code');
    }

    // Code is valid - clean up
    this.deletionCodes.delete(key);
    return true;
  }

  // Verify deletion code directly (without email - just check static code from database)
  async verifyStaticCode(code: string): Promise<boolean> {
    const currentCode = await this.getCurrentCode();
    
    if (code !== currentCode) {
      throw new BadRequestException('Invalid deletion code');
    }

    return true;
  }
}
