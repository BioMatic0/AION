import { Body, Controller, Get, Post } from "@nestjs/common";
import { GrowthEvaluationDto } from "./dto/growth-evaluation.dto";
import { GrowthService } from "./growth.service";

@Controller("growth")
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get("state")
  getState() {
    return this.growthService.getState();
  }

  @Get("history")
  getHistory() {
    return this.growthService.getHistory();
  }

  @Get("interventions")
  getInterventions() {
    return this.growthService.getInterventions();
  }

  @Post("evaluate")
  evaluate(@Body() dto: GrowthEvaluationDto) {
    return this.growthService.evaluate(dto);
  }
}