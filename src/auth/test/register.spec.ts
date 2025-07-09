// src/auth/test/register.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService - register', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    const dto = { email: 'test@example.com', password: '123456' };

    const mockUser = {
      id: 'abc123',
      email: dto.email,
      password: 'hashed-password',
    };

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
    jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser as any);

    const result = await service.register(dto);

    expect(result).toEqual({ id: 'abc123', email: dto.email });
  });
});
