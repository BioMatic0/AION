import { IsArray, IsOptional, IsString, MaxLength } from "class-validator";

export class MirrorInputDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  context?: string[];
}