import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import type { TwoFactorMethod } from "@aion/shared-types";

const twoFactorMethods: TwoFactorMethod[] = ["authenticator", "email", "sms"];

export class UpdateTwoFactorDto {
  @IsBoolean()
  enabled!: boolean;

  @IsOptional()
  @IsIn(twoFactorMethods)
  method?: TwoFactorMethod;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phoneHint?: string;
}
