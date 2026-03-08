import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";
import type { ConsentStatus } from "@aion/shared-types";

const statuses: ConsentStatus[] = ["granted", "revoked"];

export class SetConsentDto {
  @IsString()
  scope!: string;

  @IsIn(statuses)
  status!: ConsentStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;
}
