import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateMemoryItemDto } from "./dto/create-memory-item.dto";
import { MemorySearchDto } from "./dto/memory-search.dto";
import { MemoryService } from "./memory.service";

@Controller("memory")
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Get()
  listItems() {
    return this.memoryService.listItems();
  }

  @Post()
  addItem(@Body() dto: CreateMemoryItemDto) {
    return this.memoryService.addItem(dto);
  }

  @Post("sync")
  syncSystemMemory() {
    return this.memoryService.syncSystemMemory();
  }

  @Post("search")
  search(@Body() dto: MemorySearchDto) {
    return this.memoryService.search(dto.query);
  }
}