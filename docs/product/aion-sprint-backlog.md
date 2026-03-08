# AION Sprint-Backlog

Stand: 2026-03-08

## Planungsannahmen

Dieser Backlog basiert auf dem aktuellen Repository-Stand und dem Dokument [aion-programmierungsplan.md](C:\Users\Administrator\Documents\New project\docs\product\aion-programmierungsplan.md).

Arbeitsannahmen:

- Sprintlaenge: 2 Wochen
- Prioritaet: stabiler MVP vor Feature-Ausbau
- Schaetzung: `S` = 1 bis 2 Tage, `M` = 3 bis 5 Tage, `L` = 6 bis 10 Tage, `XL` = groesser als 10 Tage
- Teamannahme: kleines Kernteam mit Fokus auf Web, API und Plattform

## Epic-Uebersicht

| Epic | Titel | Ziel | Prioritaet | Release |
| --- | --- | --- | --- | --- |
| EP-01 | Arbeitsumgebung und Betriebsbasis | Lokales Setup, PATH, ENV, Startbarkeit, Build-Pfade | Kritisch | Release 1 |
| EP-02 | Persistenz der Kernmodule | In-Memory-Reste in Prisma ueberfuehren | Kritisch | Release 1 |
| EP-03 | Vertrauensmodule operationalisieren | Privacy, Consent, Security, Audit produktionsnah machen | Hoch | Release 1 |
| EP-04 | Frontend-MVP haerten | End-to-End-Fluesse, Fehlerbilder, Feature-Abgrenzung | Hoch | Release 1 |
| EP-05 | AI-Orchestrierung erweitern | Provider, Prompts, Retrieval, Governance-Hooks | Hoch | Release 2 |
| EP-06 | Worker und Hintergrundjobs | Queue, Embeddings, Notification Jobs, Retries | Hoch | Release 2 |
| EP-07 | Qualitaet und Freigabeprozess | Testabdeckung, Release Gates, Runbooks | Kritisch | Release 1 |
| EP-08 | Ausbauprodukte | Browser, Voice, Media, Collaboration | Mittel | Release 3 |

## Epic-Details

### EP-01 Arbeitsumgebung und Betriebsbasis

Ziel:

- reproduzierbare Entwicklung, Buildbarkeit und lokale Betriebsfaehigkeit

Tickets:

| ID | Ticket | Beschreibung | Aufwand | Abhaengigkeiten |
| --- | --- | --- | --- | --- |
| AION-101 | Toolchain-Pfade bereinigen | `node`, `pnpm` und `git` systemweit oder projektsicher in den PATH bringen und dokumentieren | S | keine |
| AION-102 | ENV-Standard vereinheitlichen | `.env`, `.env.example`, benoetigte Secrets und lokale Defaults ueberarbeiten | S | AION-101 |
| AION-103 | Lokales Datenbank-Setup verifizieren | PostgreSQL und Redis via Compose oder lokalem Fallback startbar machen | M | AION-102 |
| AION-104 | Start- und Buildmatrix pruefen | `build`, `lint`, `typecheck`, `test`, API-Start und Web-Start gegen frisches Setup absichern | M | AION-103 |
| AION-105 | Entwickler-Runbook erweitern | README und Setup-Doku mit Windows-spezifischen Startpfaden aktualisieren | S | AION-104 |

Definition of done:

- frisches Setup startet Web, API und Datenhaltung nachvollziehbar
- bekannte PATH-Probleme sind beseitigt oder dokumentiert umschifft

### EP-02 Persistenz der Kernmodule

Ziel:

- alle kritischen Nutzdaten konsistent in PostgreSQL statt im Speicher halten

Tickets:

