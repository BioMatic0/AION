import { IsBoolean, IsIn, IsOptional, IsString, Matches } from "class-validator";
import type { NotificationFrequency, NotificationTone } from "@aion/shared-types";

const frequencies: NotificationFrequency[] = ["daily", "every_2_days", "weekly"];
const tones: NotificationTone[] = ["motivational", "reflective", "mixed"];

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  developmentEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  goalRemindersEnabled?: boolean;

  @IsOptional()
  @IsIn(frequencies)
  frequency?: NotificationFrequency;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  preferredTime?: string;

  @IsOptional()
  @IsString()
  preferredWeekday?: string;

  @IsOptional()
  @IsIn(tones)
  tone?: NotificationTone;
}