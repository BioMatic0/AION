interface StatusNoticeProps {
  message: string;
  variant?: "info" | "success" | "error";
}

const styles: Record<NonNullable<StatusNoticeProps["variant"]>, string> = {
  info: "border-moss/20 bg-moss/5 text-slate",
  success: "border-moss/25 bg-moss/10 text-slate",
  error: "border-ember/20 bg-ember/10 text-ink"
};

export function StatusNotice({ message, variant = "info" }: StatusNoticeProps) {
  return <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${styles[variant]}`}>{message}</div>;
}
