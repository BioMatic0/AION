import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { AnalysisController } from "./analysis.controller";
import { AnalysisService } from "./analysis.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
  exports: [AnalysisService]
})
export class AnalysisModule {}
