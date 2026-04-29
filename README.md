# ⚽ PremierLeague App — COM661 CW2

**Student:** Faysal Ahamed
**Student ID:** B00918889
**Module:** COM661 — Web Development
**University:** Ulster University

---

## 📋 Project Overview

A full-stack Premier League web application built with Angular 21 (frontend) and Flask + MongoDB (backend). The app allows users to view live match scores, league standings, player stats and club profiles. Admins can manage teams, players and matches in real time.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21, TypeScript, CSS |
| Backend | Python, Flask, Flask-CORS |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |

---

## ⚙️ Setup & Installation

### Backend (Flask)

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

Backend runs on: http://127.0.0.1:5000

### Frontend (Angular)

cd frontend/prem-league-app
npm install
ng serve

Frontend runs on: http://localhost:4200

---

## 🔑 Features

### User Features
- View live match scores
- Browse league table
- View team profiles and stats
- Browse all players
- View all fixtures and results
- Set favourite team
- Account settings

### Admin Features
- Admin dashboard with season overview
- Manage Teams — add, edit, delete
- Manage Players — add, edit, delete
- Manage Matches — schedule, go live, update score, full time

---

## 🧪 Testing

cd frontend/prem-league-app
npx vitest run

- 27 test files
- 73 tests — all passing

---

## 👤 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| User | user@test.com | user123 |
