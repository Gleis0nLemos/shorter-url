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


@Controller()
export class UrlController {
    constructor(private urlService: UrlService) {}

    @UseGuards(OptionalJwtAuthGuard)
    @Post('shorten')
    create(
        @Body() createUrlDto: CreateUrlDto,
        @CurrentUser() user?: User, // optional user for authenticated requests
    ) {
        // console.log(createUrlDto);
        return this.urlService.createUrl(createUrlDto, user?.id);
    }

    @Get(':code')
    async redirect(@Param('code') code: string, @Res() res: Response) {
        const destination = await this.urlService.redirect(code);

        if (!destination) throw new NotFoundException();

        return res.redirect(destination)
    }

    // Protected route: List all URLs for the authenticated user
    @UseGuards(JwtAuthGuard)
    @Get('urls/me')
    findMyUrls(@CurrentUser() user: User) {
        return this.urlService.findByUserId(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('urls/:id')
    async updateUrl(
        @Param('id') id: string, 
        @Body() Body: CreateUrlDto, 
        @Req() req
    ) {
        return this.urlService.updateUrl(id, Body.originalUrl, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('urls/:id')
    async deleteUrl(@Param('id') id: string, @Req() req) {
        return this.urlService.deleteUrl(id, req.user.id);
    }
}