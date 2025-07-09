import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateUrlDto {
    @ApiProperty({ example: 'https://example.com' })
    @IsNotEmpty()
    @IsUrl()
    originalUrl: string;
}