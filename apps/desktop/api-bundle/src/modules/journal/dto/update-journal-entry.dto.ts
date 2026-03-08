import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateJournalEntryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  @IsIn(["journal", "diary", "note"])
  entryType?: "journal" | "diary" | "note";

  @IsOptional()
  @IsString()
  @MaxLength(60)
  mood?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  intensity?: number;
}