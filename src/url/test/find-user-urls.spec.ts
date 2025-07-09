import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from '../url.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UrlService - findByUserId', () => {
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
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve retornar URLs vinculadas ao usuário', async () => {
    const mockResult = [
      {
        id: 'url-1',
        shortCode: 'abc123',
        originalUrl: 'https://test.com',
        clickCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(prisma.url, 'findMany').mockResolvedValueOnce(mockResult as any);

    const result = await service.findByUserId('user-123');
    expect(result).toEqual(mockResult);
  });
});
