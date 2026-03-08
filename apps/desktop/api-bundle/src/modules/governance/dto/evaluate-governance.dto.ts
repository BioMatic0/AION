import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

const responseModes = ["standard", "speed", "thinking", "expert", "mirror", "growth", "quantum-lens", "deep-search"] as const;

export class EvaluateGovernanceDto {
  @IsString()
  content!: string;

  @IsOptional()
  @IsIn(responseModes)
  mode?: (typeof responseModes)[number];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  adaptiveBoundaryLevel?: number;
}
