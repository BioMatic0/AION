import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthenticatedUserSummary, SecuritySessionSummary } from "@aion/shared-types";

export interface RequestAuthContext {
  user: AuthenticatedUserSummary;
  session: SecuritySessionSummary;
}

interface AuthenticatedRequest extends Request {
  aionAuth?: RequestAuthContext;
}

export const CurrentAuth = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.aionAuth ?? null;
});

export const CurrentUserId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.aionAuth?.user.id ?? null;
});
