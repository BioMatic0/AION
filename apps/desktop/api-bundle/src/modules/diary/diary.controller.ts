import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateDiaryEntryDto } from "./dto/create-diary-entry.dto";
import { UpdateDiaryEntryDto } from "./dto/update-diary-entry.dto";
import { DiaryService } from "./diary.service";

@Controller("diary")
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get()
  listEntries() {
    return this.diaryService.listEntries();
  }

  @Get("prompts")
  getPrompts() {
    return this.diaryService.getPrompts();
  }

  @Get("summary")
  getPreparedSummary() {
    return this.diaryService.prepareDailySummary();
  }

  @Get(":id")
  getEntry(@Param("id") id: string) {
    return this.diaryService.getEntry(id);
  }

  @Post()
  createEntry(@Body() dto: CreateDiaryEntryDto) {
    return this.diaryService.createEntry(dto);
  }

  @Patch(":id")
  updateEntry(@Param("id") id: string, @Body() dto: UpdateDiaryEntryDto) {
    return this.diaryService.updateEntry(id, dto);
  }

  @Delete(":id")
  removeEntry(@Param("id") id: string) {
    return this.diaryService.removeEntry(id);
  }
}