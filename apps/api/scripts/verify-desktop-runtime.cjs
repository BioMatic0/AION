const { mkdtempSync, rmSync, existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");
const { spawn } = require("node:child_process");

const runtimeDir = mkdtempSync(join(tmpdir(), "aion-desktop-runtime-"));
const port = 4110;
const apiEntry = join(process.cwd(), "dist", "apps", "api", "src", "desktop-main.js");
const stateFile = join(runtimeDir, "desktop-state.json");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth() {
  for (let index = 0; index < 30; index += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // retry
    }

    await wait(500);
  }

  throw new Error("Desktop-Runtime-API wurde nicht rechtzeitig erreichbar.");
}

async function requestJson(url, options) {
  const response = await fetch(url, {
    headers: {
      "content-type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request fehlgeschlagen: ${response.status} ${response.statusText} fuer ${url}`);
  }

  return response.json();
}

function startDesktopRuntime() {
  const child = spawn(process.execPath, [apiEntry], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(port),
      AION_DESKTOP_RUNTIME: "1",
      AION_DESKTOP_DATA_DIR: runtimeDir
    },
    stdio: "inherit"
  });

  return child;
}

async function stopDesktopRuntime(child) {
  child.kill();
  await wait(1200);
}

async function run() {
  let child = startDesktopRuntime();
  try {
    await waitForHealth();

    const journalEntry = await requestJson(`http://127.0.0.1:${port}/journal`, {
      method: "POST",
      body: JSON.stringify({
        title: "Desktop Persistenz",
        content: "Dieser Eintrag muss den Neustart ueberleben.",
        entryType: "journal",
        mood: "focused",
        intensity: 8
      })
    });

    const note = await requestJson(`http://127.0.0.1:${port}/notes`, {
      method: "POST",
      body: JSON.stringify({
        title: "Externe Verteilung",
        content: "Windows-Build mit lokaler Persistenz ist bereit.",
        category: "arbeit",
        tags: ["release", "desktop"],
        isPinned: true
      })
    });

    const preferences = await requestJson(`http://127.0.0.1:${port}/notifications/preferences`, {
      method: "PUT",
      body: JSON.stringify({
        frequency: "weekly",
        preferredTime: "09:15",
        tone: "reflective"
      })
    });

    const exportRequest = await requestJson(`http://127.0.0.1:${port}/privacy/export`, {
      method: "POST",
      body: JSON.stringify({
        format: "json"
      })
    });

    const consent = await requestJson(`http://127.0.0.1:${port}/consents`, {
      method: "POST",
      body: JSON.stringify({
        scope: "desktop.free_distribution",
        status: "granted",
        description: "Freie Nutzung der ausgelieferten Desktop-App wurde bestaetigt."
      })
    });

    const sweep = await requestJson(`http://127.0.0.1:${port}/governance/integrity/sweep`, {
      method: "POST",
      body: JSON.stringify({})
    });

    await stopDesktopRuntime(child);

    child = startDesktopRuntime();
    await waitForHealth();

    const journalEntries = await requestJson(`http://127.0.0.1:${port}/journal`, { method: "GET" });
    const notes = await requestJson(`http://127.0.0.1:${port}/notes`, { method: "GET" });
    const notificationPreferences = await requestJson(`http://127.0.0.1:${port}/notifications/preferences`, {
      method: "GET"
    });
    const privacyOverview = await requestJson(`http://127.0.0.1:${port}/privacy/overview`, { method: "GET" });
    const consents = await requestJson(`http://127.0.0.1:${port}/consents`, { method: "GET" });
    const governanceOverview = await requestJson(`http://127.0.0.1:${port}/governance/overview`, { method: "GET" });

    if (!journalEntries.some((entry) => entry.id === journalEntry.id)) {
      throw new Error("Journal-Persistenz fehlt nach Neustart.");
    }

    if (!notes.some((entry) => entry.id === note.id)) {
      throw new Error("Notiz-Persistenz fehlt nach Neustart.");
    }

    if (notificationPreferences.frequency !== preferences.frequency || notificationPreferences.tone !== preferences.tone) {
      throw new Error("Benachrichtigungs-Persistenz fehlt nach Neustart.");
    }

    if (!privacyOverview.exportRequests.some((entry) => entry.id === exportRequest.id)) {
      throw new Error("Privacy-Exportanforderung fehlt nach Neustart.");
    }

    if (!consents.some((entry) => entry.id === consent.id)) {
      throw new Error("Consent-Persistenz fehlt nach Neustart.");
    }

    if (!governanceOverview.integrityChecks.some((entry) => entry.id === sweep.id)) {
      throw new Error("Governance-Integritaetslauf fehlt nach Neustart.");
    }

    if (!existsSync(stateFile)) {
      throw new Error("Desktop-State-Datei wurde nicht erzeugt.");
    }

    const state = JSON.parse(readFileSync(stateFile, "utf8"));
    if (!state?.sections?.["journal.entries"] || !state?.sections?.["notes.items"]) {
      throw new Error("Desktop-State-Datei enthaelt nicht die erwarteten Kernsektionen.");
    }

    console.log("VERIFY_DESKTOP_RUNTIME_OK");
    console.log(JSON.stringify({
      runtimeDir,
      stateFile,
      journalEntryId: journalEntry.id,
      noteId: note.id,
      exportRequestId: exportRequest.id,
      consentId: consent.id,
      integritySweepId: sweep.id
    }, null, 2));
  } finally {
    await stopDesktopRuntime(child);
    rmSync(runtimeDir, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
