import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { DiaryModule } from "../diary/diary.module";
import { GoalsModule } from "../goals/goals.module";
import { JournalModule } from "../journal/journal.module";
import { NotesModule } from "../notes/notes.module";
import { MemoryController } from "./memory.controller";
import { MemoryService } from "./memory.service";

@Module({
  imports: [JournalModule, DiaryModule, NotesModule, GoalsModule, AuditModule, PrismaModule],
  controllers: [MemoryController],
  providers: [MemoryService],
  exports: [MemoryService]
})
export class MemoryModule {}
