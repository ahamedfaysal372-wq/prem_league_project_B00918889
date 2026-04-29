# ⚽ Football Premier League App

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Python-000000?style=for-the-badge&logo=flask&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**A full-stack Premier League web application**

*COM661 Coursework 2*

**Student:** Faysal Ahamed | **ID:** B00918889

</div>

---
## 📌 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [API Reference](#-api-reference)
- [Authentication Flow](#-authentication-flow)
- [Testing](#-testing)

---

## 🌐 Overview

A fully functional Premier League management platform where users can track live scores, standings, player stats and club profiles. Administrators have full CRUD control over teams, players and matches including a real-time live match feature.

---
---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────┐ │ CLIENT BROWSER │ │ │ │ ┌─────────────────────────────────────────────────┐ │ │ │ Angular 21 Frontend │ │ │ │ │ │ │ │ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │ │ │ │ │ Pages │ │ Services │ │ Guards │ │ │ │ │ │ Landing │ │ Teams │ │ authGuard │ │ │ │ │ │ Home │ │ Players │ │ adminGuard │ │ │ │ │ │ Teams │ │ Matches │ └──────────────┘ │ │ │ │ │ Players │ │ Auth │ │ │ │ │ │ Matches │ └──────────┘ │ │ │ │ │ Admin │ │ │ │ │ └──────────┘ │ │ │ └─────────────────────────────────────────────────┘ │ │ │ HTTP/REST │ └─────────────────────────│───────────────────────────────┘ │ ┌─────────────────────────▼───────────────────────────────┐ │ Flask REST API │ │ │ │ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │ │ │ /auth │ │ /teams │ │ /matches │ │ │ │ register │ │ GET │ │ GET / POST │ │ │ │ login │ │ POST │ │ start / score │ │ │ └──────────┘ │ PUT │ │ finish / delete │ │ │ │ DELETE │ └──────────────────────┘ │ │ ┌──────────┐ └──────────┘ │ │ │/players │ ┌──────────────────────────────────┐ │ │ │ GET │ │ JWT Middleware │ │ │ │ POST │ │ Token validation & role check │ │ │ │ PUT │ └──────────────────────────────────┘ │ │ │ DELETE │ │ │ └──────────┘ │ └─────────────────────────│───────────────────────────────┘ │ ┌─────────────────────────▼───────────────────────────────┐ │ MongoDB Atlas │ │ │ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────┐ │ │ │ users │ │ teams │ │ players │ │matches│ │ │ └──────────┘ └──────────┘ └──────────┘ └───────┘ │ └─────────────────────────────────────────────────────────┘


---## 🔐 Authentication Flow
User visits app │ ▼ Public route? (/, /login, /register) │ ┌──┴──┐ YES NO │ │ │ ▼ │ JWT token in localStorage? │ │ │ ┌──┴──┐ │ YES NO │ │ │ │ │ ▼ │ │ Redirect to / │ │ (Landing page) │ │ │ ▼ │ Decode token → check role │ │ │ ┌──┴──┐ │ ADMIN USER │ │ │ │ ▼ ▼ │ /admin /home │ ▼ Landing page shown


---

## ✨ Features

### 👤 User Features
| Feature | Description |
|---------|-------------|
| 🔐 Register / Login | JWT-based authentication |
| 🏠 Home Dashboard | Live scores, league table, fixtures |
| 📊 League Table | Real-time standings with goal difference |
| 🏟️ Team Profiles | Stadium, manager, squad stats |
| 🏃 Player Browser | Search, filter by position, full stats |
| ⚽ Match Centre | Fixtures, results, live scores |
| ⚙️ Account Settings | Update profile, set favourite team |

### ⚙️ Admin Features
| Feature | Description |
|---------|-------------|
| 📋 Dashboard | Season overview, live alert, bar chart |
| 🏟️ Manage Teams | Full CRUD for all clubs |
| 🏃 Manage Players | Full CRUD with position & team assignment |
| 📅 Manage Matches | Schedule → Go Live → Update Score → Full Time |

---
## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Angular 21 | SPA framework |
| Language | TypeScript | Type-safe development |
| Styling | CSS3 | Custom design system |
| Backend | Python + Flask | REST API |
| Database | MongoDB Atlas | NoSQL data storage |
| Auth | JWT | Stateless authentication |
| Testing | Vitest | Unit testing |

---

## 📁 Project Structure
prem_league_project_B00918889/ │ ├── 📁 Backend/ │ ├── app.py # Main Flask app & all routes │ ├── requirements.txt # Python dependencies │ └── .env # Environment variables (not committed) │ └── 📁 frontend/ └── prem-league-app/ └── src/ └── app/ ├── 📁 components/ │ ├── navbar/ # Top navigation bar │ └── footer/ # Site footer │ ├── 📁 pages/ │ ├── landing/ # Public landing page │ ├── login/ # Login page │ ├── register/ # Register page │ ├── home/ # Dashboard (auth) │ ├── teams/ # Teams listing │ ├── team-detail/ # Single team view │ ├── players/ # Players listing │ ├── matches/ # Fixtures & results │ ├── settings/ # Account settings │ └── admin/ │ ├── dashboard/ # Admin home │ ├── manage-teams/ # CRUD teams │ ├── manage-players/ # CRUD players │ └── manage-matches/ # CRUD matches │ ├── 📁 services/ │ ├── auth.ts # Auth service + JWT │ ├── teams.ts # Teams API calls │ ├── players.ts # Players API calls │ └── matches.ts # Matches API calls │ ├── 📁 guards/ │ └── auth-guard.ts # authGuard + adminGuard │ └── 📁 models/ ├── team.model.ts ├── player.model.ts └── match.model.ts


---## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account

### 1️⃣ Backend Setup

```bash
# Navigate to backend
cd Backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "JWT_SECRET=your_secret_key" >> .env

# Run the server
python app.py
```
✅ Backend running at `http://127.0.0.1:5000`

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend/prem-league-app

# Install dependencies
npm install

# Run development server
ng serve
```

✅ Frontend running at `http://localhost:4200`

---

## 📡 API Reference

### Auth Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login & get JWT token |

### Teams Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/teams` | ✅ User | Get all teams |
| GET | `/api/teams/:id` | ✅ User | Get single team |
| GET | `/api/teams/table` | ✅ User | Get league table |
| POST | `/api/teams` | 🔒 Admin | Create team |
| PUT | `/api/teams/:id` | 🔒 Admin | Update team |
| DELETE | `/api/teams/:id` | 🔒 Admin | Delete team |

### Players Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/players` | ✅ User | Get all players |
| GET | `/api/players/:id` | ✅ User | Get single player |
| POST | `/api/players` | 🔒 Admin | Create player |
| PUT | `/api/players/:id` | 🔒 Admin | Update player |
| DELETE | `/api/players/:id` | 🔒 Admin | Delete player |
### Matches Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/matches` | ✅ User | Get all matches |
| POST | `/api/matches` | 🔒 Admin | Schedule match |
| PUT | `/api/matches/:id/start` | 🔒 Admin | Go live |
| PUT | `/api/matches/:id/score` | 🔒 Admin | Update score |
| PUT | `/api/matches/:id/finish` | 🔒 Admin | Full time |
| DELETE | `/api/matches/:id` | 🔒 Admin | Delete match |

---

## 🧪 Testing

```bash
cd frontend/prem-league-app
npx vitest run
```
Test Files 27 passed (27) Tests 73 passed (73) Duration 2.95s


### Test Coverage
| Service | Tests |
|---------|-------|
| AuthService | ✅ |
| TeamsService | ✅ |
| PlayersService | ✅ |
| MatchesService | ✅ |
| Route Guards | ✅ |
| Components | ✅ |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Dark | `#0a1628` |
| Secondary Dark | `#0d1f3c` |
| Accent Green | `#10b981` |
| Danger Red | `#e63946` |
| Background | `#f8f9fb` |
| Font | Inter (Google Fonts) |

---

## 👤 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 🔒 Admin | admin@test.com | admin123 |
| 👤 User | user@test.com | user123 |

---
