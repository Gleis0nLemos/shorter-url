import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { nanoid } from "nanoid";


@Injectable()
export class UrlService {
    constructor(private prisma: PrismaService) {}

    async createUrl(data: CreateUrlDto) {
        
        const shortCode = nanoid(6);
        const url = await this.prisma.url.create({
            data: {
                originalUrl: data.originalUrl,
                shortCode,
            }
        });

        return { shortUrl: `http://localhost:3000/${shortCode}`}
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