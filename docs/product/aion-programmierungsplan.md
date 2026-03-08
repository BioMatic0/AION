# AION Programmierungsplan

Stand: 2026-03-08

## Ausgangslage

Hinweis: Das urspruenglich referenzierte PDF `AION_Gesamtpaket_Patrick_Wirth.pdf` war in dieser Sitzung nicht direkt lesbar, weil das angegebene Laufwerk `D:` aktuell nicht eingebunden ist. Dieser Plan basiert daher auf dem vorhandenen Repository, den Architekturdateien unter `docs/` und dem aktuellen MVP-Stand im Monorepo.

## Aktueller Projektstand

Bereits vorhanden:

- Monorepo mit `apps/web`, `apps/api`, `apps/worker` und geteilten Paketen
- Next.js Web-App mit Routen fuer Dashboard, Journal, Diary, Notes, Goals, Analysis, Mirror, Growth, Notifications, Governance, Privacy und Security
- NestJS API mit Modulgrenzen fuer Kernprodukt, Governance, Privacy, Consent, Audit und Security
- Prisma-Schema fuer Nutzer, Capture, Goals, Notifications, Governance, Privacy, Security, Audit und AI-bezogene Daten
- Deterministische AI-Orchestrierung fuer Analysis, Mirror, Growth, Memory und Quantum Lens
- Sichtbare Governance-, Privacy- und Security-Oberflaechen
- Testgrundlage mit API-Tests, Vitest und Playwright-Smoketests

Noch offen oder nur teilweise umgesetzt:

- externe LLM-Anbindung
- Embeddings und Retrieval-Pipeline
- Worker-gestuetzte Hintergrundjobs
- echte Benachrichtigungsauslieferung
- ausfuehrbare Export- und Loeschprozesse
- Ablosung verbleibender In-Memory-Logik durch Prisma-Repositories
- echte Sicherheitsheuristiken statt Simulationen
- Vollausbau von Browser-, Voice-, Media- und Kollaborationsfunktionen

## Zielbild

Ziel ist eine produktionsreife AION-MVP-Plattform mit:

- stabiler Persistenz statt fluechtiger Laufzeitdaten
- belastbarer AI-Pipeline mit Governance-Durchsetzung
- nachvollziehbarer Privacy-, Consent- und Security-Ausfuehrung
- klar abgegrenzten Release-Slices fuer MVP, Beta und Ausbauphase

## Programmierungsphasen

### Phase 0: Anforderungen finalisieren

Ziel:

- PDF-Inhalt nachliefern oder Laufwerk `D:` wieder verfuegbar machen
- Anforderungen aus PDF gegen den Repo-Stand mappen
- Epics, Muss-Kriterien und Nicht-Ziele verbindlich festlegen

Arbeitspakete:

- PDF automatisch extrahieren und in Backlog-Eintraege ueberfuehren
- vorhandene Features mit dokumentierten Anforderungen abgleichen
- Lueckenliste mit Prioritaet `MVP`, `Beta`, `spaeter` erstellen

Ergebnis:

- belastbares Scope-Dokument als Single Source of Truth

### Phase 1: Entwicklungsumgebung und Betriebsbasis haerten

Ziel:

- reproduzierbare lokale und spaetere Staging-Umgebung

Arbeitspakete:

- Node 24, pnpm 10, PostgreSQL 16 und Redis 7 verbindlich aufsetzen
- `node`, `pnpm` und `git` sauber in den `PATH` bringen
- `.env` und Secret-Handling standardisieren
- Docker- oder lokale Fallback-Setups dokumentieren
- Start-, Build-, Lint- und Testpfade auf einer frischen Maschine pruefen

Ergebnis:

- jeder Entwickler kann das System reproduzierbar starten und testen

### Phase 2: Persistenz konsequent abschliessen

Ziel:

- alle Kernmodule auf Prisma-gestuetzte Persistenz umstellen

Arbeitspakete:

- verbleibende In-Memory-Services identifizieren
- Repository-Layer je Fachmodul einfuehren
- Controller-Schnittstellen stabil halten, nur Service-Implementierungen tauschen
- Migrationen, Seeds und Datenvalidierung pro Domane absichern
- API-Tests auf persistente Pfade umstellen

Prioritaet:

- Journal
- Diary
- Notes
- Goals
- Notifications
- Memory
- Analysis, Mirror und Growth

Ergebnis:

- keine kritischen Nutzdaten liegen nur noch im Speicher

### Phase 3: AI-Orchestrierung produktionsfaehig machen

Ziel:

- von deterministischen Regeln zu einer kontrollierten Provider-Integration wechseln

Arbeitspakete:

- Provider-Adapter fuer externe LLMs einfuehren
- Prompt-Versionierung in `packages/prompts` runtime-faehig machen
- Retrieval-Pipeline mit persistentem Memory aufbauen
- Embedding-Generierung in den Worker verschieben
- Governance-Entscheidungen vor und nach Modellaufrufen auditiert absichern
- Fallbacks definieren, wenn Provider ausfallen oder Governance blockiert

