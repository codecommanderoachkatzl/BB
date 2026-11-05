# Date Planner

Statische GitHub-Pages-Webseite für zwei Personen mit Firebase Firestore als gemeinsamem Speicher.

## Funktionen

- Gerät merkt sich den Login und öffnet den letzten Raum automatisch wieder.
- Gemeinsame Zeiten werden live über Firebase synchronisiert.
- Überschneidungen werden automatisch berechnet und in einer Monats-Kalenderansicht angezeigt.
- Vergangene Zeit-Einträge werden beim Öffnen automatisch gelöscht und können zusätzlich manuell gelöscht werden.
- Date-Ideen mit Datum/Zeit, passenden Überschneidungsvorschlägen, Annehmen/Ablehnen, Lieblingsorten und Maps-Links ohne Google-API-Key.
- Angenommene Date-Vorschläge erscheinen automatisch als fixe Date-Einträge in der Kalender-/Zeitenansicht.
- Oberfläche ist für Handy hochkant priorisiert.

## Firebase

Die Web-App-Konfiguration steht in `DatePlaner-firebase-config.js`.

In Firebase muss aktiviert sein:

1. Authentication → Sign-in method → Anonymous aktivieren.
2. Firestore Database erstellen.
3. Die Regeln aus `DatePlaner-firebase.rules` in Firestore Rules veröffentlichen.
4. Die Dateien über GitHub Pages hosten.

Das gemeinsame Passwort wird nicht gespeichert. Am Gerät wird nur der daraus berechnete Raum-Schlüssel gemerkt, damit der Login erhalten bleibt.

## Maps

Es wird kein Google Maps API-Key benötigt. Orte werden über normale Google-Maps-Links und eine eingebettete Suchkarte geöffnet.



