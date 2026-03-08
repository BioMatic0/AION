import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { GrowthEvaluationDto } from "./dto/growth-evaluation.dto";
import { GrowthService } from "./growth.service";

@UseGuards(SessionAuthGuard)
@Controller("growth")
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get("state")
  getState(@CurrentUserId() userId: string) {
    return this.growthService.getState(userId);
  }

  @Get("history")
  getHistory(@CurrentUserId() userId: string) {
    return this.growthService.getHistory(userId);
  }

  @Get("interventions")
  getInterventions(@CurrentUserId() userId: string) {
    return this.growthService.getInterventions(userId);
  }

  @Post("evaluate")
  evaluate(@CurrentUserId() userId: string, @Body() dto: GrowthEvaluationDto) {
    return this.growthService.evaluate(dto, userId);
  }
}
