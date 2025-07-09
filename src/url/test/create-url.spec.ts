import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from '../url.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUrlDto } from '../dto/create-url.dto';

jest.mock('nanoid', () => ({
  nanoid: () => 'abc123', 
}));

describe('UrlService - createUrl', () => {
  let service: UrlService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: PrismaService,
          useValue: {
            url: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve criar URL sem usuário', async () => {
    const dto: CreateUrlDto = { originalUrl: 'https://example.com' };

    jest.spyOn(prisma.url, 'create').mockResolvedValueOnce({
      originalUrl: dto.originalUrl,
      shortCode: 'abc123',
      userId: null,
    } as any);

    const result = await service.createUrl(dto);
    expect(result).toEqual({ shortUrl: 'http://localhost:3000/abc123' });
  });

  it('deve criar URL com usuário', async () => {
    const dto: CreateUrlDto = { originalUrl: 'https://example.com' };
    const userId = 'user-123';

    jest.spyOn(prisma.url, 'create').mockResolvedValueOnce({
      originalUrl: dto.originalUrl,
      shortCode: 'abc123',
      userId,
    } as any);

    const result = await service.createUrl(dto, userId);
    expect(result).toEqual({ shortUrl: 'http://localhost:3000/abc123' });
  });
});
