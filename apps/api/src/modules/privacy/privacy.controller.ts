import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { PrivacyService } from "./privacy.service";
import { CreateDeletionRequestDto } from "./dto/create-deletion-request.dto";
import { CreateExportRequestDto } from "./dto/create-export-request.dto";
import { UpdatePrivacyPreferencesDto } from "./dto/update-privacy-preferences.dto";

@Controller("privacy")
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get("overview")
  getOverview() {
    return this.privacyService.getOverview();
  }

  @Get("preferences")
  getPreferences() {
    return this.privacyService.getPreferences();
  }

  @Patch("preferences")
  updatePreferences(@Body() dto: UpdatePrivacyPreferencesDto) {
    return this.privacyService.updatePreferences(dto);
  }

  @Post("export")
  requestExport(@Body() dto: CreateExportRequestDto) {
    return this.privacyService.requestExport(dto);
  }

  @Post("deletion")
  requestDeletion(@Body() dto: CreateDeletionRequestDto) {
    return this.privacyService.requestDeletion(dto);
  }
}
