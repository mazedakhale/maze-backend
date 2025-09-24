import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LocalStorageService } from './local-storage.service';
import { User, UserRole, LoginStatus, EditRequestStatus } from './entities/users.entity';
import { AuthUser } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;
  let authUserRepository: jest.Mocked<Repository<AuthUser>>;
  let jwtService: JwtService;
  let localStorageService: jest.Mocked<LocalStorageService>;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn().mockResolvedValue(true);
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: sendMailMock });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            merge: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AuthUser),  // Proper repository mock
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'token'),
          },
        },
        {
          provide: LocalStorageService,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;
    authUserRepository = module.get<Repository<AuthUser>>(getRepositoryToken(AuthUser)) as jest.Mocked<Repository<AuthUser>>;
    jwtService = module.get<JwtService>(JwtService);
    localStorageService = module.get<LocalStorageService>(LocalStorageService) as jest.Mocked<LocalStorageService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'test123';
      const hash = await service['hashPassword'](password);
      expect(await bcrypt.compare(password, hash)).toBe(true);
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status and send email', async () => {
      const user = { user_id: 1, email: 'test@example.com', name: 'Test User', user_login_status: LoginStatus.INACTIVE };
      userRepository.findOne.mockResolvedValue(user as User);
      userRepository.save.mockResolvedValue({ ...user, user_login_status: 'Active' } as any);

      const result = await service.updateUserStatus(1, 'Active');

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(userRepository.save).toHaveBeenCalled();
      expect(sendMailMock).toHaveBeenCalled();
      expect(result).toBe('User status updated to Active');
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.updateUserStatus(999, 'Active')).rejects.toThrow('User not found');
    });
  });

  describe('login', () => {
    it('should return token and role if valid user and active', async () => {
      const user = {
        user_id: 1,
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
        phone: '123',
        address: 'addr',
        shop_address: 'shopAddr',
        role: UserRole.CUSTOMER,
        user_login_status: 'Active',
        created_at: new Date(),
        profile_picture: null,
        user_documents: [],
        edit_request_status: EditRequestStatus.PENDING,
        resetToken: null,
        resetTokenExpiration: null,
      } as User;

      userRepository.findOne.mockResolvedValue(user);

      const result = await service.login('test@example.com', 'pass');

      expect(result).toEqual({ token: 'token', role: UserRole.CUSTOMER });
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user invalid', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.login('bad@example.com', 'wrong')).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedException if user inactive', async () => {
      const inactiveUser = { user_login_status: 'Inactive', email: 'test@example.com', password: 'pass' } as User;
      userRepository.findOne.mockResolvedValue(inactiveUser);
      await expect(service.login('test@example.com', 'pass')).rejects.toThrow('Wait for Admin Verification');
    });
  });

});
