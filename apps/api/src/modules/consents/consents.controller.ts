import { Body, Controller, Get, Post } from "@nestjs/common";
import { ConsentsService } from "./consents.service";
import { SetConsentDto } from "./dto/set-consent.dto";

@Controller("consents")
export class ConsentsController {
  constructor(private readonly consentsService: ConsentsService) {}

  @Get()
  getConsents() {
    return this.consentsService.listConsents();
  }

  @Post()
  setConsent(@Body() dto: SetConsentDto) {
    return this.consentsService.setConsent(dto);
  }
}
