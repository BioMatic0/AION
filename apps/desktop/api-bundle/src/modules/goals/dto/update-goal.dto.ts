import { IsDateString, IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import type { GoalStatus } from "@aion/shared-types";

const goalStatuses: GoalStatus[] = ["open", "active", "paused", "achieved", "abandoned"];

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  goalType?: string;

  @IsOptional()
  @IsString()
  lifeArea?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsIn(goalStatuses)
  status?: GoalStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}