| ID | Ticket | Beschreibung | Aufwand | Abhaengigkeiten |
| --- | --- | --- | --- | --- |
| AION-201 | Persistenz-Audit erstellen | alle Module mit In-Memory-Restlogik inventarisieren und nach Risiko priorisieren | S | EP-01 |
| AION-202 | Journal auf Repository-Layer umstellen | Service intern auf Prisma-Repositories umziehen ohne API-Bruch | M | AION-201 |
| AION-203 | Diary und Notes persistieren | beide Capture-Module voll auf persistente Pfade heben | M | AION-201 |
| AION-204 | Goals und Notifications persistieren | Reminder, Jobs, Historie und Praeferenzen sauber persistieren | L | AION-201 |
| AION-205 | Memory persistent machen | Memory-Items, Sucheingang und Ranking-Basis auf persistente Daten stutzen | L | AION-201 |
| AION-206 | Analysis, Mirror, Growth persistieren | generierte Reports und Zustandsdaten aus dem Cache in Prisma ueberfuehren | L | AION-201 |
| AION-207 | Persistenz-Verifikation automatisieren | `verify:persistence` auf alle priorisierten Module erweitern | M | AION-202 |

Definition of done:

- Neustarts verlieren keine priorisierten Nutzdaten
- Controller-Oberflaechen bleiben stabil
- Persistenztests decken Kernmodule ab

### EP-03 Vertrauensmodule operationalisieren

Ziel:

- Governance, Privacy, Consent und Security werden echte Betriebsfunktionen

Tickets:

| ID | Ticket | Beschreibung | Aufwand | Abhaengigkeiten |
| --- | --- | --- | --- | --- |
| AION-301 | Privacy-Export ausfuehren | Export Requests als echte Datenausleitung mit Status und Ablaufdatum umsetzen | L | EP-01, EP-02 |
| AION-302 | Deletion-Workflow umsetzen | Loeschanfragen mit Statusmaschine, Terminierung und Auditierung implementieren | L | EP-01, EP-02 |
| AION-303 | Consent-Lifecycle absichern | Consent-Aenderungen fachlich und revisionssicher mit Audit koppeln | M | EP-02 |
| AION-304 | Incident-Heuristiken einfuehren | simulierte Security-Triggers um erste echte Erkennungslogik erweitern | M | EP-01 |
| AION-305 | Session- und Device-Trust vorbereiten | Grundlage fuer Trusted Devices, Session-Hardening und spaetere 2FA schaffen | M | AION-304 |
| AION-306 | Trust-Events verknuepfen | Privacy-, Security- und Audit-Ereignisse quer referenzierbar machen | M | AION-301 |

Definition of done:

- Privacy- und Security-Funktionen loesen echte Backend-Prozesse aus
- Audit-Trail ist fuer kritische Trust-Aktionen vollstaendig

### EP-04 Frontend-MVP haerten

Ziel:

- die vorhandenen Produktbereiche werden releasefaehige Nutzerfluesse

Tickets:

| ID | Ticket | Beschreibung | Aufwand | Abhaengigkeiten |
| --- | --- | --- | --- | --- |
| AION-401 | Kernfluesse priorisieren | Capture, Goals, Notifications, Analysis, Governance, Privacy, Security als MVP-Fluesse fixieren | S | keine |
| AION-402 | Fehler- und Ladezustaende vereinheitlichen | API-Loading, Error und Empty States app-weit konsistent machen | M | AION-401 |
| AION-403 | Placeholder-Bereiche kennzeichnen | `browser`, `voice`, `media` und aehnliche Bereiche kontrolliert abgrenzen | S | AION-401 |
| AION-404 | Trust-Center UX verbessern | Governance-, Privacy- und Security-Screens auf Klarheit und Handlungsfaehigkeit trimmen | M | AION-402 |
| AION-405 | Navigation und Dashboard entruempeln | Fokus auf MVP-Bereiche, klare Startpunkte und Statusanzeigen | M | AION-401 |
| AION-406 | End-to-End-Fluesse stabilisieren | Kernfluesse mit echter API und ohne Demo-Fallback validieren | L | EP-02, AION-402 |

Definition of done:

