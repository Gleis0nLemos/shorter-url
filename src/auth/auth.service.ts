import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { access } from "fs";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async register(data: RegisterDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(data: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ sub: user.id, email: user.email });

        return {
            access_token: token,
        };
    }
}