import { IsIn, IsOptional } from "class-validator";
import type { ExportFormat } from "@aion/shared-types";

const formats: ExportFormat[] = ["json", "pdf"];

export class CreateExportRequestDto {
  @IsOptional()
  @IsIn(formats)
  format?: ExportFormat;
}
