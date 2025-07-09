import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('Shorter URL API')
    .setDescription('API para encurtar URLs')
    .setVersion('v0.0.2')
    .addBearerAuth() // To show the token field on protected endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // 
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
