import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from '../url.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UrlService - updateUrl', () => {
  let service: UrlService;
  let prisma: PrismaService;

  const mockPrisma = {
    url: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve atualizar a URL se ela existir e pertencer ao usuário', async () => {
    const mockUrl = { id: '1', userId: 'user123', deletedAt: null };
    mockPrisma.url.findUnique.mockResolvedValue(mockUrl);
    mockPrisma.url.update.mockResolvedValue({ ...mockUrl, originalUrl: 'https://nova.com' });

    const result = await service.updateUrl('1', 'https://nova.com', 'user123');

    expect(mockPrisma.url.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(mockPrisma.url.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { originalUrl: 'https://nova.com' },
    });
    expect(result.originalUrl).toBe('https://nova.com');
  });

  it('deve lançar exceção se a URL não for encontrada', async () => {
    mockPrisma.url.findUnique.mockResolvedValue(null);

    await expect(service.updateUrl('1', 'https://nova.com', 'user123')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar exceção se a URL não pertencer ao usuário', async () => {
    const mockUrl = { id: '1', userId: 'outroUser', deletedAt: null };
    mockPrisma.url.findUnique.mockResolvedValue(mockUrl);

    await expect(service.updateUrl('1', 'https://nova.com', 'user123')).rejects.toThrow(NotFoundException);
  });
});
