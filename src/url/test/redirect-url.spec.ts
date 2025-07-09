import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from '../url.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UrlService - redirect', () => {
  let service: UrlService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: PrismaService,
          useValue: {
            url: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve redirecionar se shortCode for válido', async () => {
    const url = {
      id: 'url-1',
      originalUrl: 'https://google.com',
    };

    jest.spyOn(prisma.url, 'findFirst').mockResolvedValueOnce(url as any);
    jest.spyOn(prisma.url, 'update').mockResolvedValueOnce({} as any);

    const result = await service.redirect('abc123');
    expect(result).toBe(url.originalUrl);
  });

  it('deve lançar erro se shortCode não existir', async () => {
    jest.spyOn(prisma.url, 'findFirst').mockResolvedValueOnce(null);

    await expect(service.redirect('invalid')).rejects.toThrow(NotFoundException);
  });
});
