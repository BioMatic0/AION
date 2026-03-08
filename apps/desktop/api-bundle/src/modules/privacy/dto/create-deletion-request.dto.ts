import { IsIn } from "class-validator";
import type { DeletionScope } from "@aion/shared-types";

const scopes: DeletionScope[] = ["account", "journal", "notes", "memory"];

export class CreateDeletionRequestDto {
  @IsIn(scopes)
  scope!: DeletionScope;
}