- MVP-Nutzer koennen Kernfluesse ohne Sackgassen verwenden
- unfertige Produktbereiche werden nicht als abgeschlossen verkauft

### EP-05 AI-Orchestrierung erweitern

Ziel:

- kontrollierter Uebergang von deterministischer KI zu provider-gestuetzter Ausfuehrung

Tickets:

| ID | Ticket | Beschreibung | Aufwand | Abhaengigkeiten |
| --- | --- | --- | --- | --- |
| AION-501 | Provider-Adapter entwerfen | Schnittstelle fuer externe LLM-Anbieter definieren und in `packages/ai-core` integrieren | L | EP-02 |
| AION-502 | Prompt-Versionierung runtime-faehig machen | aktive Prompt-Version, Migration und Fallbacks einfuehren | M | AION-501 |
| AION-503 | Retrieval-Kontext definieren | Kontextaufbau aus Memory, Goals und Capture-Daten fachlich und technisch festlegen | M | EP-02 |
| AION-504 | Governance um Modellaufrufe erweitern | Pre- und Post-Processing mit Audit und Policy-Metadaten absichern | L | AION-501 |
| AION-505 | Provider-Fallbacks und Safe Halt | Fehlerstrategien, Timeouts und Governance-Halt in AI-Pipelines robust machen | M | AION-504 |

Definition of done:

- externe Modelle lassen sich kontrolliert anbinden
- jede AI-Antwort bleibt governanceseitig nachvollziehbar

### EP-06 Worker und Hintergrundjobs

Ziel:

- asynchrone Aufgaben sauber in den Worker verlagern

Tickets:

| ID | Ticket | Beschreibung | Aufwand | Abhaengigkeiten |
| --- | --- | --- | --- | --- |
| AION-601 | Queue-Grundlage einfuehren | Redis-basierte Job-Queue im Worker etablieren | L | EP-01 |
| AION-602 | Embedding-Jobs aufsetzen | Persistente Embedding-Generierung fuer Memory und Retrieval vorbereiten | L | AION-601, EP-05 |
| AION-603 | Notification Jobs produktiv machen | Reminder, Incident-Meldungen und Zustellversuche als Worker-Jobs umsetzen | L | AION-601, EP-03 |
| AION-604 | Retry- und DLQ-Strategie | gescheiterte Jobs beobachtbar und wiederholbar machen | M | AION-601 |
| AION-605 | Worker-Observability ausbauen | Job-Laufzeiten, Fehler und Status fuer Betrieb sichtbar machen | M | AION-604 |

Definition of done:

- asynchrone Aufgaben verlassen den Request-Pfad
- Fehler in Worker-Jobs bleiben nachvollziehbar und steuerbar

### EP-07 Qualitaet und Freigabeprozess

Ziel:

- Releases werden durch klare technische Gates abgesichert

Tickets:

| ID | Ticket | Beschreibung | Aufwand | Abhaengigkeiten |
| --- | --- | --- | --- | --- |
| AION-701 | Kritische Testmatrix definieren | Kernfaelle fuer Capture, Goals, Governance, Privacy und Security festlegen | S | keine |
| AION-702 | API-Integrationsluecken schliessen | fehlende Persistenz- und Trust-Szenarien als Tests abdecken | L | EP-02, EP-03 |
| AION-703 | Web-Smokes erweitern | MVP-Fluesse im Browser Ende-zu-Ende absichern | M | EP-04 |
| AION-704 | Release-Checkliste erstellen | Migrationen, Seeds, Audit, Worker und Rollback als Pflichtpruefung definieren | S | EP-01 |
| AION-705 | Runbooks validieren | Backup, Incident Response und Wiederanlauf praktisch pruefen | M | EP-03, EP-06 |
| AION-706 | Trust-Regressionstests erweitern | Privacy-, Consent-, Governance- und Security-Grenzfaelle systematisch als Regressionstest abdecken | M | EP-03 |

Definition of done:

