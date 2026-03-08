import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const sourceSvg = path.join(rootDir, "assets", "branding", "aion-icon.svg");
const desktopResourcesDir = path.join(rootDir, "apps", "desktop", "build-resources");
const webPublicDir = path.join(rootDir, "apps", "web", "public");
const webBrandingDir = path.join(webPublicDir, "branding");
const iosAssetsDir = path.join(
  rootDir,
  "apps",
  "web",
  "ios",
  "App",
  "App",
  "Assets.xcassets"
);
const iosAppIconDir = path.join(iosAssetsDir, "AppIcon.appiconset");
const iosSplashDir = path.join(iosAssetsDir, "Splash.imageset");

const iosIconSpecs = [
  { filename: "icon-20@2x.png", idiom: "iphone", size: "20x20", scale: "2x", pixels: 40 },
  { filename: "icon-20@3x.png", idiom: "iphone", size: "20x20", scale: "3x", pixels: 60 },
  { filename: "icon-29@2x.png", idiom: "iphone", size: "29x29", scale: "2x", pixels: 58 },
  { filename: "icon-29@3x.png", idiom: "iphone", size: "29x29", scale: "3x", pixels: 87 },
  { filename: "icon-40@2x.png", idiom: "iphone", size: "40x40", scale: "2x", pixels: 80 },
  { filename: "icon-40@3x.png", idiom: "iphone", size: "40x40", scale: "3x", pixels: 120 },
  { filename: "icon-60@2x.png", idiom: "iphone", size: "60x60", scale: "2x", pixels: 120 },
  { filename: "icon-60@3x.png", idiom: "iphone", size: "60x60", scale: "3x", pixels: 180 },
  { filename: "icon-20@1x-ipad.png", idiom: "ipad", size: "20x20", scale: "1x", pixels: 20 },
  { filename: "icon-20@2x-ipad.png", idiom: "ipad", size: "20x20", scale: "2x", pixels: 40 },
  { filename: "icon-29@1x-ipad.png", idiom: "ipad", size: "29x29", scale: "1x", pixels: 29 },
  { filename: "icon-29@2x-ipad.png", idiom: "ipad", size: "29x29", scale: "2x", pixels: 58 },
  { filename: "icon-40@1x-ipad.png", idiom: "ipad", size: "40x40", scale: "1x", pixels: 40 },
  { filename: "icon-40@2x-ipad.png", idiom: "ipad", size: "40x40", scale: "2x", pixels: 80 },
  { filename: "icon-76@1x.png", idiom: "ipad", size: "76x76", scale: "1x", pixels: 76 },
  { filename: "icon-76@2x.png", idiom: "ipad", size: "76x76", scale: "2x", pixels: 152 },
  { filename: "icon-83.5@2x.png", idiom: "ipad", size: "83.5x83.5", scale: "2x", pixels: 167 },
  { filename: "icon-1024.png", idiom: "ios-marketing", size: "1024x1024", scale: "1x", pixels: 1024 }
];

const splashFilenames = ["splash-2732x2732.png", "splash-2732x2732-1.png", "splash-2732x2732-2.png"];

async function ensureDir(targetDir) {
  await mkdir(targetDir, { recursive: true });
}

async function resetDir(targetDir) {
  await rm(targetDir, { recursive: true, force: true });
  await ensureDir(targetDir);
}

async function renderIcon(size, targetFile) {
  await sharp(sourceSvg)
    .resize(size, size)
    .png()
    .toFile(targetFile);
}

async function renderSplash(targetFile) {
  const iconBuffer = await sharp(sourceSvg).resize(1144, 1144).png().toBuffer();
  const splashOverlay = Buffer.from(`
    <svg width="2732" height="2732" viewBox="0 0 2732 2732" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="1366" cy="1366" r="760" fill="#103A34"/>
      <circle cx="1366" cy="1366" r="620" stroke="#DCE9E0" stroke-width="36" stroke-opacity="0.18"/>
      <rect x="982" y="2060" width="768" height="140" rx="70" fill="#DDEAE1"/>
      <text x="1366" y="2148" text-anchor="middle" font-size="88" font-family="Arial, sans-serif" font-weight="700" fill="#103A34">AION</text>
    </svg>
  `);

  await sharp({
    create: {
      width: 2732,
      height: 2732,
      channels: 4,
      background: "#F6F1E7"
    }
  })
    .composite([
      { input: splashOverlay },
      { input: iconBuffer, left: 794, top: 794 }
    ])
    .png()
    .toFile(targetFile);
}

async function writeJson(targetFile, payload) {
  await writeFile(targetFile, JSON.stringify(payload, null, 2) + "\n", "utf8");
}

async function main() {
  await Promise.all([
    ensureDir(desktopResourcesDir),
    ensureDir(webBrandingDir),
    resetDir(iosAppIconDir),
    resetDir(iosSplashDir)
  ]);

  const icon16 = path.join(desktopResourcesDir, "aion-16.png");
  const icon32 = path.join(desktopResourcesDir, "aion-32.png");
  const icon64 = path.join(desktopResourcesDir, "aion-64.png");
  const icon128 = path.join(desktopResourcesDir, "aion-128.png");
  const icon256 = path.join(desktopResourcesDir, "aion-256.png");
  const icon512 = path.join(desktopResourcesDir, "aion-512.png");

  await Promise.all([
    renderIcon(16, icon16),
    renderIcon(32, icon32),
    renderIcon(64, icon64),
    renderIcon(128, icon128),
    renderIcon(256, icon256),
    renderIcon(512, icon512),
    renderIcon(192, path.join(webPublicDir, "icon-192.png")),
    renderIcon(512, path.join(webPublicDir, "icon-512.png")),
    renderIcon(180, path.join(webPublicDir, "apple-touch-icon.png")),
    renderIcon(32, path.join(webPublicDir, "favicon-32x32.png")),
    renderIcon(16, path.join(webPublicDir, "favicon-16x16.png")),
    renderIcon(512, path.join(webBrandingDir, "aion-icon-512.png")),
    renderIcon(1024, path.join(webBrandingDir, "aion-icon-1024.png"))
  ]);

  const faviconBuffer = await pngToIco([icon16, icon32, icon64, icon128, icon256]);
  await writeFile(path.join(webPublicDir, "favicon.ico"), faviconBuffer);
  await writeFile(path.join(desktopResourcesDir, "aion.ico"), faviconBuffer);

  await Promise.all(
    iosIconSpecs.map((spec) => renderIcon(spec.pixels, path.join(iosAppIconDir, spec.filename)))
  );

  await writeJson(path.join(iosAppIconDir, "Contents.json"), {
    images: iosIconSpecs.map(({ filename, idiom, size, scale }) => ({
      filename,
      idiom,
      size,
      scale
    })),
    info: {
      author: "aion-branding-script",
      version: 1
    }
  });

  await Promise.all(splashFilenames.map((filename) => renderSplash(path.join(iosSplashDir, filename))));

  await writeJson(path.join(iosSplashDir, "Contents.json"), {
    images: [
      { idiom: "universal", filename: "splash-2732x2732-2.png", scale: "1x" },
      { idiom: "universal", filename: "splash-2732x2732-1.png", scale: "2x" },
      { idiom: "universal", filename: "splash-2732x2732.png", scale: "3x" }
    ],
    info: {
      author: "aion-branding-script",
      version: 1
    }
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
