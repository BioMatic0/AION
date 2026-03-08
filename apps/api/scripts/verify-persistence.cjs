"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { setTimeout: sleep } = require("node:timers/promises");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const port = Number(process.env.AION_VERIFY_PORT ?? 4010);
const baseUrl = `http://127.0.0.1:${port}`;
const localUserId = "local-user";
const uniqueScope = `persistence.check.${Date.now()}`;
const verificationEmail = `persistence-${Date.now()}@example.com`;
const verificationPassword = "Aion!23456789";

let sessionCookie = "";
let currentUserId = null;

const runtimePath = path.resolve(__dirname, "../dist/apps/api/src/main.js");
const workingDirectory = path.resolve(__dirname, "..");
const runtimeEnv = {
  ...process.env,
  PORT: String(port),
  DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/aion",
  DIRECT_URL: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/aion",
  REDIS_URL: process.env.REDIS_URL ?? "redis://localhost:6379"
};

function createRuntime() {
  const child = spawn(process.execPath, [runtimePath], {
    cwd: workingDirectory,
    env: runtimeEnv,
    stdio: ["ignore", "pipe", "pipe"]
  });

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  return {
    child,
    getStdout: () => stdout,
    getStderr: () => stderr
  };
}

async function waitForHealth(runtime) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (runtime.child.exitCode !== null) {
      throw new Error(
        `API exited before becoming healthy.\nSTDOUT:\n${runtime.getStdout()}\nSTDERR:\n${runtime.getStderr()}`
      );
    }

    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) {
        return response.json();
      }
    } catch {
      // Retry until the child is ready.
    }

    await sleep(500);
  }

  throw new Error(`API did not become healthy in time.\nSTDOUT:\n${runtime.getStdout()}\nSTDERR:\n${runtime.getStderr()}`);
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function captureSessionCookie(response) {
  const rawCookie =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()[0]
      : response.headers.get("set-cookie");

  if (!rawCookie) {
    return;
  }

  sessionCookie = rawCookie.split(";")[0] ?? sessionCookie;
}

