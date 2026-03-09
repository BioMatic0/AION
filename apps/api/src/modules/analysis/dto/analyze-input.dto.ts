import { IsArray, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class PotentialTruthDto {
  @IsNumber()
  @Min(0)
  hasBeen!: number;

  @IsNumber()
  @Min(0)
  canBe!: number;

  @IsNumber()
  @Min(0)
  tendsToBe!: number;
}

export class AnalyzeInputDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  context?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PotentialTruthDto)
  manualPotentialTruth?: PotentialTruthDto;
}
