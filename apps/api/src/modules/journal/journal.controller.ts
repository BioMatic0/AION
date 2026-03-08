import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { CreateJournalEntryDto } from "./dto/create-journal-entry.dto";
import { UpdateJournalEntryDto } from "./dto/update-journal-entry.dto";
import { JournalService } from "./journal.service";

@UseGuards(SessionAuthGuard)
@Controller("journal")
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  listEntries(@CurrentUserId() userId: string) {
    return this.journalService.listEntries(userId);
  }

  @Get(":id")
  getEntry(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.journalService.getEntry(id, userId);
  }

  @Post()
  createEntry(@CurrentUserId() userId: string, @Body() dto: CreateJournalEntryDto) {
    return this.journalService.createEntry(dto, userId);
  }

  @Patch(":id")
  updateEntry(@CurrentUserId() userId: string, @Param("id") id: string, @Body() dto: UpdateJournalEntryDto) {
    return this.journalService.updateEntry(id, dto, userId);
  }

  @Delete(":id")
  removeEntry(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.journalService.removeEntry(id, userId);
  }
}
