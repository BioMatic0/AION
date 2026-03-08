import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DesktopAppModule } from "./desktop-app.module";

async function bootstrap() {
  const app = await NestFactory.create(DesktopAppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, "127.0.0.1");
  console.log(`AION Desktop API listening on http://127.0.0.1:${port}`);
}

bootstrap();
