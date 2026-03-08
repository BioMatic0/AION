import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService]
})
export class NotesModule {}
