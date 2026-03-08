export interface LogContext {
  scope: string;
  event: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export function formatLogLine(context: LogContext): string {
  return `[${context.scope}] ${context.event}`;
}
