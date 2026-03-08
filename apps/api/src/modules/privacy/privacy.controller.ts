import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { PrivacyService } from "./privacy.service";
import { CreateDeletionRequestDto } from "./dto/create-deletion-request.dto";
import { CreateExportRequestDto } from "./dto/create-export-request.dto";
import { UpdatePrivacyPreferencesDto } from "./dto/update-privacy-preferences.dto";

@UseGuards(SessionAuthGuard)
@Controller("privacy")
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get("overview")
  getOverview(@CurrentUserId() userId: string) {
    return this.privacyService.getOverview(userId);
  }

  @Get("preferences")
  getPreferences(@CurrentUserId() userId: string) {
    return this.privacyService.getPreferences(userId);
  }

  @Patch("preferences")
  updatePreferences(@CurrentUserId() userId: string, @Body() dto: UpdatePrivacyPreferencesDto) {
    return this.privacyService.updatePreferences(dto, userId);
  }

  @Post("export")
  requestExport(@CurrentUserId() userId: string, @Body() dto: CreateExportRequestDto) {
    return this.privacyService.requestExport(dto, userId);
  }

  @Post("deletion")
  requestDeletion(@CurrentUserId() userId: string, @Body() dto: CreateDeletionRequestDto) {
    return this.privacyService.requestDeletion(dto, userId);
  }
}