- kritische Produktpfade sind vor Release test- und betriebsseitig abgesichert

### EP-08 Ausbauprodukte

Ziel:

- Nebenmodule geplant ausbauen, ohne den MVP zu verwischen

Tickets:

| ID | Ticket | Beschreibung | Aufwand | Abhaengigkeiten |
| --- | --- | --- | --- | --- |
| AION-801 | Browser-Modul konzipieren | Scope, Governance-Risiken und technische Architektur fuer Browser-Funktionen definieren | M | Release 2 |
| AION-802 | Voice-Pipeline konzipieren | STT, TTS, Datenschutz und Governance fuer Sprache planen | M | Release 2 |
| AION-803 | Media-Pipeline konzipieren | Upload, Verarbeitung, Speicherung und Trust-Gates fuer Medien planen | M | Release 2 |
| AION-804 | Collaboration-Roadmap erstellen | Rollen, Freigaben, Datentrennung und Auditing vorbereiten | M | Release 2 |

## Sprint-Empfehlung

### Sprint 1: Betriebsfaehiger MVP-Unterbau

Ziel:

- Setup stabilisieren und die hoechstriskanten Persistenzluecken schliessen

Commitment:

- AION-101
- AION-102
- AION-103
- AION-104
- AION-201
- AION-202
- AION-203
- AION-401
- AION-701
- AION-704

Erfolgskriterien:

- lokale Umgebung ist reproduzierbar startbar
- Journal, Diary und Notes sind belastbar persistent
- Test- und Release-Gates sind initial definiert

### Sprint 2: Persistenz und MVP-Fluesse

Ziel:

- Goals, Notifications und Frontend-Kernfluesse stabilisieren

Commitment:

- AION-204
- AION-402
- AION-403
- AION-405
- AION-406
- AION-702 teilweise fuer Capture und Notifications
- AION-703 initial

Erfolgskriterien:

- Kernnutzung funktioniert ohne Demo-Fallbacks
- Notifications und Goals sind fachlich konsistent

### Sprint 3: Trust-Funktionen produktionsnah machen

Ziel:

- Privacy und Security von sichtbaren Stubs zu echten Prozessen bewegen

Commitment:

- AION-301
- AION-302
- AION-303
- AION-304
- AION-404
- AION-706

Erfolgskriterien:

- Export, Loeschung und erste Incident-Heuristiken sind produktnah umsetzbar

### Sprint 4: AI- und Worker-Beta vorbereiten

Ziel:

- externe AI und Hintergrundjobs technisch vorbereiten

Commitment:

- AION-501
- AION-502
- AION-503
- AION-601
- AION-604
- AION-605

Erfolgskriterien:

- AI-Core und Worker haben eine tragfaehige Beta-Architektur

## Reihenfolge und Abhaengigkeiten

Empfohlene Hauptreihenfolge:

1. EP-01 vor allem anderen abschliessen.
2. EP-02 parallel zu EP-04 starten.
3. EP-03 erst auf bereits stabilisierter Persistenz aufsetzen.
4. EP-05 und EP-06 gemeinsam fuer Release 2 vorbereiten.
5. EP-08 strikt nach dem MVP behandeln.

Blocker:

- ohne stabile ENV- und Datenbankbasis bleiben Persistenz- und Worker-Tickets riskant
- ohne persistentes Memory ist Retrieval nur eingeschraenkt sinnvoll
- ohne Audit-Kopplung sind Privacy- und Governance-Prozesse unvollstaendig

## Empfohlene Prioritaet fuer sofortige Umsetzung

Unmittelbar anfangen mit:

1. AION-101 bis AION-104
2. AION-201 bis AION-204
3. AION-402 und AION-406
4. AION-701 bis AION-704

Bewusst spaeter:

1. AION-801 bis AION-804
2. Browser, Voice und Media ohne klaren MVP-Nutzen
3. tiefe AI-Provider-Integration vor Abschluss der Persistenzbasis
