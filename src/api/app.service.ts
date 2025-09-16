import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'src/config';

export class Application {
  static async start() {
    const PORT = Number(config.API_PORT);
    const app = await NestFactory.create(AppModule);

    const globalPrefix = app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
      }),
    );

    const swaggerConfig = new DocumentBuilder()
      .setTitle('kutubxona')
      .setDescription('Kutubxona Dokoni')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`api/v1`, app, document);

    await app.listen(PORT, () => console.log(` Server running on:`, PORT));
  }
}
