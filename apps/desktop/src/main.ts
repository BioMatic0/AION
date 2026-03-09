import { app, BrowserWindow, dialog, Menu, shell, type MenuItemConstructorOptions } from "electron";
import log from "electron-log/main";
import { autoUpdater } from "electron-updater";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const WINDOW_TITLE = "AION";
const API_PORT = 4000;
const API_HEALTH_URL = `http://127.0.0.1:${API_PORT}/health`;
const DEFAULT_WINDOW = {
  width: 1440,
  height: 960,
  minWidth: 1200,
  minHeight: 760
};
const IMPRESSUM_ROUTE = ["impressum", "index.html"];
const RECHTLICHES_ROUTE = ["rechtliches", "index.html"];

let backendProcess: ChildProcessWithoutNullStreams | null = null;
let mainWindow: BrowserWindow | null = null;
let updateDownloaded = false;
let updateTargetVersion: string | null = null;
let updateCheckInFlight = false;
let manualUpdateCheck = false;

function resolveIndexHtml() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "web", "index.html");
  }

  return path.resolve(__dirname, "../../web/out/index.html");
}

function resolveWebHtml(...segments: string[]) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "web", ...segments);
  }

  return path.resolve(__dirname, "../../web/out", ...segments);
}

function resolveApiRuntimeDir() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "api");
  }

  return path.resolve(__dirname, "../api-runtime");
}

function resolveApiEntry() {
  return path.join(resolveApiRuntimeDir(), "dist", "apps", "api", "src", "desktop-main.js");
}

function resolveRuntimeBootstrapEntry() {
  return path.join(__dirname, "runtime-bootstrap.js");
}

function resolveRuntimeLogDir() {
  const logDir = path.join(app.getPath("userData"), "runtime-logs");
  mkdirSync(logDir, { recursive: true });
  return logDir;
}

function resolveRuntimeDataDir() {
  const dataDir = path.join(app.getPath("userData"), "runtime-data");
  mkdirSync(dataDir, { recursive: true });
  return dataDir;
}

function resolveRuntimeNodePaths() {
  const candidates = [
    path.join(resolveApiRuntimeDir(), "node_modules"),
    app.isPackaged ? path.join(app.getAppPath(), "node_modules") : path.resolve(__dirname, "../node_modules"),
    app.isPackaged ? path.join(process.resourcesPath, "app.asar.unpacked", "node_modules") : null
  ].filter((candidate): candidate is string => Boolean(candidate && existsSync(candidate)));

  return Array.from(new Set(candidates));
}

function appendRuntimeLog(filename: string, chunk: Buffer) {
  appendFileSync(path.join(resolveRuntimeLogDir(), filename), chunk);
}

function isUpdateSupported() {
  return app.isPackaged && process.platform === "win32";
}

