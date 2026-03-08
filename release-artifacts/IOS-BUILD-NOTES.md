# AION iOS Build-Hinweise

Stand: 2026-03-08

## Enthalten

- vorbereitetes Capacitor-iOS-Projekt
- gebrandete App-Icons
- gebrandete Splash-Assets
- Bundle-ID `com.patrickwirth.aion`
- Marketing-Version `0.1.0`

## Wichtig

- Auf diesem Windows-System kann kein lauffaehiges `.ipa` erzeugt werden.
- Fuer einen echten iPhone-Build wird macOS mit Xcode benoetigt.
- Fuer App-Store- oder TestFlight-Auslieferung werden ein Apple-Developer-Konto sowie gueltige Signierung/Provisioning-Profile benoetigt.

## Weiterbau auf macOS

1. Das ZIP `AION-ios-xcode-project.zip` auf einen Mac entpacken.
2. Xcode oeffnen und `App.xcodeproj` aus dem Ordner `App` laden.
3. Unter `Signing & Capabilities` das eigene Team waehlen.
4. Falls noetig die Bundle-ID an das eigene Apple-Konto anpassen.
5. `Product > Archive` ausfuehren.
6. Das Archiv danach ueber den Organizer nach TestFlight oder in den App Store hochladen.

## API-Hinweis

- Das iOS-Projekt enthaelt derzeit die lokale/exportierte Web-Anwendung.
- Fuer produktive mobile Nutzung sollte die App gegen eine erreichbare zentrale API-URL gebaut und getestet werden.
