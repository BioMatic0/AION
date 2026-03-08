import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { GoalsController } from "./goals.controller";
import { GoalsService } from "./goals.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService]
})
export class GoalsModule {}