async function request(method, resourcePath, body) {
  const headers = {
    "content-type": "application/json"
  };

  if (sessionCookie) {
    headers.cookie = sessionCookie;
  }

  const response = await fetch(`${baseUrl}${resourcePath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  captureSessionCookie(response);

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw new Error(`${method} ${resourcePath} failed with ${response.status}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function getCounts() {
  const [
    auditLogs,
    exportRequests,
    integrityChecks,
    incidents,
    notifications,
    analyses,
    growthStates,
    growthInterventions,
    journalEntries,
    diaryEntries,
    notes,
    goals,
    goalMilestones,
    achievements,
    notificationHistory,
    notificationJobs,
    manualMemoryItems,
    derivedMemoryItems
  ] = await Promise.all([
    prisma.auditLog.count(),
    prisma.dataExportRequest.count(),
    prisma.integrityCheck.count(),
    prisma.securityIncident.count(),
    prisma.incidentNotification.count(),
    prisma.analysis.count(),
    prisma.growthState.count(),
    prisma.growthIntervention.count(),
    prisma.journalEntry.count(),
    prisma.diaryEntry.count(),
    prisma.note.count(),
    prisma.goal.count(),
    prisma.goalMilestone.count(),
    prisma.achievement.count(),
    prisma.notificationHistory.count(),
    prisma.notificationJob.count(),
    prisma.memoryItemRecord.count({ where: { isDerived: false } }),
    prisma.memoryItemRecord.count({ where: { isDerived: true } })
  ]);

  return {
    auditLogs,
    exportRequests,
    integrityChecks,
    incidents,
    notifications,
    analyses,
    growthStates,
    growthInterventions,
    journalEntries,
    diaryEntries,
    notes,
    goals,
    goalMilestones,
    achievements,
    notificationHistory,
    notificationJobs,
    manualMemoryItems,
    derivedMemoryItems
  };
}

async function stopRuntime(runtime) {
  if (!runtime || runtime.child.exitCode !== null) {
    return;
  }

  runtime.child.kill();
  const exited = await Promise.race([
    new Promise((resolve) => runtime.child.once("exit", () => resolve(true))),
    sleep(2_000).then(() => false)
  ]);

  if (exited || runtime.child.exitCode !== null) {
    return;
  }

  if (runtime.child.pid) {
    await new Promise((resolve, reject) => {
      const killer = spawn("taskkill", ["/PID", String(runtime.child.pid), "/T", "/F"], {
        stdio: ["ignore", "ignore", "pipe"]
      });

      let stderr = "";
      killer.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      killer.once("exit", (code) => {
        if (code === 0 || /not found|nicht gefunden/i.test(stderr)) {
          resolve();
          return;
        }

        reject(new Error(`taskkill failed for PID ${runtime.child.pid}: ${stderr}`));
      });
    });
  }
}

async function main() {
  const runtime = createRuntime();

  try {
    await waitForHealth(runtime);

    const registration = await request("POST", "/auth/register", {
      displayName: "Persistence Verifier",
      email: verificationEmail,
      password: verificationPassword
    });
    currentUserId = registration.user.id;

    const before = await getCounts();

    await request("POST", "/privacy/export", { format: "json" });
    await request("POST", "/governance/integrity/sweep");
    await request("POST", "/security/simulate/suspicious-login");
    const analysisReport = await request("POST", "/analysis/run", {
      title: "Persistence verification",
      content: "The next delivery step is to prove that generated analysis reports persist beyond process memory.",
      context: ["verification", "prisma"]
    });
    const quantumReport = await request("POST", "/analysis/quantum-lens", {
      title: "Quantum persistence verification",
      content: "A symbolic quantum lens can describe state-space without making false physical claims.",
      context: ["quantum", "symbolic"]
    });
    const mirrorReport = await request("POST", "/mirror/run", {
      title: "Mirror persistence verification",
      content: "The strongest risk now would be assuming persistence works before it is observed in the database.",
      context: ["verification", "discipline"]
    });
    const growthEvaluation = await request("POST", "/growth/evaluate", {
      reflection: "Execution now needs to hold quality while the product becomes less volatile.",
      completionRate: 52
    });
    const journalEntry = await request("POST", "/journal", {
      title: "Journal persistence verification",
      content: "The repository now needs proof that capture records survive process restarts.",
      entryType: "journal",
      mood: "steady",
      intensity: 7
    });
    const diaryEntry = await request("POST", "/diary", {
      title: "Diary persistence verification",
      content: "Today the implementation moved from ephemeral state toward reliable storage.",
      mood: "focused",
      entryDate: new Date().toISOString(),
      autoGenerated: false,
      sourceContext: "verify-persistence"
    });
    const note = await request("POST", "/notes", {
      title: "Persistence note",
      content: "Journal, diary and goals should now persist as first-class product memory.",
      category: "verification",
      tags: ["prisma", "persistence"],
      isPinned: true,
      sourceType: "manual"
    });
    const goal = await request("POST", "/goals", {
      title: "Verify CRUD persistence",
      description: "Persist a goal end-to-end through goal creation, milestone creation and completion.",
      goalType: "project",
      lifeArea: "development",
      priority: "high",
      status: "active",
      progressPercent: 15,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString()
    });
    const milestone = await request("POST", `/goals/${goal.id}/milestones`, {
      title: "Persist milestone update",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString()
    });
    const completedGoal = await request("PATCH", `/goals/${goal.id}`, {
      status: "achieved",
      progressPercent: 100
    });
    const notificationPreferences = await request("PUT", "/notifications/preferences", {
      tone: "reflective",
      frequency: "weekly",
      preferredTime: "09:45",
      preferredWeekday: "friday",
      developmentEnabled: true,
      goalRemindersEnabled: true
    });
    const notificationPreview = await request("POST", "/notifications/preview");
    const memoryItem = await request("POST", "/memory", {
      sourceType: "manual",
      title: "Manual memory persistence",
      content: "Manual memory items should persist alongside derived retrieval items."
    });
    const memorySync = await request("POST", "/memory/sync");
    await request("POST", "/consents", {
      scope: uniqueScope,
      status: "granted",
      description: "Smoke verification for Prisma-backed persistence.",
      required: false
    });

    await sleep(750);

    const after = await getCounts();
    const storedConsent = await prisma.consentRecord.findUnique({
      where: {
        userId_scope: {
          userId: localUserId,
          scope: uniqueScope
        }
      }
    });
    const currentUserDerivedMemoryItems = await prisma.memoryItemRecord.count({
      where: {
        userId: currentUserId,
        isDerived: true
      }
    });

    assert.equal(after.exportRequests, before.exportRequests + 1, "Export requests were not persisted.");
    assert.equal(after.integrityChecks, before.integrityChecks + 1, "Integrity checks were not persisted.");
    assert.equal(after.incidents, before.incidents + 1, "Security incidents were not persisted.");
    assert.equal(after.notifications, before.notifications + 1, "Incident notifications were not persisted.");
    assert.equal(after.analyses, before.analyses + 3, "Analysis, quantum and mirror reports were not persisted.");
    assert.equal(after.growthStates, before.growthStates + 1, "Growth states were not persisted.");
    assert.equal(after.growthInterventions, before.growthInterventions + 1, "Growth interventions were not persisted.");
    assert.equal(after.journalEntries, before.journalEntries + 1, "Journal entries were not persisted.");
    assert.equal(after.diaryEntries, before.diaryEntries + 1, "Diary entries were not persisted.");
    assert.equal(after.notes, before.notes + 1, "Notes were not persisted.");
    assert.equal(after.goals, before.goals + 1, "Goals were not persisted.");
    assert.equal(after.goalMilestones, before.goalMilestones + 1, "Goal milestones were not persisted.");
    assert.equal(after.achievements, before.achievements + 1, "Achievements were not persisted.");
    assert.equal(after.notificationHistory, before.notificationHistory + 1, "Notification previews were not persisted.");
    assert.ok(after.notificationJobs >= 1, "Notification jobs are missing.");
    assert.equal(after.manualMemoryItems, before.manualMemoryItems + 1, "Manual memory items were not persisted.");
    assert.equal(
      after.derivedMemoryItems,
      after.journalEntries + after.diaryEntries + after.notes + after.goals,
      "Derived memory sync items do not match the current source records."
    );
    assert.ok(after.auditLogs >= before.auditLogs + 12, "Audit log entries were not persisted as expected.");
    assert.ok(storedConsent, "Consent record was not persisted.");
    assert.equal(storedConsent.status, "granted", "Persisted consent has the wrong status.");

    const [
      storedAnalysis,
      storedQuantum,
      storedMirror,
      storedGrowthState,
      storedGrowthIntervention,
      storedJournalEntry,
      storedDiaryEntry,
      storedNote,
      storedGoal,
      storedMilestone,
      storedAchievement,
      storedNotificationPreference,
      storedNotificationPreview,
      storedManualMemoryItem,
      storedDerivedGoalMemoryItem
    ] = await Promise.all([
      prisma.analysis.findUnique({ where: { id: analysisReport.id } }),
      prisma.analysis.findUnique({ where: { id: quantumReport.id } }),
      prisma.analysis.findUnique({ where: { id: mirrorReport.id } }),
      prisma.growthState.findUnique({ where: { id: growthEvaluation.state.id } }),
      prisma.growthIntervention.findUnique({ where: { id: growthEvaluation.intervention.id } }),
      prisma.journalEntry.findUnique({ where: { id: journalEntry.id } }),
      prisma.diaryEntry.findUnique({ where: { id: diaryEntry.id } }),
      prisma.note.findUnique({ where: { id: note.id } }),
      prisma.goal.findUnique({ where: { id: goal.id } }),
      prisma.goalMilestone.findUnique({ where: { id: milestone.id } }),
      prisma.achievement.findFirst({ where: { goalId: goal.id } }),
      prisma.notificationPreference.findUnique({ where: { userId: currentUserId } }),
      prisma.notificationHistory.findUnique({ where: { id: notificationPreview.id } }),
      prisma.memoryItemRecord.findUnique({ where: { id: memoryItem.id } }),
      prisma.memoryItemRecord.findUnique({ where: { id: `goal:${goal.id}` } })
    ]);

    assert.equal(storedAnalysis?.reportType, "analysis", "Stored analysis report type is incorrect.");
    assert.equal(storedQuantum?.reportType, "quantum", "Stored quantum report type is incorrect.");
    assert.equal(storedMirror?.reportType, "mirror", "Stored mirror report type is incorrect.");
    assert.equal(storedGrowthState?.focusArea, growthEvaluation.state.focusArea, "Stored growth state does not match the response.");
    assert.equal(
      storedGrowthIntervention?.stateId,
      growthEvaluation.state.id,
      "Stored growth intervention is not linked to the generated state."
    );
    assert.equal(storedJournalEntry?.title, journalEntry.title, "Stored journal entry is incorrect.");
    assert.equal(storedDiaryEntry?.title, diaryEntry.title, "Stored diary entry is incorrect.");
    assert.equal(storedNote?.title, note.title, "Stored note is incorrect.");
    assert.equal(storedGoal?.status, completedGoal.status, "Stored goal status is incorrect.");
    assert.equal(storedMilestone?.goalId, goal.id, "Stored goal milestone is not linked to the goal.");
    assert.equal(storedAchievement?.goalId, goal.id, "Stored achievement is not linked to the goal.");
    assert.equal(storedNotificationPreference?.tone, notificationPreferences.tone, "Stored notification preferences are incorrect.");
    assert.equal(storedNotificationPreview?.id, notificationPreview.id, "Stored notification preview is incorrect.");
    assert.equal(storedManualMemoryItem?.title, memoryItem.title, "Stored manual memory item is incorrect.");
    assert.equal(storedDerivedGoalMemoryItem?.sourceType, "goal", "Stored derived goal memory item is incorrect.");
    assert.equal(
      memorySync.total,
      currentUserDerivedMemoryItems,
      "Memory sync total does not match the current user's persisted derived items."
    );

    console.log(
      JSON.stringify(
        {
          ok: true,
          baseUrl,
          before,
          after,
          storedConsentScope: storedConsent.scope,
          analysisReportId: analysisReport.id,
          quantumReportId: quantumReport.id,
          mirrorReportId: mirrorReport.id,
          growthStateId: growthEvaluation.state.id,
          growthInterventionId: growthEvaluation.intervention.id,
          journalEntryId: journalEntry.id,
          diaryEntryId: diaryEntry.id,
          noteId: note.id,
          goalId: goal.id,
          milestoneId: milestone.id,
          notificationPreviewId: notificationPreview.id,
          memoryItemId: memoryItem.id
        },
        null,
        2
      )
    );
  } finally {
    await stopRuntime(runtime);
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
