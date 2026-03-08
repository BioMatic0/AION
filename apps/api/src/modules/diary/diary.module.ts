import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { DiaryController } from "./diary.controller";
import { DiaryService } from "./diary.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService]
})
export class DiaryModule {}
