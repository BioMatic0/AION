import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { CreateDiaryEntryDto } from "./dto/create-diary-entry.dto";
import { UpdateDiaryEntryDto } from "./dto/update-diary-entry.dto";
import { DiaryService } from "./diary.service";

@UseGuards(SessionAuthGuard)
@Controller("diary")
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get()
  listEntries(@CurrentUserId() userId: string) {
    return this.diaryService.listEntries(userId);
  }

  @Get("prompts")
  getPrompts() {
    return this.diaryService.getPrompts();
  }

  @Get("summary")
  getPreparedSummary(@CurrentUserId() userId: string) {
    return this.diaryService.prepareDailySummary(userId);
  }

  @Get(":id")
  getEntry(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.diaryService.getEntry(id, userId);
  }

  @Post()
  createEntry(@CurrentUserId() userId: string, @Body() dto: CreateDiaryEntryDto) {
    return this.diaryService.createEntry(dto, userId);
  }

  @Patch(":id")
  updateEntry(@CurrentUserId() userId: string, @Param("id") id: string, @Body() dto: UpdateDiaryEntryDto) {
    return this.diaryService.updateEntry(id, dto, userId);
  }

  @Delete(":id")
  removeEntry(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.diaryService.removeEntry(id, userId);
  }
}
