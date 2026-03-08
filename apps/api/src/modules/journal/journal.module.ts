import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { JournalController } from "./journal.controller";
import { JournalService } from "./journal.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService]
})
export class JournalModule {}
