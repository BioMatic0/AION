import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateJournalEntryDto } from "./dto/create-journal-entry.dto";
import { UpdateJournalEntryDto } from "./dto/update-journal-entry.dto";
import { JournalService } from "./journal.service";

@Controller("journal")
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  listEntries() {
    return this.journalService.listEntries();
  }

  @Get(":id")
  getEntry(@Param("id") id: string) {
    return this.journalService.getEntry(id);
  }

  @Post()
  createEntry(@Body() dto: CreateJournalEntryDto) {
    return this.journalService.createEntry(dto);
  }

  @Patch(":id")
  updateEntry(@Param("id") id: string, @Body() dto: UpdateJournalEntryDto) {
    return this.journalService.updateEntry(id, dto);
  }

  @Delete(":id")
  removeEntry(@Param("id") id: string) {
    return this.journalService.removeEntry(id);
  }
}