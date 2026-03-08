import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateGoalDto } from "./dto/create-goal.dto";
import { CreateGoalMilestoneDto } from "./dto/create-goal-milestone.dto";
import { UpdateGoalDto } from "./dto/update-goal.dto";
import { UpdateGoalMilestoneDto } from "./dto/update-goal-milestone.dto";
import { GoalsService } from "./goals.service";

@Controller("goals")
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  listGoals() {
    return this.goalsService.listGoals();
  }

  @Get("stats")
  getStats() {
    return this.goalsService.getStats();
  }

  @Get("achievements")
  getAchievements() {
    return this.goalsService.getAchievements();
  }

  @Get(":id")
  getGoal(@Param("id") id: string) {
    return this.goalsService.getGoal(id);
  }

  @Post()
  createGoal(@Body() dto: CreateGoalDto) {
    return this.goalsService.createGoal(dto);
  }

  @Patch(":id")
  updateGoal(@Param("id") id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.updateGoal(id, dto);
  }

  @Delete(":id")
  removeGoal(@Param("id") id: string) {
    return this.goalsService.removeGoal(id);
  }

  @Post(":id/milestones")
  addMilestone(@Param("id") id: string, @Body() dto: CreateGoalMilestoneDto) {
    return this.goalsService.addMilestone(id, dto);
  }

  @Patch(":goalId/milestones/:milestoneId")
  updateMilestone(
    @Param("goalId") goalId: string,
    @Param("milestoneId") milestoneId: string,
    @Body() dto: UpdateGoalMilestoneDto
  ) {
    return this.goalsService.updateMilestone(goalId, milestoneId, dto);
  }
}