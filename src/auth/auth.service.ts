import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async register(data: RegisterDto) {

        this.logger.log(`Tentando registrar usuário: ${data.email}`);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });

        this.logger.log(`Usuário registrado com sucesso: ${user.email}`);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(data: LoginDto) {

        this.logger.log(`Tentando login para: ${data.email}`);
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user || !(await bcrypt.compare(data.password, user.password))) {

            this.logger.warn(`Credenciais inválidas para: ${data.email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ sub: user.id, email: user.email });

        this.logger.log(`Login bem-sucedido: ${user.email}`);
        return {
            access_token: token,
        };
    }
}