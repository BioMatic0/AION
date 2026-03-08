import { app, BrowserWindow, dialog, Menu, shell, type MenuItemConstructorOptions } from "electron";
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

function appendRuntimeLog(filename: string, chunk: Buffer) {
  appendFileSync(path.join(resolveRuntimeLogDir(), filename), chunk);
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

  const runtimeDir = resolveApiRuntimeDir();
  const child = spawn(process.execPath, [apiEntry], {
    cwd: runtimeDir,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      NODE_ENV: app.isPackaged ? "production" : "development",
      PORT: String(API_PORT),
      AION_DESKTOP_RUNTIME: "1",
      AION_DESKTOP_DATA_DIR: resolveRuntimeDataDir()
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
    buildAppMenu();
    createMainWindow();
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
