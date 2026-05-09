# Fewo Mainau Webseite

Dieses Repository enthaelt die Webseite fuer die Ferienwohnungen/Fewo Mainau in Fahr am Main bei Volkach. Die Seite ist eine schlanke, statische Hauptseite mit erhaltenen Backend-Anbindungen fuer Anfrageformular und Belegungskalender.

## Zweck des Repos

Ziel ist eine wartbare Version der urspruenglich aus einer komplexen Vorlage entstandenen Webseite. Besucher sollen weiterhin dieselben Inhalte und Funktionen erhalten:

- Startbereich mit Bildwechsel, Logo und transparenter Navigation beim Seitenanfang
- Inhaltsbereiche zu Urlaub, Wohnungswahl, Preisen, Buchungsanfrage, Galerien und Kontakt
- Bildgalerien/Slider ohne alte Template-Bibliotheken
- Anfrageformular mit bestehendem `formmail.php`
- Belegungskalender ueber bestehende `/calendar/`-Iframes
- Impressum/Datenschutz als Modal bzw. eingebundene Inhalte
- SEO-Grunddaten, Sitemap/Robots und bestehende Bildinhalte

## Aktueller Aufbau

Die aktive Webseite besteht vor allem aus:

- `index.html` - Hauptseite
- `links.html` - vereinfachte Link-/Partnerseite
- `css/main.css` - neue, reduzierte Styles
- `js/main.js` - eigene kleine JS-Komponenten fuer Navigation, Slider, Modals, Formularhilfen und Parallax
- `img/` - aktive Bilder und Logos
- `fonts/` - aktive Schriften
- `formmail.php` - bestehender Formular-Endpunkt
- `calendar/` - bestehender Belegungskalender
- `_archive/legacy-template/` - archivierte Altlasten der urspruenglichen Vorlage
- `_archive/.htaccess` - verhindert direkten Zugriff auf das Archiv, soweit der Server `.htaccess` auswertet

## Bisherige Arbeit

Das Arbeitsverzeichnis wurde als Git-Repo eingerichtet. Der erste Commit war:

- `cc2306a Initial commit`

Danach wurde die Seite funktional identisch neu aufgebaut und alte Template-Dateien wurden nicht geloescht, sondern in `_archive/legacy-template/` verschoben. Der Commit dazu ist:

- `671bada Rebuild site and archive legacy template`

Wichtige Entscheidungen:

- Neubau statt muehsamer Datei-Jagd, weil die Vorlage sehr viele CSS-/JS-/HTML-/Log-/Arbeitsdateien enthielt.
- Alte Bibliotheken wie Bootstrap/Probootstrap/Flexslider/PrettyPhoto/jQuery wurden aus der aktiven Seite entfernt.
- Die sichtbaren Funktionen wurden mit minimalem eigenem CSS/JS nachgebaut.
- PHP-Backend und Kalender bleiben erhalten.
- Archivierte Dateien bleiben als Sicherheitsnetz im Repo.

## Zuletzt vorgenommene, noch nicht committed Aenderungen

Nach `671bada` wurden Layout-Korrekturen an der neuen Seite vorgenommen:

- Section-Hintergrundbilder wurden von Inline-CSS-Variablen auf feste CSS-Klassen umgestellt:
  - `banner-auswahl`
  - `banner-buchung`
  - `banner-galerie`
- Das Header-Logo wurde naeher an die Originalvorlage angepasst: Sprite-artiges Verhalten ueber `img/logo.png`, oben transparent/hell, beim Scrollen andere Position.
- Der schwarze Balken unter dem Welcome-Slider wurde adressiert, indem `hero-slider`, `.hero .slide` und `.hero figcaption` dieselbe Mindesthoehe erhalten.
- Fuer kleine Bildschirme wurde eine niedrigere Hero-Hoehe ergaenzt.
- Der zwischenzeitlich vereinfachte Buchungszeitraum mit zwei nativen Datumsfeldern wurde wieder durch ein einzelnes Textfeld `name="Buchungszeitraum:"` mit eigenem Range-Datepicker ersetzt. Der Datepicker ist direkt in `js/main.js` und `css/main.css` umgesetzt und nutzt keine externen Lightpick-/Moment-Dateien.
- Alle Slider nutzen jetzt Fade-Uebergaenge statt harter Bildwechsel. Die gemeinsame Carousel-Komponente in `js/main.js` erzeugt fuer jeden Slider Bullet-Navigation am unteren Rand; aktive Slides werden farblich markiert und Bullet-Klicks springen direkt zum jeweiligen Bild.
- Das Anfrageformular wurde optisch wieder naeher an die Vorlage gebracht: ruhige graue Formularschrift, Iconposition rechts im Eingabefeld und die benoetigte Icomoon-Schrift liegt aktiv unter `fonts/icomoon/`.

Zum Zeitpunkt dieser README sind diese Dateien geaendert und noch nicht committed:

- `index.html`
- `css/main.css`
- `js/main.js`
- `README.md`
- `fonts/icomoon/`

## Bekannte Pruefungen und Einschraenkungen

Bereits geprueft:

- Es gibt keine aktiven Referenzen mehr auf alte Template-Bundles wie `styles-merged.css`, `style.min.css`, `scripts.min.js`, `custom.js`, jQuery, Lightpick, Stellar oder Probootstrap.
- Die lokal referenzierten Bannerbilder existieren:
  - `img/flusspanorama.webp`
  - `img/faehre.webp`
  - `img/volkach-rathausplatz.webp`
  - `img/logo.png`

Nicht vollstaendig geprueft:

- PHP-Livefunktion, weil in der lokalen Umgebung kein PHP verfuegbar war.
- JS-Syntax per Node, weil Node lokal nicht verfuegbar war.
- Echte Browserdarstellung nach den letzten Layout-Fixes muss noch visuell geprueft werden.

## Weiterarbeit in einem neuen Chat

Wenn in einem neuen Chat weitergemacht wird:

1. Zuerst `git status --short` pruefen.
2. Die uncommitted Aenderungen in `index.html` und `css/main.css` nicht verwerfen.
3. Bei Layoutfragen immer zuerst mit der archivierten Vorlage vergleichen:
   - `_archive/legacy-template/index08-2024.html`
   - `_archive/legacy-template/index-ok.html`
   - `_archive/legacy-template/css/style.min.css`
4. Fuer aktive Aenderungen nur die neue Struktur anfassen, vor allem `index.html`, `css/main.css`, `js/main.js`.
5. Alte Dateien im Archiv nur als Referenz verwenden.
6. Nach sichtbaren Aenderungen im Browser hart neu laden, da CSS sonst aus dem Cache kommen kann.

## Noch sinnvolle naechste Schritte

- Aktuelle Layout-Fixes im Browser auf Desktop und Mobile pruefen.
- Danach einen kleinen Commit fuer README und Layout-Fixes erstellen.
- Optional: `.gitattributes` ergaenzen, um Zeilenendungen stabiler zu halten.
- Optional: Linkcheck fuer lokale Assets automatisieren.
- Optional: Falls PHP verfuegbar ist, Anfrageformular und Kalender lokal oder auf Staging testen.
