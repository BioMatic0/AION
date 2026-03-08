interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}

export function SectionHeader({ eyebrow, title, description, badge }: SectionHeaderProps) {
  return (
    <div className="rounded-[28px] bg-white p-8 shadow-panel">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-ink">{title}</h1>
          <p className="mt-4 text-base leading-8 text-slate/80">{description}</p>
        </div>
        {badge ? (
          <div className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm text-slate">{badge}</div>
        ) : null}
      </div>
    </div>
  );
}