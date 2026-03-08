import { Module } from "@nestjs/common";
import { MemoryModule } from "../memory/memory.module";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  imports: [MemoryModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}