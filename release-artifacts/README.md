# AION Release-Artefakte

Stand: 2026-03-08

## Enthaltene Dateien

- `AION Setup 0.1.0.exe`
  Windows-Installer (NSIS)
- `AION 0.1.0.exe`
  Portable Windows-Version
- `AION-android-debug.apk`
  Android-Debug-APK
- `AION-ios-xcode-project.zip`
  iOS-Xcode-Projekt fuer den Weiterbau auf macOS
- `AION-Windows-Free-0.1.0.zip`
  Weitergabepaket fuer Windows mit Installer, Portable-Version und rechtlichen Hinweisen
- `AION-Release-Bundle-0.1.0.zip`
  Gesamtpaket mit Windows-, Android- und iOS-Artefakten sowie den rechtlichen Hinweisen
- `LICENSE`
  MIT License des Projekts
- `COPYRIGHT.md`
  Projektinterner Referenz- und Rechtehinweis
- `REFERENCE.md`
  Referenzdaten und gemeinsamer Projektgedanke

## SHA256

- `AION Setup 0.1.0.exe`
  `138FBF7B10961C307ABEF9548487D157DB76655D4FF7B2265839B417D843AB9C`
- `AION 0.1.0.exe`
  `6F23CD0B36AEB83F2093DEC25D045D4A449A7393F197E62B850F988AE10F7F69`
- `AION-android-debug.apk`
  `1BEE876A90FA57BADA07BD0CC85E7A0C1EBDB907FA0796789FE877BB0132D9F1`
- `AION-ios-xcode-project.zip`
  `B065259F1595D523AEB063D6B86967F883A688F6A7DD1C99328FAA855664E718`
- `AION-Windows-Free-0.1.0.zip`
  `31A4000AF168149A4638B2B7D2B1C83303B8E78D366D38427675C224EAC2644C`
- `AION-Release-Bundle-0.1.0.zip`
  `274F8FA836E84E828B7AA85FF6277081E5D49484F25518B1BC5315C121C647AC`

## Wichtige Hinweise

- Projektreferenz im aktuellen Projektstand: Patrick Wirth
- Kontaktreferenz: patrickwirth_93@icloud.com
- Der Quellcode und die Projektdateien werden unter der MIT License bereitgestellt.
- Die aktuelle Windows-Version startet eine gebuendelte lokale AION-API beim Start der Anwendung automatisch mit.
- Dadurch ist der Windows-Desktop-Build nicht mehr auf eine separat gestartete API, PostgreSQL oder Redis angewiesen.
- Der gebuendelte Desktop-Runtime-Modus speichert lokale Nutzdaten jetzt dauerhaft in einem lokalen Desktop-State-Verzeichnis des angemeldeten Benutzers.
- Die Windows-Version ist damit als eigenstaendige lokale Desktop-Anwendung fuer die externe Weitergabe geeignet, solange keine zentrale Mehrnutzer-API benoetigt wird.
- Das Android-APK ist ein Debug-Build. Fuer echte Nutzung auf einem Telefon muss die API unter einer vom Geraet erreichbaren URL laufen und der Client mit `NEXT_PUBLIC_API_URL` dagegen neu gebaut werden.
- Ein `.ipa` konnte auf diesem Windows-System nicht erzeugt werden. Apple-Builds benoetigen macOS mit Xcode. Deshalb liegt hier das vorbereitete Xcode-Projekt als ZIP bei.

## Freie Weitergabe und Mitgestaltung

- Die bereitgestellten Build-Dateien koennen frei genutzt und weitergegeben werden.
- Die Hinweise dafuer stehen in `FREE-USE-NOTICE.txt`.
- Die ZIP-Pakete enthalten `LICENSE`, `COPYRIGHT.md`, `REFERENCE.md` und die iOS-Build-Hinweise.
- AION soll fuer jeden und jederzeit frei zugaenglich sein und gemeinschaftlich mitgestaltet werden.

Wenn spaeter eine zentrale API-URL bereitsteht, sollten Android- und iOS-Builds gegen diese URL neu erzeugt werden.
