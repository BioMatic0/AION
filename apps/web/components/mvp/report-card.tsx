import type { AnalysisReport, MirrorReport, QuantumLensReport } from "@aion/shared-types";

type Report = AnalysisReport | MirrorReport | QuantumLensReport;

interface ReportCardProps {
  report: Report;
}

const evidenceLabels: Record<Report["evidenceLabel"], string> = {
  factual: "factual",
  inferred: "inferred",
  speculative: "speculative",
  symbolic: "symbolic",
  uncertain: "uncertain"
};

const modeLabels: Record<Report["mode"], string> = {
  standard: "Standard",
  speed: "Speed",
  thinking: "Thinking",
  expert: "Expert",
  mirror: "Mirror",
  growth: "Growth",
  "quantum-lens": "Quantum lens",
  "deep-search": "Deep search"
};

export function ReportCard({ report }: ReportCardProps) {
  return (
    <article className="rounded-[28px] bg-white p-8 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">{modeLabels[report.mode]}</p>
          <h2 className="mt-2 font-display text-3xl text-ink">{report.summary}</h2>
        </div>
        <div className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-xs text-slate">{evidenceLabels[report.evidenceLabel]}</div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Observation</div><p className="mt-3 text-sm leading-7 text-slate/80">{report.observation}</p></div>
        <div className="rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Psychodynamics</div><p className="mt-3 text-sm leading-7 text-slate/80">{report.psychology}</p></div>
        <div className="rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Archetype</div><p className="mt-3 text-sm leading-7 text-slate/80">{report.archetype}</p></div>
        <div className="rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Shadow check</div><p className="mt-3 text-sm leading-7 text-slate/80">{report.shadowCheck}</p></div>
      </div>
      <div className="mt-4 rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Development hint</div><p className="mt-3 text-sm leading-7 text-slate/80">{report.developmentHint}</p></div>
      <div className="mt-4 rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Timeline connection</div><p className="mt-3 text-sm leading-7 text-slate/80">{report.timelineConnection}</p></div>
      {"disconfirmingView" in report ? (
        <div className="mt-4 rounded-3xl bg-slate p-5 text-mist"><div className="text-xs uppercase tracking-[0.22em] text-mist/60">Mirror challenge</div><p className="mt-3 text-sm leading-7 text-mist/80">{report.disconfirmingView}</p><p className="mt-3 text-sm font-semibold text-mist">{report.mirrorQuestion}</p></div>
      ) : null}
      {"stateDescription" in report ? (
        <div className="mt-4 rounded-3xl bg-slate p-5 text-mist">
          <div className="text-xs uppercase tracking-[0.22em] text-mist/60">Quantum lens</div>
          <p className="mt-3 text-sm leading-7 text-mist/80">{report.stateDescription}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-mist/55">Has been</div>
              <div className="mt-2 text-xl font-semibold text-mist">{report.potentialTruth.hasBeen.toFixed(2)}</div>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-mist/55">Can be</div>
              <div className="mt-2 text-xl font-semibold text-mist">{report.potentialTruth.canBe.toFixed(2)}</div>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-mist/55">Tends to be</div>
              <div className="mt-2 text-xl font-semibold text-mist">{report.potentialTruth.tendsToBe.toFixed(2)}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-mist/80">{report.collapsePattern}</p>
          <p className="mt-3 text-sm leading-7 text-mist/80">{report.hiddenOption}</p>
          <p className="mt-3 text-sm font-semibold text-mist">{report.fieldQuestion}</p>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate/65">
        {report.extractedConcepts.map((concept) => (
          <span key={concept} className="rounded-full bg-mist px-3 py-1">{concept}</span>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {report.suggestedQuestions.map((question) => (
          <div key={question} className="rounded-2xl bg-mist/45 px-4 py-3 text-sm text-slate/80">{question}</div>
        ))}
      </div>
    </article>
  );
}
