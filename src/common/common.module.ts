import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeletionCodeService } from './deletion-code.service';
import { AdminSettingsService, AdminSetting } from './admin-settings.service';
import { AdminSettingsController } from './admin-settings.controller';
import { MailModule } from '../auth/mail.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AdminSetting]),
    MailModule,
  ],
  providers: [DeletionCodeService, AdminSettingsService],
  controllers: [AdminSettingsController],
  exports: [DeletionCodeService, AdminSettingsService],
})
export class CommonModule {}
