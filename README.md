# Simple Finance Manager

A full-stack web application that allows users to manage their personal finances. It includes user registration, authentication, and transaction tracking. Built with Django (REST API) and React frontend.

## Tech Stack

- Backend: Django REST Framework, PostgreSQL
- Frontend: React
- Deployment: Render.com

## Features

- User registration and login with JWT authentication
- Secure session/token handling (localStorage or sessionStorage)
- Add, view, and delete financial transactions
- Categorize your income and expenses
- PostgreSQL database
- React frontend with protected routes

## Live Demo

- Frontend: https://finance-manager-front.onrender.com
- API: https://finance-manager-app-ap7a.onrender.com/api/

## Setup (Development)

1. Clone the repository
2. Create a .env file in the frontend and set:
```
REACT_APP_API_URL=https://finance-manager-app-ap7a.onrender.com/api
```
3. Run the backend:
```
python manage.py migrate && python manage.py runserver
```
4. Run the frontend:
```
npm install && npm start
```

## P.S.

Project is built with security and usability in mind. Contributions welcome!