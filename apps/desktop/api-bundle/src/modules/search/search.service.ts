import { Injectable } from "@nestjs/common";
import { MemoryService } from "../memory/memory.service";

@Injectable()
export class SearchService {
  constructor(private readonly memoryService: MemoryService) {}

  search(query: string) {
    return this.memoryService.search(query);
  }
}