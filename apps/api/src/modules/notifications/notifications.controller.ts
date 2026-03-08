import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { UpdateNotificationPreferencesDto } from "./dto/update-notification-preferences.dto";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("preferences")
  getPreferences() {
    return this.notificationsService.getPreferences();
  }

  @Put("preferences")
  updatePreferences(@Body() dto: UpdateNotificationPreferencesDto) {
    return this.notificationsService.updatePreferences(dto);
  }

  @Get("history")
  getHistory() {
    return this.notificationsService.getHistory();
  }

  @Get("jobs")
  getJobs() {
    return this.notificationsService.getJobs();
  }

  @Post("preview")
  createPreview() {
    return this.notificationsService.createPreviewNotification();
  }
}