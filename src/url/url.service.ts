import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { nanoid } from "nanoid";


@Injectable()
export class UrlService {
    
    private readonly logger = new Logger(UrlService.name);

    constructor(private prisma: PrismaService) {}

    async createUrl(data: CreateUrlDto, userId?: string) {
        
        const shortCode = nanoid(6);

        this.logger.log(`Criando URL encurtada para: ${data.originalUrl} (usuário: ${userId ?? 'anônimo'})`);

        const url = await this.prisma.url.create({
            data: {
                originalUrl: data.originalUrl,
                shortCode,
                userId: userId ?? null, // If userId is not provided, set it to null
            }
        });

        const shortUrl = `http://localhost:3000/${shortCode}`;
        this.logger.log(`URL encurtada criada: ${shortUrl}`);

        return { shortUrl: `http://localhost:3000/${shortCode}`}
    }

    async updateUrl(id: string, newUrl: string, userId: string) {
        const url = await this.prisma.url.findUnique({ where: { id } });

        if (!url || url.deletedAt) {
            this.logger.warn(`URL ${id} não encontrada ou já excluída.`);
            throw new NotFoundException('URL not found');
        }

        if (url.userId !== userId) {
            this.logger.warn(`Usuário ${userId} não tem permissão para atualizar URL ${id}`);
            throw new NotFoundException('Unauthorized to update this URL');
        }

        this.logger.log(`Atualizando URL ${id} para novo destino: ${newUrl}`);
        return this.prisma.url.update({
            where: { id },
            data: { originalUrl: newUrl}
        })
    }

    async deleteUrl(id: string, userId: string) {
        const url = await this.prisma.url.findUnique({ where: { id }})

        if (!url || url.deletedAt) {
            this.logger.warn(`URL ${id} não encontrada ou já excluída.`);
            throw new NotFoundException('URL not found');
        }
        
        if (url.userId !== userId) {
            this.logger.warn(`Usuário ${userId} não tem permissão para excluir URL ${id}`);
            throw new NotFoundException('Unauthorized to delete this URL');
        }

        this.logger.log(`Excluindo logicamente URL ${id}`);
        return this.prisma.url.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

    }

    async redirect(shortCode: string) {
        const url = await this.prisma.url.findFirst({
            where: {
                shortCode,
                deletedAt: null
            }
        });

        
        if (!url) {
            this.logger.warn(`Código curto não encontrado: ${shortCode}`);
            throw new NotFoundException('URL not found');
        }

        this.logger.log(`Redirecionando ${shortCode} para ${url.originalUrl}`);
        await this.prisma.url.update({
            where: { id: url.id },
            data: { clickCount: { increment: 1 } },
        });

        return url.originalUrl;
    }

    async findByUserId(userId: string) {
        this.logger.log(`Buscando URLs para o usuário: ${userId}`);
        
        return this.prisma.url.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            select: {
                id: true,
                shortCode: true,
                originalUrl: true,
                clickCount: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    }


}