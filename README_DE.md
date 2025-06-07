# Simple Finance Manager

Eine Full-Stack-Webanwendung zur Verwaltung persönlicher Finanzen. Sie ermöglicht Benutzern, sich zu registrieren, anzumelden und ihre Einnahmen und Ausgaben zu verfolgen. Sie hat mit Django (REST API) und React frontend gebaut.

## Technologie-Stack

- Backend: Django REST Framework, PostgreSQL
- Frontend: React
- Deployment: Render.com

## Funktionen

- Benutzerregistrierung und Login mit JWT-Authentifizierung
- Sichere Speicherung von Tokens (localStorage oder sessionStorage)
- Hinzufügen, Anzeigen und Löschen von finanziellen Transaktionen
- Kategorisierung von Transaktionen
- PostgreSQL database
- React-Frontend mit geschützten Routen

## Live Demo

- Frontend: https://finance-manager-front.onrender.com
- API: https://finance-manager-app-ap7a.onrender.com/api/

## Setup (Entwicklung)

1. Repository klonen
2. .env-Datei im Frontend erstellen mit:
```
REACT_APP_API_URL=https://finance-manager-app-ap7a.onrender.com/api
```
3. Backend starten:
```
python manage.py migrate && python manage.py runserver
```
4. Frontend starten:
```
npm install && npm start
```

## P.S.

Dieses Projekt wurde mit Fokus auf Sicherheit und Benutzerfreundlichkeit entwickelt. Beiträge sind willkommen!