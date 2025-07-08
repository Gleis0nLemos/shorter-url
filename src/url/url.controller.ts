import { 
    Body, 
    Controller, 
    Get, 
    NotFoundException, 
    Param, 
    Post, 
    Res, 
    UseGuards
} from "@nestjs/common";
import { UrlService } from "./url.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { Response } from "express";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";


@Controller()
export class UrlController {
    constructor(private urlService: UrlService) {}

    @Post('shorten')
    create(
        @Body() createUrlDto: CreateUrlDto,
        @CurrentUser() user?: User, // optional user for authenticated requests
    ) {
    // console.log(createUrlDto);
    return this.urlService.createUrl(createUrlDto);
    }

    @Get(':code')
    async redirect(@Param('code') code: string, @Res() res: Response) {
        const destination = await this.urlService.redirect(code);

        if (!destination) throw new NotFoundException();

        return res.redirect(destination)
    }

    // Protected route: List all URLs for the authenticated user
    @UseGuards(JwtAuthGuard)
    @Get('urls/my')
    findMyUrls(@CurrentUser() user: User) {
        return this.urlService.findByUserId(user.id);
    }
}