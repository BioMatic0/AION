import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { CreateMemoryItemDto } from "./dto/create-memory-item.dto";
import { MemorySearchDto } from "./dto/memory-search.dto";
import { MemoryService } from "./memory.service";

@UseGuards(SessionAuthGuard)
@Controller("memory")
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Get()
  listItems(@CurrentUserId() userId: string) {
    return this.memoryService.listItems(userId);
  }

  @Post()
  addItem(@CurrentUserId() userId: string, @Body() dto: CreateMemoryItemDto) {
    return this.memoryService.addItem(dto, userId);
  }

  @Post("sync")
  syncSystemMemory(@CurrentUserId() userId: string) {
    return this.memoryService.syncSystemMemory(userId);
  }

  @Post("search")
  search(@CurrentUserId() userId: string, @Body() dto: MemorySearchDto) {
    return this.memoryService.search(dto.query, userId);
  }
}
