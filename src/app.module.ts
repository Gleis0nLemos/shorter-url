import { Module } from '@nestjs/common';
import { AppController } from './health/app.controller';
import { AppService } from './health/app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UrlModule } from './url/url.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule, 
    UrlModule, 
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
