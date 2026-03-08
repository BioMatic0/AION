import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGoalMilestoneDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}