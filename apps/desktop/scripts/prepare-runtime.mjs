import { execFileSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const desktopDir = path.resolve(__dirname, "..");
const apiDeployDir = path.join(desktopDir, "api-runtime");
const pnpmNodeScript = process.env.npm_execpath;

function removeDirIfPresent(targetDir) {
  if (!existsSync(targetDir)) {
    return;
  }

  const disposeDir = path.join(desktopDir, `.dispose-${path.basename(targetDir)}-${Date.now()}`);

  try {
    renameSync(targetDir, disposeDir);
    rmSync(disposeDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
    return;
  } catch {
    // Fall back to direct removal below.
  }

  if (process.platform === "win32") {
    execFileSync(
      "powershell.exe",
      ["-NoProfile", "-Command", `Remove-Item -Recurse -Force '${targetDir}' -ErrorAction SilentlyContinue`],
      {
        cwd: desktopDir,
        stdio: "inherit",
        env: process.env
      }
    );
    return;
  }

  rmSync(targetDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
}

function run(args, cwd = desktopDir) {
  if (pnpmNodeScript) {
    execFileSync(process.execPath, [pnpmNodeScript, ...args], {
      cwd,
      stdio: "inherit",
      env: process.env
    });
    return;
  }

  execFileSync(process.platform === "win32" ? "pnpm.cmd" : "pnpm", args, {
    cwd,
    stdio: "inherit",
    env: process.env
  });
}

removeDirIfPresent(apiDeployDir);

run(["--dir", "../web", "build:mobile"]);
run(["--dir", "../api", "build"]);
run(["--filter", "@aion/api", "deploy", "--legacy", "--prod", apiDeployDir], path.resolve(desktopDir, "../.."));
run(["--dir", ".", "build"]);
