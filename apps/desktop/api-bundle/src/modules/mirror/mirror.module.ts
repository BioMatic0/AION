import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { MirrorController } from "./mirror.controller";
import { MirrorService } from "./mirror.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [MirrorController],
  providers: [MirrorService],
  exports: [MirrorService]
})
export class MirrorModule {}
