import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt"; 
import { ConfigService } from "@nestjs/config"; 


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extracts JWT from the Authorization header
            ignoreExpiration: false, // do not ignore expiration
            secretOrKey: config.get<string>('JWT_SECRET'), // JWT_SECRET iin .env
        });
    }

    async validate(payload: { sub: string; email: string }) {
        return { id: payload.sub, email: payload.email }; 
    }
}