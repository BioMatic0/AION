# AION Programmierungsplan

Stand: 2026-03-08

## Ausgangslage

Hinweis: Das urspruenglich referenzierte PDF `AION_Gesamtpaket_Patrick_Wirth.pdf` war in dieser Sitzung nicht direkt lesbar, weil das angegebene Laufwerk `D:` aktuell nicht eingebunden ist. Dieser Plan basiert daher auf dem vorhandenen Repository, den Architekturdateien unter `docs/` und dem aktuellen MVP-Stand im Monorepo.

## Aktueller Projektstand

Bereits vorhanden:

- Monorepo mit `apps/web`, `apps/api`, `apps/worker` und geteilten Paketen
- Next.js Web-App mit Routen fuer Dashboard, Journal, Diary, Notes, Goals, Analysis, Mirror, Growth, Notifications, Governance, Privacy und Security
- NestJS API mit Modulgrenzen fuer Kernprodukt, Governance, Privacy, Consent, Audit und Security
- Prisma-Schema fuer Nutzer, Erfassung, Ziele, Benachrichtigungen, Governance, Datenschutz, Sicherheit, Audit und KI-bezogene Daten
- Deterministische KI-Orchestrierung fuer Analyse, Spiegel, Wachstum, Speicher und Quantenlinse
- Sichtbare Governance-, Datenschutz- und Sicherheitsoberflaechen
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
- belastbarer KI-Pipeline mit Governance-Durchsetzung
- nachvollziehbarer Datenschutz-, Consent- und Sicherheitsausfuehrung
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
- Migrationen, Seeds und Datenvalidierung pro Domaene absichern
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

### Phase 3: KI-Orchestrierung produktionsfaehig machen

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

- echte KI-Ausgaben bei gleichzeitig nachvollziehbarer Policy-Durchsetzung

### Phase 4: Hintergrundjobs und Benachrichtigungen vollenden

Ziel:

- asynchrone und zustellbare Systemprozesse einfuehren

Arbeitspakete:

- Redis-basierte Queue fuer Hintergrundjobs nutzen
- Benachrichtigungsjobs, Wiederholungsversuche und Dead-Letter-Verhalten definieren
- Mail-Versand oder Provider-Anbindung fuer Vorfall- und Erinnerungsmails umsetzen
- spaeter Push oder In-App Realtime sauber vorbereiten
- Observability fuer fehlerhafte Jobs einbauen

Ergebnis:

- Erinnerungen, Sicherheitsmeldungen und Exportprozesse laufen nicht mehr nur stub-basiert

### Phase 5: Privacy, Consent und Security operationalisieren

Ziel:

- Vertrauensbereiche von Demo-Sichtbarkeit zu echter Ausfuehrung bringen

Arbeitspakete:

- Export Requests als echten Datenexport implementieren
- Deletion Requests mit Statusmaschine und Fristen umsetzen
- Consent-Aenderungen revisionssicher koppeln
- Vorfallerkennung von Simulationen auf echte Heuristiken erweitern
- optional 2FA-, Geraetevertrauen- und Session-Hardening vorbereiten
- Datenschutz-, Sicherheits- und Audit-Ereignisse quer verknuepfen

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
- Testmatrix fuer Governance-Blockierungen, Datenschutzanfragen und Sicherheitsvorfaelle aufbauen
- Release-Checkliste fuer Migrationen, Seeds, Hintergrundjobs und Audit-Trails definieren
- Runbooks fuer Backup, Vorfallreaktion und Rollback pruefen

Ergebnis:

- jede Auslieferung ist technisch und fachlich nachvollziehbar freigabefaehig

## Empfohlene Release-Slices

### Release 1: Stabiler MVP

Umfang:

- Capture, Goals, Notifications
- Governance-, Datenschutz- und Sicherheitsbereiche
- persistente Kernmodule
- deterministische KI-Funktionen

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
- operative Datenschutz- und Vorfallablaeufe

### Release 3: Ausbauphase

Umfang:

- Browser
- Voice
- Media
- Collaboration
- erweiterte Sicherheits- und Vertrauensfunktionen

## Kritische Risiken

- Dokument- und Repo-Stand koennen fachlich auseinanderlaufen, solange das PDF nicht gegengeprueft ist
- In-Memory-Restlogik kann zu inkonsistentem Verhalten zwischen Neustarts fuehren
- externe KI-Anbieter ohne saubere Policy- und Audit-Kette wuerden das Vertrauensmodell untergraben
- Datenschutz- und Sicherheits-Stubs wirken produktreif, sind aber ohne Ausfuehrungslogik nur teilweise belastbar
- unklare Priorisierung von Nebenmodulen gefaehrdet den MVP-Fokus

## Empfohlene naechste Schritte

1. PDF wieder zugreifbar machen und Anforderungen gegen diesen Plan validieren.
2. Phase 1 und Phase 2 als unmittelbaren Sprint-Block starten.
3. Alle offenen In-Memory-Module in eine priorisierte Persistenzliste ueberfuehren.
4. Einen separaten Epic-Track fuer KI-Provider, Embeddings und Worker anlegen.
5. Datenschutz-, Sicherheits- und Governance-Funktionen als produktionskritische Arbeitsstraenge behandeln, nicht als spaetere Dekoration.
