import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";
import type { ExportFormat, PrivacyMode } from "@aion/shared-types";

const privacyModes: PrivacyMode[] = ["standard", "privacy-max"];
const exportFormats: ExportFormat[] = ["json", "pdf"];

export class UpdatePrivacyPreferencesDto {
  @IsOptional()
  @IsIn(privacyModes)
  privacyMode?: PrivacyMode;

  @IsOptional()
  @IsBoolean()
  analyticsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  longTermMemoryEnabled?: boolean;

  @IsOptional()
  @IsIn(exportFormats)
  exportFormat?: ExportFormat;

  @IsOptional()
  @IsBoolean()
  securityAlerts?: boolean;

  @IsOptional()
  @IsString()
  retentionProfile?: string;
}
