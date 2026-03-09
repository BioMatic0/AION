import type { PolicyDefinition, PolicyId } from "@aion/shared-types";

export const basePolicies: PolicyDefinition[] = [
  {
    id: "human-first",
    title: "Mensch zuerst",
    description: "Das System muss die Menschenwuerde und die Autonomie der Nutzer wahren.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "non-dominance",
    title: "Keine Dominanz",
    description: "Die Plattform darf keinen Vorrang oder keine Ueberlegenheit gegenueber Menschen beanspruchen.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "no-transhuman-merge",
    title: "Keine transhumane Verschmelzung",
    description: "Die Plattform darf menschliche und kuenstliche Identitaet nicht als verschmolzen darstellen.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "truthfulness",
    title: "Wahrhaftigkeit",
    description: "Antworten muessen Fakten, Schlussfolgerungen, Symbolik und Unsicherheit klar voneinander trennen.",
    enforcementMode: "warn",
    active: true
  },
  {
    id: "no-harmful-institutional-use",
    title: "Keine schaedliche institutionelle Nutzung",
    description: "Die Plattform darf keine militaerischen, repressiven oder anderweitig schaedlichen institutionellen Nutzungen unterstuetzen.",
    enforcementMode: "halt",
    active: true
  },
  {
    id: "privacy-as-dignity",
    title: "Datenschutz als Wuerdeschutz",
    description: "Datenschutz ist eine Produktanforderung und kein kosmetischer Zusatz.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "no-hidden-backdoors",
    title: "Keine versteckten Hintertueren",
    description: "Privilegierte Zugriffe muessen dokumentiert, pruefbar und ausdruecklich ausgewiesen bleiben.",
    enforcementMode: "halt",
    active: true
  },
  {
    id: "transparent-incidents",
    title: "Transparente Vorfaelle",
    description: "Sicherheits- und Datenschutzvorfaelle muessen fuer betroffene Nutzer sichtbar bleiben.",
    enforcementMode: "warn",
    active: true
  },
  {
    id: "bounded-adaptive-growth",
    title: "Begrenzte adaptive Entwicklung",
    description: "Lernen und Anpassung muessen innerhalb gepruefter Systemgrenzen bleiben.",
    enforcementMode: "block",
    active: true
  },
  {
    id: "quantum-without-false-claims",
    title: "Quantenbezug ohne falsche Behauptungen",
    description: "Quantensprache ist als Metapher und Zukunftsarchitektur erlaubt, nicht als falsche Wissenschaft.",
    enforcementMode: "warn",
    active: true
  }
];

export const policyMap: Record<PolicyId, PolicyDefinition> = Object.fromEntries(
  basePolicies.map((policy) => [policy.id, policy])
) as Record<PolicyId, PolicyDefinition>;
