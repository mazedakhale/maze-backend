import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Put,
  Delete,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  InternalServerErrorException,
  ParseIntPipe,
  NotFoundException,
  ParseEnumPipe,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { EditRequestStatus, User, UserRole } from './entities/users.entity';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Get('verify-email')
  async verifyEmail(
    @Query('token', new ValidationPipe({ transform: false, whitelist: false }))
    token: string,
  ) {
    return this.usersService.verifyEmail(token);
  }

  @Post('resend-verification')
  async resendVerification(@Body('email') email: string): Promise<{ message: string }> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    await this.usersService.resendVerificationEmail(email);
    return { message: 'Verification email resent successfully' };
  }

  @Patch('status/:id')
  async updateUserStatus(
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: { status: 'Active' | 'Inactive' },
  ): Promise<string> {
    if (!body.status) {
      throw new BadRequestException('Status is required');
    }
    return this.usersService.updateUserStatus(userId, body.status);
  }

  @Get('distributors')
  async getDistributors(): Promise<User[]> {
    return this.usersService.getDistributors();
  }

  @Get('customers')
  async getCustomers(): Promise<User[]> {
    return this.usersService.getCustomers();
  }

  @Get('employee')
  async getEmployee(): Promise<User[]> {
    return this.usersService.getEmployee();
  }

  @Get('register')
  async getRegisteredUsers(): Promise<User[]> {
    return this.usersService.getRegisteredUsers();
  }

  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 5 },
      { name: 'profilePhoto', maxCount: 1 }, // profile photo upload
    ]),
  )
  async register(
    @Body() body: Partial<User & { district: string; taluka: string }>,
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
      profilePhoto?: Express.Multer.File[];
    },
    @Body('documentTypes') documentTypes: string[],
  ): Promise<User> {
    return this.usersService.register(
      body,
      files?.files || [],
      documentTypes,
      files?.profilePhoto?.[0],
    );
  }

  @Patch('password/:id')
  async updatePassword(
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: { newPassword: string },
  ): Promise<string> {
    if (!body.newPassword) {
      throw new BadRequestException('New password is required');
    }
    return this.usersService.updatePassword(userId, body.newPassword);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.usersService.login(body.email, body.password);
    } catch (error) {
      if (
        error instanceof NotFoundException &&
        error.message === 'Invalid email or password'
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            errorCode: 1000,
            message: 'Invalid email or password',
          },
          HttpStatus.UNAUTHORIZED,
        );
      } else if (
        error instanceof UnauthorizedException &&
        (
          error.message === 'Wait for Admin Verification' ||
        /* error.message === 'Email not verified' */ false
        )
      ) {
        let errorCode;

        if (error.message === 'Wait for Admin Verification') {
          errorCode = 1001;
        }
        /*else if (error.message === 'Email not verified') {
          errorCode = 1002;
        }*/

        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            errorCode,
            message: error.message,
          },
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            errorCode: 9999,
            message: 'Unexpected error occurred',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put('edit/:id')
  @UseInterceptors(FilesInterceptor('files', 5))
  async editUser(
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    if ((!files || files.length === 0) && Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'You must send at least one field to update or one file to upload',
      );
    }

    try {
      return await this.usersService.editUser(userId, updateData, files);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(
        err.message || 'Failed to update user',
      );
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) userId: number, 
    @Body('code') code?: string
  ) {
    return this.usersService.deleteUser(userId, code);
  }

  @Get('edit/:user_id')
  async getUser(@Param('user_id', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  @Get(':user_id')
  async getUserId(
    @Param('user_id', ParseIntPipe) userId: number,
  ): Promise<User> {
    return this.usersService.getUserId(userId);
  }

  @Put('update/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: any, // grab everything
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ) {
    return this.usersService.updateUserWithDocuments(
      userId,
      body,
      files?.files || [],
      body.documentTypes || [],
    );
  }

  @Post('request-edit/:id')
  async requestEdit(@Param('id', ParseIntPipe) userId: number): Promise<string> {
    return this.usersService.requestProfileEdit(userId);
  }

  @Patch('request-edit/:id')
  async resolveEdit(
    @Param('id', ParseIntPipe) userId: number,
    @Body('status', new ParseEnumPipe(EditRequestStatus)) status: EditRequestStatus,
  ): Promise<string> {
    if (
      status !== EditRequestStatus.APPROVED &&
      status !== EditRequestStatus.REJECTED
    ) {
      throw new BadRequestException('Status must be Approved or Rejected');
    }
    return this.usersService.resolveProfileEditRequest(userId, status);
  }


  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<void> {
    if (!email) throw new BadRequestException('Email is required');
    return this.usersService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
  ): Promise<{ message: string }> {
    if (!token || !newPassword || !confirmPassword) {
      throw new BadRequestException(
        'token, newPassword and confirmPassword are all required',
      );
    }
    const msg = await this.usersService.resetPassword(
      token,
      newPassword,
      confirmPassword,
    );
    return { message: msg };
  }
}
