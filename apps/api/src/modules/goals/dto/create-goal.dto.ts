import { IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import type { GoalStatus } from "@aion/shared-types";

const goalStatuses: GoalStatus[] = ["open", "active", "paused", "achieved", "abandoned"];

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  goalType?: string;

  @IsString()
  @IsNotEmpty()
  lifeArea!: string;

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