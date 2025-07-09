// src/auth/test/login.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService - login', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve fazer login com sucesso', async () => {
    const dto = { email: 'test@example.com', password: '123456' };
    const mockUser = {
      id: 'user-id',
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-token');

    const result = await service.login(dto);

    expect(result).toEqual({ access_token: 'mocked-token' });
  });

  it('deve lançar Unauthorized se usuário não existir', async () => {
    const dto = { email: 'wrong@example.com', password: '123456' };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar Unauthorized se senha estiver incorreta', async () => {
    const dto = { email: 'test@example.com', password: 'wrongpass' };
    const mockUser = {
      id: 'user-id',
      email: dto.email,
      password: await bcrypt.hash('123456', 10),
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
  });
});
