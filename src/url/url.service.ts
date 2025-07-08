import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { nanoid } from "nanoid";


@Injectable()
export class UrlService {
    constructor(private prisma: PrismaService) {}

    async createUrl(data: CreateUrlDto, userId?: string) {
        console.log('userId recebido:', userId); // ✅ Deve imprimir algo
        
        const shortCode = nanoid(6);
        const url = await this.prisma.url.create({
            data: {
                originalUrl: data.originalUrl,
                shortCode,
                userId: userId ?? null, // If userId is not provided, set it to null
            }
        });

        return { shortUrl: `http://localhost:3000/${shortCode}`}
    }

    async updateUrl(id: string, newUrl: string, userId: string) {
        const url = await this.prisma.url.findUnique({ where: { id } });

        if (!url || url.deletedAt) {
            throw new NotFoundException('URL not found');
        }

        if (url.userId !== userId) {
            throw new NotFoundException('Unauthorized to update this URL');
        }

        return this.prisma.url.update({
            where: { id },
            data: { originalUrl: newUrl}
        })
    }

    async deleteUrl(id: string, userId: string) {
        const url = await this.prisma.url.findUnique({ where: { id }})

        if (!url || url.deletedAt) {
            throw new NotFoundException('URL not found');
        }
        
        if (url.userId !== userId) {
            throw new NotFoundException('Unauthorized to delete this URL');
        }

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

        if (!url) throw new NotFoundException('URL not found');

        await this.prisma.url.update({
            where: { id: url.id },
            data: { clickCount: { increment: 1 } },
        });

        return url.originalUrl;
    }

    async findByUserId(userId: string) {
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