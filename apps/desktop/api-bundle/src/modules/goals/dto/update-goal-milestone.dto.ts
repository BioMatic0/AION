import { IsDateString, IsIn, IsOptional, IsString } from "class-validator";
import type { GoalMilestoneStatus } from "@aion/shared-types";

const milestoneStatuses: GoalMilestoneStatus[] = ["pending", "in_progress", "completed"];

export class UpdateGoalMilestoneDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsIn(milestoneStatuses)
  status?: GoalMilestoneStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}