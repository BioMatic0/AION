import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { DiaryModule } from "../diary/diary.module";
import { GoalsModule } from "../goals/goals.module";
import { JournalModule } from "../journal/journal.module";
import { GrowthController } from "./growth.controller";
import { GrowthService } from "./growth.service";

@Module({
  imports: [JournalModule, DiaryModule, GoalsModule, AuditModule, PrismaModule],
  controllers: [GrowthController],
  providers: [GrowthService],
  exports: [GrowthService]
})
export class GrowthModule {}
