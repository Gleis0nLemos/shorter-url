import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    NotFoundException, 
    Param, 
    Post, 
    Put, 
    Req, 
    Res, 
    UseGuards
} from "@nestjs/common";
import { UrlService } from "./url.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { Response } from "express";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "src/auth/guards/optional-jwt-auth.guard";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('URLs')
@Controller()
export class UrlController {
    constructor(private urlService: UrlService) {}

    @UseGuards(OptionalJwtAuthGuard)
    @ApiBearerAuth()
    @Post('shorten')
    @ApiOperation({ summary: 'Encurtar uma URL (com ou sem autenticação)' })
    @ApiBody({ type: CreateUrlDto })
    @ApiResponse({
        status: 201,
        description: 'URL encurtada com sucesso.',
        schema: {
        example: {
            shortUrl: 'http://localhost:3000/aZbKq7',
        },
        },
    })
    @ApiResponse({ status: 400, description: 'URL inválida' })
    create(
        @Body() createUrlDto: CreateUrlDto,
        @CurrentUser() user?: User, // optional user for authenticated requests
    ) {
        // console.log(createUrlDto);
        return this.urlService.createUrl(createUrlDto, user?.id);
    }

    @Get(':code')
    @ApiOperation({ summary: 'Redirecionar para a URL original' })
    @ApiResponse({ status: 302, description: 'Redirecionamento bem-sucedido' })
    @ApiResponse({ status: 404, description: 'URL não encontrada' })
    async redirect(@Param('code') code: string, @Res() res: Response) {
        const destination = await this.urlService.redirect(code);

        if (!destination) throw new NotFoundException();

        return res.redirect(destination)
    }

    @UseGuards(JwtAuthGuard)
    @Get('urls/me')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Listar URLs encurtadas pelo usuário autenticado',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de URLs do usuário',
        schema: {
        example: [
            {
            id: 'xyz123',
            shortCode: 'aZbKq7',
            originalUrl: 'https://exemplo.com',
            clickCount: 5,
            createdAt: '2025-07-08T12:00:00.000Z',
            updatedAt: '2025-07-08T13:00:00.000Z',
            },
        ],
        },
    })
    findMyUrls(@CurrentUser() user: User) {
        return this.urlService.findByUserId(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('urls/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar uma URL encurtada' })
    @ApiBody({ type: CreateUrlDto })
    @ApiResponse({
        status: 200,
        description: 'URL atualizada com sucesso',
        schema: {
        example: {
            id: 'xyz123',
            shortCode: 'aZbKq7',
            originalUrl: 'https://nova-url.com',
            clickCount: 5,
            createdAt: '2025-07-08T12:00:00.000Z',
            updatedAt: '2025-07-08T14:00:00.000Z',
            userId: 'abc456',
        },
        },
    })
    @ApiResponse({ 
        status: 404, 
        description: 'URL não encontrada ou não pertence ao usuário' 
    })
    async updateUrl(
        @Param('id') id: string, 
        @Body() Body: CreateUrlDto, 
        @Req() req
    ) {
        return this.urlService.updateUrl(id, Body.originalUrl, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('urls/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Excluir (logicamente) uma URL encurtada' })
    @ApiResponse({ 
        status: 200, 
        description: 'URL excluída com sucesso' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'URL não encontrada ou não pertence ao usuário' 
    })
    async deleteUrl(@Param('id') id: string, @Req() req) {
        return this.urlService.deleteUrl(id, req.user.id);
    }
}