Ergebnis:

- echte AI-Ausgaben bei gleichzeitig nachvollziehbarer Policy-Durchsetzung

### Phase 4: Hintergrundjobs und Benachrichtigungen vollenden

Ziel:

- asynchrone und zustellbare Systemprozesse einfuehren

Arbeitspakete:

- Redis-basierte Queue fuer Worker-Jobs nutzen
- Notification Jobs, Retries und Dead-Letter-Verhalten definieren
- Mail-Versand oder Provider-Anbindung fuer Incident- und Reminder-Mails umsetzen
- spaeter Push oder In-App Realtime sauber vorbereiten
- Observability fuer fehlerhafte Jobs einbauen

Ergebnis:

- Erinnerungen, Sicherheitsmeldungen und Exportprozesse laufen nicht mehr nur stub-basiert

### Phase 5: Privacy, Consent und Security operationalisieren

Ziel:

- Trust-Bereiche von Demo-Sichtbarkeit zu echter Ausfuehrung bringen

Arbeitspakete:

- Export Requests als echten Datenexport implementieren
- Deletion Requests mit Statusmaschine und Fristen umsetzen
- Consent-Aenderungen revisionssicher koppeln
- Incident Detection von Simulation auf echte Heuristiken erweitern
- optional 2FA-, Device-Trust- und Session-Hardening vorbereiten
- Privacy-, Security- und Audit-Events quer verknuepfen

Ergebnis:

- Governance, Privacy und Security werden operative Produktfunktionen

### Phase 6: Frontend auf produktive Nutzerfluesse trimmen

Ziel:

- vorhandene Routen in saubere End-to-End-Erlebnisse ueberfuehren

Arbeitspakete:

- Platzhalterbereiche gegen echten Reifegrad abgrenzen
- API-Fehler, Ladezustaende und Leerdaten sauber vereinheitlichen
- Kernfluesse priorisieren: Capture, Goals, Notifications, Analysis, Governance, Privacy, Security
- unvollstaendige Bereiche wie `browser`, `voice`, `media` per Feature Flag oder Roadmap-Hinweis kontrollieren
- UX fuer Datenschutz, Governance und Vorfallkommunikation vertrauenswuerdig ausbauen

Ergebnis:

- konsistente, glaubwuerdige und releasefaehige Nutzeroberflaeche

### Phase 7: Qualitaetssicherung und Freigabeprozess

Ziel:

- belastbare technische Freigabekriterien schaffen

Arbeitspakete:

- Unit-, Integrations- und E2E-Abdeckung auf kritische Fluesse fokussieren
- Contract-Tests zwischen Web, API und Shared Packages einfuehren
- Testmatrix fuer Governance-Blocking, Privacy-Requests und Security-Incidents aufbauen
- Release-Checkliste fuer Migrationen, Seeds, Queue-Jobs und Audit-Trails definieren
- Runbooks fuer Backup, Incident Response und Rollback pruefen

Ergebnis:

- jede Auslieferung ist technisch und fachlich nachvollziehbar freigabefaehig

## Empfohlene Release-Slices

### Release 1: Stabiler MVP

Umfang:

- Capture, Goals, Notifications
- Governance-, Privacy- und Security-Center
- persistente Kernmodule
- deterministische AI-Funktionen

Nicht enthalten:

- externe LLMs
- echte Embeddings
- Voice, Media, Browser

### Release 2: Intelligente Beta

Umfang:

- externe Modellanbieter
- Retrieval und Memory-Kontext
- Worker-gestuetzte Jobs
- echte Benachrichtigungsauslieferung
- operative Privacy- und Incident-Workflows

### Release 3: Ausbauphase

Umfang:

- Browser
- Voice
- Media
- Collaboration
- erweiterte Sicherheits- und Trust-Funktionen

## Kritische Risiken

- Dokument- und Repo-Stand koennen fachlich auseinanderlaufen, solange das PDF nicht gegengeprueft ist
- In-Memory-Restlogik kann zu inkonsistentem Verhalten zwischen Neustarts fuehren
- externe AI-Anbieter ohne saubere Policy- und Audit-Kette wuerden das Trust-Modell untergraben
- Privacy- und Security-Stubs wirken produktreif, sind aber ohne Ausfuehrungslogik nur teilweise belastbar
- unklare Priorisierung von Nebenmodulen gefaehrdet den MVP-Fokus

## Empfohlene naechste Schritte

1. PDF wieder zugreifbar machen und Anforderungen gegen diesen Plan validieren.
2. Phase 1 und Phase 2 als unmittelbaren Sprint-Block starten.
3. Alle offenen In-Memory-Module in eine priorisierte Persistenzliste ueberfuehren.
4. Einen separaten Epic-Track fuer AI-Provider, Embeddings und Worker anlegen.
5. Privacy-, Security- und Governance-Funktionen als produktionskritische Tracks behandeln, nicht als spaetere Dekoration.
