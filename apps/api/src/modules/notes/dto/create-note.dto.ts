import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsString()
  sourceType?: string;
}