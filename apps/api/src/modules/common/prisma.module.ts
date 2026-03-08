import { Global, Module } from "@nestjs/common";
import { PRISMA_SERVICE } from "./prisma.tokens";

const isDesktopRuntime = process.env.AION_DESKTOP_RUNTIME === "1";
const persistenceProviders = isDesktopRuntime
  ? []
  : [
      {
        provide: PRISMA_SERVICE,
        useClass: require("./prisma.service").PrismaService
      }
    ];

@Global()
@Module({
  providers: persistenceProviders,
  exports: persistenceProviders
})
export class PrismaModule {}
