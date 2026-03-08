import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { CreateGoalDto } from "./dto/create-goal.dto";
import { CreateGoalMilestoneDto } from "./dto/create-goal-milestone.dto";
import { UpdateGoalDto } from "./dto/update-goal.dto";
import { UpdateGoalMilestoneDto } from "./dto/update-goal-milestone.dto";
import { GoalsService } from "./goals.service";

@UseGuards(SessionAuthGuard)
@Controller("goals")
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  listGoals(@CurrentUserId() userId: string) {
    return this.goalsService.listGoals(userId);
  }

  @Get("stats")
  getStats(@CurrentUserId() userId: string) {
    return this.goalsService.getStats(userId);
  }

  @Get("achievements")
  getAchievements(@CurrentUserId() userId: string) {
    return this.goalsService.getAchievements(userId);
  }

  @Get(":id")
  getGoal(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.goalsService.getGoal(id, userId);
  }

  @Post()
  createGoal(@CurrentUserId() userId: string, @Body() dto: CreateGoalDto) {
    return this.goalsService.createGoal(dto, userId);
  }

  @Patch(":id")
  updateGoal(@CurrentUserId() userId: string, @Param("id") id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.updateGoal(id, dto, userId);
  }

  @Delete(":id")
  removeGoal(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.goalsService.removeGoal(id, userId);
  }

  @Post(":id/milestones")
  addMilestone(@CurrentUserId() userId: string, @Param("id") id: string, @Body() dto: CreateGoalMilestoneDto) {
    return this.goalsService.addMilestone(id, dto, userId);
  }

  @Patch(":goalId/milestones/:milestoneId")
  updateMilestone(
    @CurrentUserId() userId: string,
    @Param("goalId") goalId: string,
    @Param("milestoneId") milestoneId: string,
    @Body() dto: UpdateGoalMilestoneDto
  ) {
    return this.goalsService.updateMilestone(goalId, milestoneId, dto, userId);
  }
}
