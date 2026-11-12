# Partyspiele – Wort-Imposter, Fragen-Imposter & Quiz

Ein Handy, reihum weitergeben: drei Partyspiele als Web-App. Sie läuft im Browser, lässt sich auf dem Handy installieren und funktioniert danach auch ohne Internet.

## App öffnen

### Variante A: Am Computer ausprobieren (ohne Installation)
1. Den kompletten Ordner herunterladen (auf GitHub: **Code → Download ZIP**) und entpacken.
2. **`index.html`** doppelklicken. Die App öffnet sich im Browser.

So kann man sofort spielen. **Installieren und Offline-Modus funktionieren auf diesem Weg aber nicht**, weil Browser das nur für Seiten mit einer Internet-Adresse (`https://…`) erlauben.

> Wichtig: Die Dateien müssen zusammenbleiben. `index.html` braucht die Ordner `css/`, `js/`, `vendor/` und `icons/` daneben.

### Variante B: Auf dem Handy installieren (empfohlen)
Die App muss einmal über eine `https://`-Adresse erreichbar sein. Am einfachsten geht das kostenlos mit **GitHub Pages**:

1. Auf GitHub im Repository **Settings → Pages** öffnen.
2. Unter **Build and deployment → Source** „Deploy from a branch“ wählen.
3. Den Branch mit der App (z. B. `main`) und den Ordner **`/ (root)`** auswählen und speichern.
4. Nach ca. 1–2 Minuten erscheint dort die Adresse, z. B. `https://<benutzername>.github.io/Impostor-Spiel-1.1/`.

> GitHub Pages ist für **öffentliche** Repositories kostenlos. Für private Repositories braucht man einen kostenpflichtigen GitHub-Plan.

Dann auf dem Handy:
- **iPhone/iPad (Safari):** Adresse öffnen → **Teilen** → **„Zum Home-Bildschirm“**.
- **Android (Chrome):** Adresse öffnen → **⋮** → **„App installieren“** bzw. **„Zum Startbildschirm hinzufügen“**.

Ab jetzt startet Partyspiele vom Home-Bildschirm wie eine normale App, im Vollbild und auch im Flugmodus. In der App gibt es außerdem im Logo-Menü den Punkt **„Als App installieren“** mit dieser Anleitung.

### Variante C: Lokaler Testserver (für Bastler)
Im Ordner ausführen:
```bash
python3 -m http.server 8080
```
Dann `http://localhost:8080` im Browser öffnen. Hier funktionieren auch Offline-Modus und Installation (nur auf diesem Computer).

## Ordnerstruktur

| Datei / Ordner | Inhalt |
| --- | --- |
| `index.html` | Die App-Oberfläche (alle Ansichten und Pop-ups) |
| `css/app.css` | Eigenes Design (Farben, Themes, Handy-Anpassungen) |
| `js/data-words.js` | **Wort-Imposter:** Kategorien mit Wort + Hinweis |
| `js/data-questions.js` | **Fragen-Imposter:** Fragen-Paare, Schätzfragen mit Lösungen |
| `js/data-quiz.js` | **Quiz:** Fragen mit 1 richtigen und 3 falschen Antworten |
| `js/app.js` | Die Spiel-Logik |
| `vendor/` | Lokale Kopien von Tailwind-CSS, Font Awesome und Schriften (für den Offline-Modus) |
| `icons/` | App-Icons |
| `manifest.webmanifest` | Angaben für die Installation (Name, Icon, Farben) |
| `sw.js` | Service Worker: speichert die App für die Offline-Nutzung |
| `partyspiele.html` | Alte Adresse, leitet nur noch auf `index.html` weiter |

## Fragen und Wörter bearbeiten

- **In der App:** Logo-Menü → **Wörter-, Fragen- & Quiz-Tresor** (passwortgeschützt). Dort kann man alles hinzufügen, ändern, löschen und als CSV sichern oder importieren. Diese Änderungen werden nur auf dem jeweiligen Gerät gespeichert.
- **Für alle Geräte:** direkt in `js/data-words.js`, `js/data-questions.js` oder `js/data-quiz.js` bearbeiten (Formate stehen jeweils oben in der Datei).

Wenn du Standard-Fragen korrigierst, erhöhe in `js/app.js` die Zahl bei `DATA_VERSION`. Dann übernehmen auch Geräte mit gespeichertem Spielstand die Korrekturen.

## Nach Änderungen: Update an alle Geräte verteilen

Die installierte App speichert alle Dateien. Damit Handys eine neue Version laden:
1. In `sw.js` die Zeile `const CACHE_VERSION = "partyspiele-v1";` hochzählen (z. B. `v2`).
2. Änderungen auf GitHub hochladen.
3. Die App lädt die neue Version im Hintergrund und zeigt sie beim nächsten Start an.

Neue Dateien (z. B. weitere Bilder) müssen in `sw.js` in die Liste `PRECACHE` eingetragen werden, damit sie offline verfügbar sind.

## Design-Klassen neu bauen (nur bei Änderungen am Layout)

Das Layout nutzt Tailwind-CSS-Klassen, die als fertige Datei in `vendor/tailwind.css` liegen. Werden **neue** Tailwind-Klassen in `index.html` oder `js/*.js` verwendet, muss die Datei neu gebaut werden (Node.js nötig):
```bash
npm install
npm run build:css
```
Wer nur Fragen oder Wörter ändert, braucht das nicht.

## Lizenzen der eingebundenen Pakete
- Font Awesome Free 6.5.1: Icons CC BY 4.0, Schriftdateien SIL OFL 1.1, Code MIT (siehe `vendor/fontawesome/LICENSE.txt`)
- Schriften Inter, Syne und JetBrains Mono (über Fontsource): SIL Open Font License 1.1
- Tailwind CSS: MIT