async function waitForBackendReady(timeoutMs = 15000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(API_HEALTH_URL, { cache: "no-store" });
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Die lokale AION-API wurde unter ${API_HEALTH_URL} nicht rechtzeitig erreichbar.`);
}

function startBackendSidecar() {
  if (backendProcess) {
    return backendProcess;
  }

  const apiEntry = resolveApiEntry();
  if (!existsSync(apiEntry)) {
    throw new Error(`Der gebuendelte API-Einstieg wurde nicht gefunden: ${apiEntry}`);
  }

  const bootstrapEntry = resolveRuntimeBootstrapEntry();
  if (!existsSync(bootstrapEntry)) {
    throw new Error(`Der Desktop-Runtime-Bootstrap wurde nicht gefunden: ${bootstrapEntry}`);
  }

  const runtimeDir = resolveApiRuntimeDir();
  const runtimeNodePaths = resolveRuntimeNodePaths();
  const child = spawn(process.execPath, [bootstrapEntry], {
    cwd: runtimeDir,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      NODE_ENV: app.isPackaged ? "production" : "development",
      PORT: String(API_PORT),
      AION_DESKTOP_RUNTIME: "1",
      AION_DESKTOP_DATA_DIR: resolveRuntimeDataDir(),
      AION_API_ENTRY: apiEntry,
      AION_RUNTIME_NODE_PATHS: runtimeNodePaths.join(path.delimiter),
      NODE_PATH: [...runtimeNodePaths, process.env.NODE_PATH ?? ""].filter(Boolean).join(path.delimiter)
    },
    stdio: "pipe",
    windowsHide: true
  });

  child.stdout.on("data", (chunk) => appendRuntimeLog("api.stdout.log", chunk));
  child.stderr.on("data", (chunk) => appendRuntimeLog("api.stderr.log", chunk));
  child.on("exit", (code, signal) => {
    appendRuntimeLog(
      "api.stderr.log",
      Buffer.from(`AION Desktop API beendet (code=${code ?? "null"}, signal=${signal ?? "null"})\n`)
    );
    backendProcess = null;
  });

  backendProcess = child;
  return child;
}

function stopBackendSidecar() {
  if (!backendProcess) {
    return;
  }

  backendProcess.kill();
  backendProcess = null;
}

function showAboutDialog() {
  const version = app.getVersion();
  dialog.showMessageBox({
    type: "info",
    title: "Ueber AION",
    message: `AION ${version}`,
    detail:
      "Projektreferenz: Patrick Wirth, 10.06.1993, patrickwirth_93@icloud.com.\n" +
      "Lizenzstatus: MIT License.\n" +
      "AION soll frei zugaenglich sein und gemeinschaftlich mitgestaltet werden koennen."
  });
}

function refreshMenu() {
  buildAppMenu();
}

async function checkForUpdates(isManual = false) {
  if (!isUpdateSupported()) {
    if (isManual) {
      await dialog.showMessageBox({
        type: "info",
        title: "Updates",
        message: "Die Update-Pruefung ist nur in der installierten Windows-Version aktiv."
      });
    }
    return;
  }

  if (updateCheckInFlight) {
    if (isManual) {
      await dialog.showMessageBox({
        type: "info",
        title: "Updates",
        message: "Es laeuft bereits eine Update-Pruefung."
      });
    }
    return;
  }

  manualUpdateCheck = isManual;
  updateCheckInFlight = true;
  refreshMenu();

  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    log.error("Update-Pruefung fehlgeschlagen", error);
    updateCheckInFlight = false;
    refreshMenu();

    const detail =
      error instanceof Error ? error.message : "Die Update-Pruefung konnte nicht abgeschlossen werden.";

    if (isManual) {
      await dialog.showMessageBox({
        type: "error",
        title: "Update-Pruefung fehlgeschlagen",
        message: "AION konnte keine Updates abrufen.",
        detail
      });
    }
  }
}

function configureAutoUpdater() {
  if (!isUpdateSupported()) {
    return;
  }

  log.initialize();
  autoUpdater.logger = log;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => {
    log.info("Pruefe auf Updates");
  });

  autoUpdater.on("update-available", async (info) => {
    updateCheckInFlight = false;
    updateTargetVersion = info.version;
    refreshMenu();

    const response = await dialog.showMessageBox({
      type: "info",
      title: "Update verfuegbar",
      buttons: ["Jetzt herunterladen", "Spaeter"],
      defaultId: 0,
      cancelId: 1,
      message: `Version ${info.version} ist verfuegbar.`,
      detail: "AION kann das Update jetzt herunterladen und spaeter installieren."
    });

    if (response.response === 0) {
      await autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on("update-not-available", async () => {
    updateCheckInFlight = false;
    updateTargetVersion = null;
    refreshMenu();

    if (manualUpdateCheck) {
      await dialog.showMessageBox({
        type: "info",
        title: "Keine Updates",
        message: "AION ist bereits auf dem aktuellen Stand."
      });
    }

    manualUpdateCheck = false;
  });

  autoUpdater.on("error", async (error) => {
    log.error("Auto-Updater Fehler", error);
    updateCheckInFlight = false;
    refreshMenu();

    if (manualUpdateCheck) {
      const detail =
        error instanceof Error ? error.message : "Der Update-Dienst hat einen unbekannten Fehler gemeldet.";

      await dialog.showMessageBox({
        type: "error",
        title: "Update-Fehler",
        message: "Das Update konnte nicht verarbeitet werden.",
        detail
      });
    }

    manualUpdateCheck = false;
  });

  autoUpdater.on("download-progress", (progress) => {
    log.info(`Update-Download ${Math.round(progress.percent)}%`);
  });

  autoUpdater.on("update-downloaded", async (info) => {
    updateCheckInFlight = false;
    updateDownloaded = true;
    updateTargetVersion = info.version;
    refreshMenu();

    const response = await dialog.showMessageBox({
      type: "info",
      title: "Update bereit",
      buttons: ["Jetzt neu starten", "Spaeter"],
      defaultId: 0,
      cancelId: 1,
      message: `Version ${info.version} wurde heruntergeladen.`,
      detail: "AION muss neu gestartet werden, um das Update zu installieren."
    });

    if (response.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
}

function openInfoWindow(title: string, routeSegments: string[]) {
  const target = new BrowserWindow({
    title,
    width: 920,
    height: 760,
    minWidth: 760,
    minHeight: 620,
    autoHideMenuBar: false,
    backgroundColor: "#101319",
    parent: mainWindow ?? undefined,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  void target.loadFile(resolveWebHtml(...routeSegments));
  target.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });
}

function buildAppMenu() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "AION",
      submenu: [
        {
          label: "Ueber AION",
          click: () => showAboutDialog()
        },
        {
          label: "Rechtliches",
          click: () => openInfoWindow("AION Rechtliches", RECHTLICHES_ROUTE)
        },
        {
          label: "Impressum",
          click: () => openInfoWindow("AION Impressum", IMPRESSUM_ROUTE)
        },
        { type: "separator" as const },
        {
          id: "check-for-updates",
          label: updateCheckInFlight ? "Suche nach Updates..." : "Nach Updates suchen",
          enabled: !updateCheckInFlight,
          click: () => {
            void checkForUpdates(true);
          }
        },
        {
          id: "install-update",
          label: updateTargetVersion
            ? `Update ${updateTargetVersion} installieren`
            : "Update installieren",
          enabled: updateDownloaded,
          click: () => {
            autoUpdater.quitAndInstall();
          }
        },
        { type: "separator" as const },
        {
          role: "quit" as const,
          label: "Beenden"
        }
      ]
    },
    {
      label: "Ansicht",
      submenu: [
        { role: "reload" as const, label: "Neu laden" },
        { role: "toggleDevTools" as const, label: "Entwicklertools" },
        { type: "separator" as const },
        { role: "resetZoom" as const, label: "Originalgroesse" },
        { role: "zoomIn" as const, label: "Vergroessern" },
        { role: "zoomOut" as const, label: "Verkleinern" }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createMainWindow() {
  const window = new BrowserWindow({
    title: WINDOW_TITLE,
    ...DEFAULT_WINDOW,
    autoHideMenuBar: true,
    backgroundColor: "#101319",
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  void window.loadFile(resolveIndexHtml());
  mainWindow = window;

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  window.on("closed", () => {
    if (mainWindow === window) {
      mainWindow = null;
    }
  });
}

app.whenReady().then(async () => {
  try {
    startBackendSidecar();
    await waitForBackendReady();
    configureAutoUpdater();
    buildAppMenu();
    createMainWindow();

    if (isUpdateSupported()) {
      setTimeout(() => {
        void checkForUpdates(false);
      }, 10000);
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Die lokale AION-Laufzeit konnte nicht gestartet werden.";

    dialog.showErrorBox("AION-Start fehlgeschlagen", message);
    app.quit();
    return;
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("before-quit", () => {
  stopBackendSidecar();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
