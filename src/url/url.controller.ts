import { 
    Body, 
    Controller, 
    Get, 
    NotFoundException, 
    Param, 
    Post, 
    Res 
} from "@nestjs/common";
import { UrlService } from "./url.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { Response } from "express";


@Controller()
export class UrlController {
    constructor(private urlService: UrlService) {}

    @Post('shorten')
    create(@Body() createUrlDto: CreateUrlDto) {
    console.log(createUrlDto);
    return this.urlService.createUrl(createUrlDto);
    }

    @Get(':code')
    async redirect(@Param('code') code: string, @Res() res: Response) {
        const destination = await this.urlService.redirect(code);

        if (!destination) throw new NotFoundException();

        return res.redirect(destination)
    }
}