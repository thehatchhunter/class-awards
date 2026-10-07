# Class Awards auf EdgeOne Makers

Das Projekt enthält ein statisches Frontend und Node.js-Cloud-Functions. Die Functions stellen `/api/state`, `/api/vote` und `/api/config` bereit. Die Stimmen liegen einzeln in EdgeOne Blob, sodass gleichzeitige Stimmen nicht denselben Zähler überschreiben.

## Einmalig in EdgeOne

1. Lege ein Git-Repository für das Projekt an und kopiere den **Inhalt** dieses Ordners (`outputs`) in dessen Stammverzeichnis. Verbinde das Repository in EdgeOne Makers über **Import Git Repository**. Für Cloud Functions muss Makers den Node.js-Build samt `package.json` ausführen.
2. Nutze als Projektstamm das Repository-Verzeichnis und als Ausgabeverzeichnis dessen Stammverzeichnis. Makers installiert `package.json`; lasse den Build-Befehl leer. Stelle sicher, dass `package.json`, `index.html`, `voting.html`, `reveal.html`, `admin.html` und `cloud-functions/` im Projektstamm liegen. Makers ordnet `cloud-functions/api/state.js` der URL `/api/state` zu.
3. Setze in **Project Settings → Environment Variables** die geheime Variable `ADMIN_PIN` auf einen eigenen, schwer zu erratenden Code. Der Code gehört nicht ins Repository. Änderungen an Variablen gelten für neue Deployments.
4. Deploye das Projekt. Makers erzeugt eine öffentliche Projekt-URL. Die statische Seite öffnet sich unter `/` oder `/voting.html`.
5. Öffne einmal `/admin.html`, trage den `ADMIN_PIN`, den Klassennamen, alle Namen und die Award-Liste ein und speichere. Die Liste kann Kategorien als `Gruppe | Award` enthalten.
6. Teile nur den Voting-Link (`/` oder `/voting.html`) mit der Klasse. `/reveal.html` zeigt die gemeinsamen Ergebnisse. Bewahre den Admin-Code privat auf.

## Stimmen und Datenschutz

Die Abstimmung akzeptiert eine Stimme pro Browser-Gerät. Der Server speichert die gewählten Namen je Award, aber keine Schülernamen als Identität. Das ist eine anonyme Klassenabstimmung und keine überprüfte Ein-Stimme-pro-Person-Abstimmung: Wer Browserdaten löscht oder ein anderes Gerät verwendet, kann erneut abstimmen.

Der Admin kann alle Stimmen über `/admin.html` zurücksetzen. Die Konfiguration lässt sich erst ändern, wenn die abgegebenen Stimmen zurückgesetzt wurden.

## Lokale Vorschau

Die `.html`-Dateien lassen sich lokal ansehen; dabei werden Stimmen nur lokal simuliert. Für gemeinsame Stimmen müssen die Dateien samt `cloud-functions/` auf Makers deployed sein.
