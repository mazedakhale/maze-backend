import { Controller, Post, Body, Get } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';

@Controller('admin-settings')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  // Get current deletion code (masked)
  @Get('deletion-code')
  getCurrentCode() {
    return this.adminSettingsService.getMaskedCode();
  }

  // Request OTP to change deletion code
  @Post('request-code-change')
  requestCodeChange(@Body('email') email: string) {
    return this.adminSettingsService.requestCodeChangeOTP(email);
  }

  // Verify OTP and update deletion code
  @Post('verify-code-change')
  verifyAndChangeCode(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('newDeletionCode') newDeletionCode: string,
  ) {
    return this.adminSettingsService.verifyAndUpdateDeletionCode(
      email,
      otp,
      newDeletionCode,
    );
  }
}
