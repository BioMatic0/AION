import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class GrowthEvaluationDto {
  @IsOptional()
  @IsString()
  reflection?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  completionRate?: number;
}