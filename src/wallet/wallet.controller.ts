

// src/wallet/wallet.controller.ts

import {
    Controller,
    Get,
    Post,
    Body,
    Req,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { WalletService } from './wallet.service';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
    constructor(private readonly svc: WalletService) { }

    @Post('topup')
    async topup(@Req() req: Request, @Body('amount') amount: number) {
        if (!amount || amount <= 0) {
            throw new BadRequestException('Invalid amount');
        }

        const userId = (req.user as any).userId;
        return this.svc.initiateTopup(userId, amount);
    }

    @Get('transactions')
    async getTransactions(@Req() req: Request) {
        const userId = (req.user as any).userId;
        return this.svc.getTransactions(userId);
    }

    @Get()
    async getBalance(@Req() req: Request) {
        const userId = (req.user as any).userId;
        const balance = await this.svc.getBalance(userId);
        return { balance };
    }
}
