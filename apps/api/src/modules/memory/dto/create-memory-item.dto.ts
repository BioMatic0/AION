import { IsIn, IsString } from "class-validator";
import type { MemorySourceType } from "@aion/shared-types";

const sourceTypes: MemorySourceType[] = ["journal", "diary", "note", "goal", "analysis", "manual"];

export class CreateMemoryItemDto {
  @IsIn(sourceTypes)
  sourceType!: MemorySourceType;

  @IsString()
  title!: string;

  @IsString()
  content!: string;
}