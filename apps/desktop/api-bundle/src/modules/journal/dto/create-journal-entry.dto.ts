import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateJournalEntryDto {
  @IsString()
  @MaxLength(120)
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  @IsIn(["journal", "diary", "note"])
  entryType!: "journal" | "diary" | "note";

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