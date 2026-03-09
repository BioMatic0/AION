# AION Release Artifacts

Status: 2026-03-09

Current Windows state:

- the NSIS installer and portable executable were rebuilt with the revised gray
  and anthracite interface
- the desktop app still starts the local AION runtime automatically
- the current `0.1.1` artifacts are available as standalone files
- the Windows desktop now includes a prepared GitHub update channel for future releases
- the legal companion files now reflect the AION Community Fairness License 1.0
  and the fair-commerce framework

## Included Files

- `AION Setup 0.1.1.exe`
  Windows installer (NSIS)
- `AION 0.1.1.exe`
  Portable Windows version
- `AION-android-debug.apk`
  Android debug APK
- `AION-ios-xcode-project.zip`
  iOS Xcode project for continued work on macOS
- `AION-Windows-Free-0.1.0.zip`
  older Windows distribution bundle with installer, portable build, and legal notes
- `AION-Release-Bundle-0.1.0.zip`
  older combined package with Windows, Android, and iOS artifacts plus legal notes
- `LICENSE`
  the AION Community Fairness License 1.0 for the project
- `COPYRIGHT.md`
  internal project reference and rights notice
- `FAIR-COMMERCE.md`
  framework for fair, plausible, and non-exploitative commercial distribution
- `REFERENCE.md`
  reference data and shared project principle

## SHA256

- `AION Setup 0.1.0.exe`
  `D1D2591755D017BDC567A0046EF91CD8604E694CC1CC7A2A3016EFBE019A2CD3`
- `AION 0.1.0.exe`
  `11E385CBDE8C064D89C3FAF558FB770C6FBF7DB6225B7ACB4EB25A861C322180`
- `AION-android-debug.apk`
  `1BEE876A90FA57BADA07BD0CC85E7A0C1EBDB907FA0796789FE877BB0132D9F1`
- `AION-ios-xcode-project.zip`
  `B065259F1595D523AEB063D6B86967F883A688F6A7DD1C99328FAA855664E718`
- `AION-Windows-Free-0.1.0.zip`
  `31A4000AF168149A4638B2B7D2B1C83303B8E78D366D38427675C224EAC2644C`
- `AION-Release-Bundle-0.1.0.zip`
  `274F8FA836E84E828B7AA85FF6277081E5D49484F25518B1BC5315C121C647AC`

## Important Notes

- Project reference in the current project state: Patrick Wirth
- Reference contact: patrickwirth_93@icloud.com
- The source code and project files are provided under the AION Community
  Fairness License 1.0.
- Revenue-based operation or distribution requires a fair and plausible model
  and must not be aimed at exploitation or mere private enrichment.
- The current Windows version starts a bundled local AION API automatically when
  the application launches.
- Because of that, the Windows desktop build no longer depends on a separately
  started API, PostgreSQL, or Redis.
- The bundled desktop runtime mode now stores local user data permanently in a
  local desktop state directory for the signed-in user.
- The Windows version is therefore suitable as a self-contained local desktop
  application for external distribution as long as no central multi-user API is
  required.
- The Android APK is a debug build. For real use on a phone, the API must be
  reachable from the device and the client must be rebuilt against
  `NEXT_PUBLIC_API_URL`.
- A `.ipa` could not be produced on this Windows system. Apple builds require
  macOS with Xcode, so the prepared Xcode project is provided as a ZIP archive instead.

## Free Distribution and Shared Contribution

- The provided build files may be used and redistributed freely.
- The governing notice is included in `FREE-USE-NOTICE.txt`.
- The ZIP packages include `LICENSE`, `COPYRIGHT.md`, `REFERENCE.md`,
  `FAIR-COMMERCE.md`, and the iOS build notes.
- AION is intended to remain freely accessible to everyone and open to shared contribution.

## Release 0.1.1

- `AION Setup 0.1.1.exe`
- `AION 0.1.1.exe`
- `AION-Setup-0.1.1.exe`
- `AION-Setup-0.1.1.exe.blockmap`
- `latest.yml`
- `SHA256SUMS-0.1.1.txt`

The `0.1.0` ZIP bundles remain in the folder as older archive packages. For the
current state, use the `0.1.1` files.

If a central API URL is provided later, Android and iOS builds should be
regenerated against that URL.
