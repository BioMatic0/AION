import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4000",
        "capacitor://localhost"
      ],
      credentials: true
    }
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`AION API listening on http://localhost:${port}`);
}

bootstrap();
