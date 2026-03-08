import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { SecurityController } from "./security.controller";
import { SecurityService } from "./security.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [SecurityController],
  providers: [SecurityService],
  exports: [SecurityService]
})
export class SecurityModule {}
