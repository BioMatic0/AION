import type { NavigationItem } from "@aion/shared-types";

export type SectionGroup = "Arbeitsbasis" | "Reflexion und KI" | "Governance und Betrieb";

export interface SectionDefinition extends NavigationItem {
  group: SectionGroup;
  status: string;
  nextStep: string;
  pillars: string[];
  related: string[];
}

export const groupMeta: Record<SectionGroup, { title: string; description: string }> = {
  "Arbeitsbasis": {
    title: "Arbeitsbasis",
    description: "Erfassung, Struktur und alltaegliche Produktivitaet."
  },
  "Reflexion und KI": {
    title: "Reflexion und KI",
    description: "Analyse, Spiegelung und Entwicklung mit klarer Einordnung."
  },
  "Governance und Betrieb": {
    title: "Governance und Betrieb",
    description: "Sicherheit, Datenschutz, Rechtliches und Systemsteuerung."
  }
};

export const sections: SectionDefinition[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Zentrale Lageansicht fuer Impulse, Sitzungen und naechste Schritte.",
    group: "Arbeitsbasis",
    status: "Live im aktuellen MVP-Stand",
    nextStep: "Live-Daten aus weiteren Modulen und spaeter aus Prisma aggregieren.",
    pillars: ["Tagesfokus", "Systemstatus", "Sicherheitslage"],
    related: ["/journal", "/goals", "/governance"]
  },
  {
    href: "/journal",
    label: "Journal",
    description: "Freie Eintraege, Reflexionen und Kontext fuer spaetere Analysen.",
    group: "Arbeitsbasis",
    status: "CRUD-Flaeche API-first aktiv",
    nextStep: "Tags, Suchfilter und spaetere Analyse-Verknuepfung vertiefen.",
    pillars: ["Eintraege", "Tags", "Verknuepfung"],
    related: ["/diary", "/notes", "/analysis"]
  },
  {
    href: "/diary",
    label: "Tagebuch",
    description: "Gefuehrte Tagesreflexion mit automatischen Impulsen.",
    group: "Arbeitsbasis",
    status: "Impulse und Tageszusammenfassung vorbereitet",
    nextStep: "Kalenderlogik und automatische Rueckblicke mit dem Verlauf koppeln.",
    pillars: ["Tagesbild", "Impulse", "Rueckblicke"],
    related: ["/journal", "/growth", "/goals"]
  },
  {
    href: "/notes",
    label: "Notizen",
    description: "Schnelle Notizen, lose Gedanken und vorbereitete Umwandlung in Ziele.",
    group: "Arbeitsbasis",
    status: "Erfassung, Kategorien und Tags aktiv",
    nextStep: "Anheft- und Aktionslogik sowie die Umwandlung in Ziele oder Journal-Eintraege ergaenzen.",
    pillars: ["Kurznotizen", "Kategorien", "Suche"],
    related: ["/journal", "/goals", "/analysis"]
  },
  {
    href: "/goals",
    label: "Ziele",
    description: "Ziele, Meilensteine, Fortschritt und Erinnerungen.",
    group: "Arbeitsbasis",
    status: "MVP-Kernbereich mit Statusmodell aktiv",
    nextStep: "Meilenstein-Editor, Erfolgsliste und Erinnerungsjobs vertiefen.",
    pillars: ["Offen", "Aktiv", "Erreicht"],
    related: ["/diary", "/growth", "/notifications"]
  },
  {
    href: "/analysis",
    label: "Analyse",
    description: "Mehrschichtige Auswertung von Eintraegen und Verlauf.",
    group: "Reflexion und KI",
    status: "Analyseberichte und Speichersuche aktiv",
    nextStep: "Eine persistente Analysehistorie einfuehren und spaetere Modellanbieter andocken.",
    pillars: ["Beobachtung", "Psychodynamik", "Entwicklung"],
    related: ["/journal", "/mirror", "/quantum"]
  },
  {
    href: "/mirror",
    label: "Spiegel",
    description: "Konfrontativer Modus fuer Gegenperspektive und Selbstpruefung.",
    group: "Reflexion und KI",
    status: "Spiegelberichte mit Gegenlesart aktiv",
    nextStep: "Rollenbasierte Intensitaet und spaetere Governance-Anbindungen vertiefen.",
    pillars: ["Projektion", "Alternative Sicht", "Naechster Schritt"],
    related: ["/analysis", "/growth", "/governance"]
  },
  {
    href: "/growth",
    label: "Wachstum",
    description: "Fortlaufende Entwicklung, Reifung und Interventionen ueber Zeit.",
    group: "Reflexion und KI",
    status: "Wachstumsstatus und Interventionen aktiv",
    nextStep: "Mehr Verlaufspunkte und Ziel-/Tagebuch-Korrelationen anbinden.",
    pillars: ["Zustand", "Momentum", "Reifekante"],
    related: ["/goals", "/analysis", "/diary"]
  },
  {
    href: "/quantum",
    label: "Quantenlinse",
    description: "Quanteninspirierte Denklinien ohne pseudowissenschaftliche Behauptungen.",
    group: "Reflexion und KI",
    status: "Quantenlinsen-Berichte aktiv",
    nextStep: "Verknuepfung mit Analyse- und Speicherkontext weiterziehen.",
    pillars: ["Zustandsraum", "Kohaerenz", "Moeglichkeitsraum"],
    related: ["/analysis", "/mirror", "/growth"]
  },
  {
    href: "/browser",
    label: "Recherche",
    description: "Recherche, Tiefensuche und Quellenvergleich innerhalb von AION.",
    group: "Reflexion und KI",
    status: "Struktur steht, Zugriff folgt spaeter",
    nextStep: "Suchadapter und Quellenkarten bauen.",
    pillars: ["Recherche", "Tiefensuche", "Quellenkarte"],
    related: ["/analysis", "/quantum", "/media"]
  },
  {
    href: "/media",
    label: "Medien",
    description: "Bibliothek fuer Texte, Bilder, Audio und generierte Inhalte.",
    group: "Reflexion und KI",
    status: "Asset-Register vorbereitet",
    nextStep: "Upload- und Vorschaupfad absichern.",
    pillars: ["Assets", "Suche", "Versionierung"],
    related: ["/browser", "/voice", "/avatar"]
  },
  {
    href: "/developer",
    label: "Entwicklung",
    description: "Projektverwaltung, Codehilfe und spaetere Sandbox-Ausfuehrung.",
    group: "Governance und Betrieb",
    status: "Arbeitsbereich vorgesehen",
    nextStep: "Projekt- und Dateimodelle anlegen.",
    pillars: ["Projekte", "Dateien", "Refactoring"],
    related: ["/governance", "/security", "/browser"]
  },
  {
    href: "/voice",
    label: "Sprache",
    description: "Direkter Sprachdialog mit Sitzungs-Gedaechtnis.",
    group: "Reflexion und KI",
    status: "Provider-Schnittstellen folgen",
    nextStep: "STT/TTS-Provider und Session-Timeline integrieren.",
    pillars: ["STT", "TTS", "Sprachsitzungen"],
    related: ["/diary", "/media", "/notifications"]
  },
  {
    href: "/notifications",
    label: "Benachrichtigungen",
    description: "Entwicklungsimpulse, Zielerinnerungen und Vorfallhinweise.",
    group: "Governance und Betrieb",
    status: "Opt-in-Einstellungen und Verlauf aktiv",
    nextStep: "Echte Hintergrundjobs und die Mailzustellung anbinden.",
    pillars: ["Impulse", "Erinnerungen", "Sicherheitswarnungen"],
    related: ["/goals", "/growth", "/security"]
  },
  {
    href: "/feedback",
    label: "Rueckmeldung",
    description: "Wuensche, Verbesserungen, Bugs und Sicherheitsmeldungen.",
    group: "Governance und Betrieb",
    status: "Produktpflege vorbereitet",
    nextStep: "Ein Rueckmeldeformular und die Backlog-Anbindung umsetzen.",
    pillars: ["Funktion", "Fehler", "Sicherheit"],
    related: ["/changelog", "/governance", "/security"]
  },
  {
    href: "/changelog",
    label: "Aenderungen",
    description: "Transparente Aenderungshistorie fuer Nutzer und Projektverantwortliche.",
    group: "Governance und Betrieb",
    status: "Lesetracking folgt",
    nextStep: "Versionierte Changelog-Eintraege speichern und lesbar aufbereiten.",
    pillars: ["Releases", "Verbesserungen", "Sicherheitsupdates"],
    related: ["/feedback", "/governance", "/rechtliches"]
  },
  {
    href: "/avatar",
    label: "Avatar",
    description: "Persoenlicher Avatar mit geschuetzter Bildverarbeitung.",
    group: "Governance und Betrieb",
    status: "Profilbereich vorbereitet",
    nextStep: "Upload und Stilprofile anbinden.",
    pillars: ["Upload", "Generator", "Einwilligung"],
    related: ["/settings", "/media", "/impressum"]
  },
  {
    href: "/security",
    label: "Sicherheit",
    description: "Sitzungen, Risiken, Geraete und Vorfallzentrum.",
    group: "Governance und Betrieb",
    status: "Sichtbarer Sicherheitsstatus aktiv",
    nextStep: "Detailansichten fuer Vorfaelle und Nutzerwarnungen erweitern.",
    pillars: ["Sitzungen", "Ereignisse", "Vorfaelle"],
    related: ["/privacy", "/governance", "/notifications"]
  },
  {
    href: "/governance",
    label: "Governance",
    description: "Charta, Policies, Integritaetschecks und gebundene Systemregeln.",
    group: "Governance und Betrieb",
    status: "Governance-Center mit Richtlinien-Transparenz aktiv",
    nextStep: "Richtlinien-Versionierung und Admin-Pruefung weiter vertiefen.",
    pillars: ["Charta", "Richtlinien", "Integritaet"],
    related: ["/privacy", "/security", "/ethik"]
  },
  {
    href: "/privacy",
    label: "Datenschutz",
    description: "Datenschutzprotokoll, Speicherregeln und Kontrolle durch den Nutzer.",
    group: "Governance und Betrieb",
    status: "Datenschutzoberflaeche sichtbar",
    nextStep: "Export- und Loeschpfade implementieren.",
    pillars: ["Datenkategorien", "Retention", "Einwilligungen"],
    related: ["/security", "/governance", "/settings"]
  },
  {
    href: "/ethik",
    label: "Ethik",
    description: "Grundpfeiler, Risiken und Schutzmassnahmen von AION.",
    group: "Governance und Betrieb",
    status: "Ethik- und Risikoanalyse sichtbar",
    nextStep: "Mit Governance-Pruefungen, Release-Pruefungen und Produktentscheidungen verknuepfen.",
    pillars: ["Wuerde", "Fairness", "Risikosteuerung"],
    related: ["/governance", "/privacy", "/rechtliches"]
  },
  {
    href: "/rechtliches",
    label: "Rechtliches",
    description: "Eigentum, Lizenzstatus und kostenlose Nutzungsfreigabe der Builds.",
    group: "Governance und Betrieb",
    status: "Eigentums- und Lizenzhinweise sichtbar",
    nextStep: "Bei Bedarf vertragliche Beitraege und eine externe Lizenzpruefung ergaenzen.",
    pillars: ["Eigentum", "Lizenz", "Build-Freigabe"],
    related: ["/ethik", "/governance", "/impressum"]
  },
  {
    href: "/settings",
    label: "Einstellungen",
    description: "Profile, Agenten, Modi, Sicherheit und Erinnerungseinstellungen.",
    group: "Governance und Betrieb",
    status: "Benachrichtigungssteuerung eingebunden",
    nextStep: "Agentenprofile und weitere Praeferenzen anbinden.",
    pillars: ["Profil", "Agent", "Praeferenzen"],
    related: ["/avatar", "/security", "/notifications"]
  }
];

export const sectionMap = Object.fromEntries(sections.map((section) => [section.href.slice(1), section]));
export const groupedSections = Object.fromEntries(
  Object.keys(groupMeta).map((group) => [group, sections.filter((section) => section.group === group)])
) as Record<SectionGroup, SectionDefinition[]>;
