import { IsString } from "class-validator";

export class MemorySearchDto {
  @IsString()
  query!: string;
}