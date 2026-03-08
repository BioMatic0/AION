import type { NavigationItem } from "@aion/shared-types";

export interface SectionDefinition extends NavigationItem {
  status: string;
  nextStep: string;
  pillars: string[];
}

export const sections: SectionDefinition[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Zentrale Lageansicht fuer Impulse, Sitzungen und naechste Schritte.",
    status: "Live im aktuellen MVP-Stand",
    nextStep: "Live-Daten aus weiteren Modulen und spaeter aus Prisma aggregieren.",
    pillars: ["Tagesfokus", "Systemstatus", "Sicherheitslage"]
  },
  {
    href: "/journal",
    label: "Journal",
    description: "Freie Eintraege, Reflexionen und Kontext fuer spaetere Analyse.",
    status: "CRUD-Flaeche API-first aktiv",
    nextStep: "Tags, Suchfilter und spaetere Analyse-Verknuepfung vertiefen.",
    pillars: ["Eintraege", "Tags", "Verknuepfung"]
  },
  {
    href: "/diary",
    label: "Tagebuch",
    description: "Gefuehrte Tagesreflexion mit automatischen Impulsen.",
    status: "Prompts und Tagessummary vorbereitet",
    nextStep: "Kalenderlogik und automatische Rueckblicke mit Verlauf koppeln.",
    pillars: ["Tagesbild", "Prompts", "Rueckblicke"]
  },
  {
    href: "/notes",
    label: "Notizen",
    description: "Schnelle Notizen, lose Gedanken und vorbereitete Umwandlung in Ziele.",
    status: "Erfassung, Kategorien und Tags aktiv",
    nextStep: "Anheft- und Aktionslogik um Umwandlung in Ziele oder Journal ergaenzen.",
    pillars: ["Kurznotizen", "Kategorien", "Suche"]
  },
  {
    href: "/goals",
    label: "Ziele",
    description: "Ziele, Meilensteine, Fortschritt und Erinnerungen.",
    status: "MVP-Kernbereich mit Statusmodell aktiv",
    nextStep: "Meilenstein-Editor, Erfolgsliste und Erinnerungsjobs vertiefen.",
    pillars: ["Offen", "Aktiv", "Erreicht"]
  },
  {
    href: "/analysis",
    label: "Analyse",
    description: "Mehrschichtige Auswertung von Eintraegen und Verlauf.",
    status: "Analyseberichte und Memory-Suche aktiv",
    nextStep: "Persistente Analysehistorie und spaetere Modellanbieter andocken.",
    pillars: ["Beobachtung", "Psychodynamik", "Entwicklung"]
  },
  {
    href: "/mirror",
    label: "Spiegel",
    description: "Konfrontativer Modus fuer Gegenperspektive und Selbstpruefung.",
    status: "Spiegelberichte mit Gegenlesart aktiv",
    nextStep: "Rollenbasierte Intensitaet und spaetere Governance-Hooks vertiefen.",
    pillars: ["Projektion", "Alternative Sicht", "Naechster Schritt"]
  },
  {
    href: "/growth",
    label: "Wachstum",
    description: "Fortlaufende Entwicklung, Reifung und Interventionen ueber Zeit.",
    status: "Wachstumsstatus und Interventionen aktiv",
    nextStep: "Mehr Verlaufspunkte und Ziel-/Tagebuch-Korrelationen anbinden.",
    pillars: ["Zustand", "Momentum", "Reifekante"]
  },
  {
    href: "/quantum",
    label: "Quantenlinse",
    description: "Quanteninspirierte Denklinien ohne pseudowissenschaftliche Behauptungen.",
    status: "Quantenlinsen-Berichte aktiv",
    nextStep: "Verknuepfung mit Analyse- und Speicherkontext weiterziehen.",
    pillars: ["Zustandsraum", "Kohaerenz", "Moeglichkeitsraum"]
  },
  {
    href: "/browser",
    label: "Recherche",
    description: "Recherche, Tiefensuche und Quellenvergleich innerhalb von AION.",
    status: "Struktur steht, Zugriff folgt spaeter",
    nextStep: "Suchadapter und Quellenkarten bauen.",
    pillars: ["Recherche", "Tiefensuche", "Quellenkarte"]
  },
  {
    href: "/media",
    label: "Medien",
    description: "Bibliothek fuer Texte, Bilder, Audio und generierte Inhalte.",
    status: "Asset-Register vorbereitet",
    nextStep: "Upload- und Vorschaupfad absichern.",
    pillars: ["Assets", "Suche", "Versionierung"]
  },
  {
    href: "/developer",
    label: "Entwicklung",
    description: "Projektverwaltung, Codehilfe und spaetere Sandbox-Ausfuehrung.",
    status: "Arbeitsbereich vorgesehen",
    nextStep: "Projekt- und Dateimodelle anlegen.",
    pillars: ["Projekte", "Dateien", "Refactoring"]
  },
  {
    href: "/voice",
    label: "Sprache",
    description: "Direkter Sprachdialog mit Session-Gedaechtnis.",
    status: "Provider-Schnittstellen folgen",
    nextStep: "STT/TTS-Provider und Session-Timeline integrieren.",
    pillars: ["STT", "TTS", "Sprachsitzungen"]
  },
  {
    href: "/notifications",
    label: "Benachrichtigungen",
    description: "Entwicklungsimpulse, Zielerinnerungen und Vorfallhinweise.",
    status: "Opt-in-Einstellungen und Verlauf aktiv",
    nextStep: "Echte Worker-Jobs und Mailzustellung anschliessen.",
    pillars: ["Impulse", "Erinnerungen", "Sicherheitswarnungen"]
  },
  {
    href: "/feedback",
    label: "Rueckmeldung",
    description: "Wuensche, Verbesserungen, Bugs und Sicherheitsmeldungen.",
    status: "Produktpflege vorbereitet",
    nextStep: "Rueckmeldeformular und Backlog-Anbindung bauen.",
    pillars: ["Funktion", "Fehler", "Sicherheit"]
  },
  {
    href: "/changelog",
    label: "Aenderungen",
    description: "Transparente Aenderungshistorie fuer Nutzer und Owner.",
    status: "Lesetracking folgt",
    nextStep: "Versionierte Changelog-Eintraege speichern.",
    pillars: ["Releases", "Verbesserungen", "Sicherheitsupdates"]
  },
  {
    href: "/avatar",
    label: "Avatar",
    description: "Persoenlicher Avatar mit geschuetzter Bildverarbeitung.",
    status: "Profilbereich vorbereitet",
    nextStep: "Upload und Stilprofile anbinden.",
    pillars: ["Upload", "Generator", "Einwilligung"]
  },
  {
    href: "/security",
    label: "Sicherheit",
    description: "Sitzungen, Risiken, Geraete und Incident Center.",
    status: "Sichtbarer Sicherheitsstatus aktiv",
    nextStep: "Vorfall-Detailansichten und Nutzerwarnungen erweitern.",
    pillars: ["Sitzungen", "Ereignisse", "Vorfaelle"]
  },
  {
    href: "/governance",
    label: "Governance",
    description: "Charta, Policies, Integritaetschecks und gebundene Systemregeln.",
    status: "Governance-Center mit Richtlinien-Transparenz aktiv",
    nextStep: "Richtlinien-Versionierung und Admin-Pruefung weiter vertiefen.",
    pillars: ["Charta", "Richtlinien", "Integritaet"]
  },
  {
    href: "/privacy",
    label: "Datenschutz",
    description: "Datenschutzprotokoll, Speicherregeln und Nutzerkontrolle.",
    status: "Datenschutzoberflaeche sichtbar",
    nextStep: "Export- und Loeschpfade implementieren.",
    pillars: ["Datenkategorien", "Retention", "Einwilligungen"]
  },
  {
    href: "/rechtliches",
    label: "Rechtliches",
    description: "Eigentum, Lizenzstatus und kostenlose Nutzungsfreigabe der Builds.",
    status: "Eigentums- und Lizenzhinweise sichtbar",
    nextStep: "Bei Bedarf vertragliche Beitraege und externe Lizenzpruefung ergaenzen.",
    pillars: ["Eigentum", "Lizenz", "Build-Freigabe"]
  },
  {
    href: "/settings",
    label: "Einstellungen",
    description: "Profile, Agenten, Modi, Sicherheit und Erinnerungseinstellungen.",
    status: "Benachrichtigungssteuerung eingebunden",
    nextStep: "Agentenprofile und weitere Praeferenzen anbinden.",
    pillars: ["Profil", "Agent", "Praeferenzen"]
  }
];

export const sectionMap = Object.fromEntries(sections.map((section) => [section.href.slice(1), section]));
