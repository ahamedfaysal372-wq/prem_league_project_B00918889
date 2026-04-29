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
| Hosting | Local / Azure App Service |

---

## 📁 Project Structure
prem_league_project_B00918889/
├── frontend/                  # Angular 21 application
│   └── prem-league-app/
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/    # Navbar, Footer
│       │   │   ├── pages/         # All page components
│       │   │   ├── services/      # API services
│       │   │   ├── models/        # TypeScript interfaces
│       │   │   └── guards/        # Auth & Admin guards
│       │   ├── styles.css
│       │   └── index.html
│       └── package.json
│
└── backend/                   # Flask REST API
├── app.py                 # Main application & routes
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables (not committed)
---

## ⚙️ Setup & Installation

### Backend (Flask)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

Backend runs on: `http://127.0.0.1:5000`

### Frontend (Angular)

```bash
# Navigate to frontend
cd frontend/prem-league-app

# Install dependencies
npm install

# Run the development server
ng serve
```

Frontend runs on: `http://localhost:4200`

---

## 🔑 Features

### Public (No Login Required)
- Landing page with live stats
- Register & Login

### User Features
- View live match scores
- Browse league table
- View team profiles & stats
- Browse all players
- View all fixtures & results
- Set favourite team
- Account settings

### Admin Features
- Admin dashboard with season overview
- Manage Teams — add, edit, delete
- Manage Players — add, edit, delete
- Manage Matches — schedule, go live, update score, full time

---

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (user / admin)
- Protected routes via Angular route guards

---

## 🧪 Testing

```bash
cd frontend/prem-league-app
npx vitest run
```

- **27 test files**
- **73 tests — all passing**

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | Get all teams |
| GET | `/api/teams/:id` | Get single team |
| POST | `/api/teams` | Create team (admin) |
| PUT | `/api/teams/:id` | Update team (admin) |
| DELETE | `/api/teams/:id` | Delete team (admin) |
| GET | `/api/teams/table` | Get league table |

### Players
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players` | Get all players |
| POST | `/api/players` | Create player (admin) |
| PUT | `/api/players/:id` | Update player (admin) |
| DELETE | `/api/players/:id` | Delete player (admin) |

### Matches
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches` | Get all matches |
| POST | `/api/matches` | Create match (admin) |
| PUT | `/api/matches/:id/start` | Go live (admin) |
| PUT | `/api/matches/:id/score` | Update score (admin) |
| PUT | `/api/matches/:id/finish` | Full time (admin) |
| DELETE | `/api/matches/:id` | Delete match (admin) |

---

## 🎨 Design

- Inspired by BBC Sport, Sky Sports and the official Premier League website
- Dark navy (`#0a1628`) and emerald green (`#10b981`) colour scheme
- Inter font family
- Fully responsive layout
- Smooth hover animations throughout

---

## 👤 Default Credentials (for testing)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| User | user@test.com | user123 |

---

## 📝 Notes

- MongoDB connection string stored in `.env` file (not committed to repo)
- Make sure MongoDB is running before starting the backend
- Angular requires Node.js 18+