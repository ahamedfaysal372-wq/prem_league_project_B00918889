from pymongo import MongoClient
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client[os.getenv("MONGO_DB", "prem_league_api")]

print("Connected to MongoDB...")

# ─────────────────────────────────────────
# STEP 1: Update team stats realistically
# ─────────────────────────────────────────

team_stats = {
    "Dublin City FC":      {"played": 28, "wins": 20, "draws": 5, "losses": 3, "gf": 62, "ga": 28, "points": 65},
    "Manchester City":     {"played": 28, "wins": 18, "draws": 4, "losses": 6, "gf": 58, "ga": 30, "points": 58},
    "Arsenal FC":          {"played": 28, "wins": 17, "draws": 5, "losses": 6, "gf": 54, "ga": 29, "points": 56},
    "Liverpool FC":        {"played": 28, "wins": 16, "draws": 6, "losses": 6, "gf": 55, "ga": 32, "points": 54},
    "Chelsea FC":          {"played": 28, "wins": 15, "draws": 5, "losses": 8, "gf": 48, "ga": 35, "points": 50},
    "Tottenham Hotspur":   {"played": 28, "wins": 14, "draws": 4, "losses": 10, "gf": 45, "ga": 40, "points": 46},
    "Newcastle United":    {"played": 28, "wins": 12, "draws": 6, "losses": 10, "gf": 42, "ga": 38, "points": 42},
    "Leeds United":        {"played": 28, "wins": 11, "draws": 5, "losses": 12, "gf": 38, "ga": 44, "points": 38},
    "Everton FC":          {"played": 28, "wins": 9,  "draws": 6, "losses": 13, "gf": 32, "ga": 48, "points": 33},
    "Belfast FC":          {"played": 28, "wins": 8,  "draws": 4, "losses": 16, "gf": 28, "ga": 55, "points": 28},
    "London United":       {"played": 28, "wins": 5,  "draws": 4, "losses": 19, "gf": 22, "ga": 62, "points": 19},
}

for team_name, stats in team_stats.items():
    stats["gd"] = stats["gf"] - stats["ga"]
    result = db.teams.update_one(
        {"name": team_name},
        {"$set": {"stats": stats}}
    )
    if result.matched_count:
        print(f"  ✅ Updated stats: {team_name}")
    else:
        print(f"  ⚠️  Team not found: {team_name}")

# ─────────────────────────────────────────
# STEP 2: Get team IDs into a map
# ─────────────────────────────────────────

teams = list(db.teams.find())
team_map = {t["name"]: t["_id"] for t in teams}
print(f"\nFound {len(team_map)} teams in database")

# ─────────────────────────────────────────
# STEP 3: Add realistic finished matches
# ─────────────────────────────────────────

# Clear old dummy scheduled matches first (optional - comment out if you want to keep them)
db.matches.delete_many({"status": "scheduled", "stadium": ""})
print("\nCleared empty scheduled matches")

finished_matches = [
    ("Dublin City FC",    "Arsenal FC",        3, 1, "2026-01-10T15:00:00Z", "River Park"),
    ("Manchester City",   "Chelsea FC",        2, 2, "2026-01-11T15:00:00Z", "Etihad Arena"),
    ("Liverpool FC",      "Leeds United",      4, 0, "2026-01-12T15:00:00Z", "Anfield Park"),
    ("Tottenham Hotspur", "Everton FC",        2, 1, "2026-01-13T15:00:00Z", "Tottenham Stadium"),
    ("Arsenal FC",        "Newcastle United",  1, 1, "2026-01-17T15:00:00Z", "Emirates Field"),
    ("Chelsea FC",        "Belfast FC",        3, 0, "2026-01-18T15:00:00Z", "Bridge Stadium"),
    ("Dublin City FC",    "Manchester City",   2, 1, "2026-01-24T15:00:00Z", "River Park"),
    ("Leeds United",      "Tottenham Hotspur", 0, 2, "2026-01-25T15:00:00Z", "Elland Road"),
    ("Liverpool FC",      "Arsenal FC",        2, 2, "2026-01-31T15:00:00Z", "Anfield Park"),
    ("Newcastle United",  "Chelsea FC",        1, 0, "2026-02-01T15:00:00Z", "St James Park"),
    ("Everton FC",        "Dublin City FC",    0, 3, "2026-02-07T15:00:00Z", "Goodison Park"),
    ("Manchester City",   "Liverpool FC",      3, 1, "2026-02-08T15:00:00Z", "Etihad Arena"),
    ("Arsenal FC",        "Chelsea FC",        2, 0, "2026-02-14T15:00:00Z", "Emirates Field"),
    ("Dublin City FC",    "Tottenham Hotspur", 4, 1, "2026-02-15T15:00:00Z", "River Park"),
    ("Belfast FC",        "Leeds United",      1, 2, "2026-02-21T15:00:00Z", "Harbour Park"),
    ("Liverpool FC",      "Everton FC",        3, 0, "2026-02-22T15:00:00Z", "Anfield Park"),
    ("Chelsea FC",        "Manchester City",   1, 2, "2026-02-28T15:00:00Z", "Bridge Stadium"),
    ("Newcastle United",  "Dublin City FC",    0, 2, "2026-03-01T15:00:00Z", "St James Park"),
    ("Tottenham Hotspur", "Arsenal FC",        1, 3, "2026-03-07T15:00:00Z", "Tottenham Stadium"),
    ("Manchester City",   "Leeds United",      5, 0, "2026-03-08T15:00:00Z", "Etihad Arena"),
    ("Dublin City FC",    "Liverpool FC",      2, 1, "2026-03-14T15:00:00Z", "River Park"),
    ("Arsenal FC",        "Everton FC",        3, 1, "2026-03-15T15:00:00Z", "Emirates Field"),
    ("Chelsea FC",        "London United",     4, 0, "2026-03-21T15:00:00Z", "Bridge Stadium"),
    ("Belfast FC",        "Everton FC",        0, 1, "2026-03-22T15:00:00Z", "Harbour Park"),
    ("Liverpool FC",      "Tottenham Hotspur", 2, 0, "2026-03-28T15:00:00Z", "Anfield Park"),
]

inserted_matches = 0
for home, away, hg, ag, date, stadium in finished_matches:
    home_id = team_map.get(home)
    away_id = team_map.get(away)
    if not home_id or not away_id:
        print(f"  ⚠️  Skipping match - team not found: {home} vs {away}")
        continue

    # Check if match already exists
    existing = db.matches.find_one({
        "home_team_id": home_id,
        "away_team_id": away_id,
        "match_date": date
    })
    if existing:
        print(f"  ⏭️  Already exists: {home} vs {away}")
        continue

    db.matches.insert_one({
        "home_team_id": home_id,
        "away_team_id": away_id,
        "match_date": date,
        "stadium": stadium,
        "status": "finished",
        "score": {"home_goals": hg, "away_goals": ag},
        "created_at": datetime.utcnow(),
        "finished_at": datetime.utcnow(),
    })
    inserted_matches += 1
    print(f"  ✅ Added match: {home} {hg}-{ag} {away}")

print(f"\nInserted {inserted_matches} finished matches")

# ─────────────────────────────────────────
# STEP 4: Add upcoming scheduled matches
# ─────────────────────────────────────────

upcoming_matches = [
    ("Arsenal FC",        "Dublin City FC",    "2026-04-26T15:00:00Z", "Emirates Field"),
    ("Liverpool FC",      "Manchester City",   "2026-04-27T15:00:00Z", "Anfield Park"),
    ("Chelsea FC",        "Tottenham Hotspur", "2026-04-28T15:00:00Z", "Bridge Stadium"),
    ("Newcastle United",  "Arsenal FC",        "2026-05-02T15:00:00Z", "St James Park"),
    ("Dublin City FC",    "Chelsea FC",        "2026-05-03T15:00:00Z", "River Park"),
    ("Leeds United",      "Liverpool FC",      "2026-05-09T15:00:00Z", "Elland Road"),
]

inserted_upcoming = 0
for home, away, date, stadium in upcoming_matches:
    home_id = team_map.get(home)
    away_id = team_map.get(away)
    if not home_id or not away_id:
        continue

    existing = db.matches.find_one({
        "home_team_id": home_id,
        "away_team_id": away_id,
        "match_date": date
    })
    if existing:
        continue

    db.matches.insert_one({
        "home_team_id": home_id,
        "away_team_id": away_id,
        "match_date": date,
        "stadium": stadium,
        "status": "scheduled",
        "score": None,
        "created_at": datetime.utcnow(),
        "finished_at": None,
    })
    inserted_upcoming += 1
    print(f"  ✅ Added upcoming: {home} vs {away}")

print(f"Inserted {inserted_upcoming} upcoming matches")

# ─────────────────────────────────────────
# STEP 5: Add players per team
# ─────────────────────────────────────────

players_data = {
    "Dublin City FC": [
        {"name": "Liam Murphy",      "position": "GK", "nationality": "Irish",   "age": 28, "squad_number": 1,  "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 1, "red_cards": 0}},
        {"name": "Sean O'Brien",     "position": "DF", "nationality": "Irish",   "age": 25, "squad_number": 5,  "stats": {"appearances": 26, "goals": 2,  "assists": 3,  "yellow_cards": 4, "red_cards": 0}},
        {"name": "Conor Walsh",      "position": "MF", "nationality": "Irish",   "age": 24, "squad_number": 8,  "stats": {"appearances": 27, "goals": 8,  "assists": 10, "yellow_cards": 3, "red_cards": 0}},
        {"name": "Patrick Doyle",    "position": "FW", "nationality": "Irish",   "age": 26, "squad_number": 9,  "stats": {"appearances": 28, "goals": 22, "assists": 6,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "James Brennan",    "position": "MF", "nationality": "Irish",   "age": 23, "squad_number": 10, "stats": {"appearances": 25, "goals": 5,  "assists": 12, "yellow_cards": 2, "red_cards": 0}},
    ],
    "Manchester City": [
        {"name": "Ederson Silva",    "position": "GK", "nationality": "Brazilian","age": 30, "squad_number": 1,  "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 0, "red_cards": 0}},
        {"name": "Ruben Santos",     "position": "DF", "nationality": "Portuguese","age": 27,"squad_number": 3,  "stats": {"appearances": 25, "goals": 1,  "assists": 4,  "yellow_cards": 3, "red_cards": 0}},
        {"name": "Kevin De Groot",   "position": "MF", "nationality": "Belgian", "age": 32, "squad_number": 17, "stats": {"appearances": 26, "goals": 9,  "assists": 15, "yellow_cards": 1, "red_cards": 0}},
        {"name": "Erling Larsen",    "position": "FW", "nationality": "Norwegian","age": 24, "squad_number": 9,  "stats": {"appearances": 27, "goals": 25, "assists": 5,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Phil Foden Jr",    "position": "MF", "nationality": "English", "age": 24, "squad_number": 47, "stats": {"appearances": 24, "goals": 7,  "assists": 9,  "yellow_cards": 1, "red_cards": 0}},
    ],
    "Arsenal FC": [
        {"name": "David Raya",       "position": "GK", "nationality": "Spanish", "age": 29, "squad_number": 22, "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 1, "red_cards": 0}},
        {"name": "Ben White",        "position": "DF", "nationality": "English", "age": 26, "squad_number": 4,  "stats": {"appearances": 27, "goals": 2,  "assists": 5,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Martin Odegaard",  "position": "MF", "nationality": "Norwegian","age": 26, "squad_number": 8,  "stats": {"appearances": 26, "goals": 10, "assists": 13, "yellow_cards": 2, "red_cards": 0}},
        {"name": "Bukayo Saka",      "position": "FW", "nationality": "English", "age": 23, "squad_number": 7,  "stats": {"appearances": 27, "goals": 14, "assists": 11, "yellow_cards": 1, "red_cards": 0}},
        {"name": "Gabriel Jesus",    "position": "FW", "nationality": "Brazilian","age": 27, "squad_number": 9,  "stats": {"appearances": 20, "goals": 8,  "assists": 4,  "yellow_cards": 3, "red_cards": 0}},
    ],
    "Liverpool FC": [
        {"name": "Alisson Becker",   "position": "GK", "nationality": "Brazilian","age": 31, "squad_number": 1,  "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 0, "red_cards": 0}},
        {"name": "Virgil Van Dijk",  "position": "DF", "nationality": "Dutch",   "age": 32, "squad_number": 4,  "stats": {"appearances": 26, "goals": 3,  "assists": 1,  "yellow_cards": 3, "red_cards": 0}},
        {"name": "Alexis Mac Allister","position":"MF", "nationality": "Argentine","age": 25,"squad_number": 10, "stats": {"appearances": 27, "goals": 7,  "assists": 8,  "yellow_cards": 4, "red_cards": 0}},
        {"name": "Mohamed Salah",    "position": "FW", "nationality": "Egyptian","age": 32, "squad_number": 11, "stats": {"appearances": 28, "goals": 20, "assists": 12, "yellow_cards": 1, "red_cards": 0}},
        {"name": "Darwin Nunez",     "position": "FW", "nationality": "Uruguayan","age": 25, "squad_number": 9,  "stats": {"appearances": 24, "goals": 12, "assists": 5,  "yellow_cards": 3, "red_cards": 1}},
    ],
    "Chelsea FC": [
        {"name": "Robert Sanchez",   "position": "GK", "nationality": "Spanish", "age": 26, "squad_number": 1,  "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Reece James",      "position": "DF", "nationality": "English", "age": 24, "squad_number": 24, "stats": {"appearances": 20, "goals": 1,  "assists": 6,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Enzo Fernandez",   "position": "MF", "nationality": "Argentine","age": 23, "squad_number": 8,  "stats": {"appearances": 26, "goals": 5,  "assists": 7,  "yellow_cards": 5, "red_cards": 0}},
        {"name": "Cole Palmer",      "position": "MF", "nationality": "English", "age": 22, "squad_number": 20, "stats": {"appearances": 27, "goals": 16, "assists": 10, "yellow_cards": 1, "red_cards": 0}},
        {"name": "Nicolas Jackson",  "position": "FW", "nationality": "Senegalese","age": 23,"squad_number": 15, "stats": {"appearances": 25, "goals": 13, "assists": 4,  "yellow_cards": 4, "red_cards": 1}},
    ],
    "Tottenham Hotspur": [
        {"name": "Guglielmo Vicario","position": "GK", "nationality": "Italian", "age": 27, "squad_number": 13, "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 1, "red_cards": 0}},
        {"name": "Pedro Porro",      "position": "DF", "nationality": "Spanish", "age": 24, "squad_number": 23, "stats": {"appearances": 26, "goals": 2,  "assists": 7,  "yellow_cards": 3, "red_cards": 0}},
        {"name": "James Maddison",   "position": "MF", "nationality": "English", "age": 27, "squad_number": 10, "stats": {"appearances": 24, "goals": 8,  "assists": 9,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Son Heung-min",    "position": "FW", "nationality": "South Korean","age": 32,"squad_number": 7,"stats": {"appearances": 27, "goals": 14, "assists": 8,  "yellow_cards": 1, "red_cards": 0}},
        {"name": "Dominic Solanke",  "position": "FW", "nationality": "English", "age": 27, "squad_number": 9,  "stats": {"appearances": 26, "goals": 10, "assists": 3,  "yellow_cards": 3, "red_cards": 0}},
    ],
    "Newcastle United": [
        {"name": "Nick Pope",        "position": "GK", "nationality": "English", "age": 32, "squad_number": 22, "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 0, "red_cards": 0}},
        {"name": "Kieran Trippier",  "position": "DF", "nationality": "English", "age": 33, "squad_number": 2,  "stats": {"appearances": 24, "goals": 2,  "assists": 8,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Bruno Guimaraes",  "position": "MF", "nationality": "Brazilian","age": 26, "squad_number": 39, "stats": {"appearances": 27, "goals": 6,  "assists": 7,  "yellow_cards": 5, "red_cards": 0}},
        {"name": "Alexander Isak",   "position": "FW", "nationality": "Swedish", "age": 25, "squad_number": 14, "stats": {"appearances": 26, "goals": 18, "assists": 4,  "yellow_cards": 1, "red_cards": 0}},
        {"name": "Harvey Barnes",    "position": "FW", "nationality": "English", "age": 26, "squad_number": 15, "stats": {"appearances": 22, "goals": 7,  "assists": 5,  "yellow_cards": 1, "red_cards": 0}},
    ],
    "Leeds United": [
        {"name": "Illan Meslier",    "position": "GK", "nationality": "French",  "age": 24, "squad_number": 1,  "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 1, "red_cards": 0}},
        {"name": "Pascal Struijk",   "position": "DF", "nationality": "Dutch",   "age": 25, "squad_number": 5,  "stats": {"appearances": 25, "goals": 1,  "assists": 2,  "yellow_cards": 5, "red_cards": 1}},
        {"name": "Ethan Nwaneri",    "position": "MF", "nationality": "English", "age": 18, "squad_number": 8,  "stats": {"appearances": 22, "goals": 4,  "assists": 6,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Georginio Rutter", "position": "FW", "nationality": "French",  "age": 22, "squad_number": 7,  "stats": {"appearances": 26, "goals": 9,  "assists": 7,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Patrick Bamford",  "position": "FW", "nationality": "English", "age": 31, "squad_number": 9,  "stats": {"appearances": 18, "goals": 6,  "assists": 2,  "yellow_cards": 1, "red_cards": 0}},
    ],
    "Everton FC": [
        {"name": "Jordan Pickford",  "position": "GK", "nationality": "English", "age": 30, "squad_number": 1,  "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 1, "red_cards": 0}},
        {"name": "Seamus Coleman",   "position": "DF", "nationality": "Irish",   "age": 35, "squad_number": 23, "stats": {"appearances": 20, "goals": 0,  "assists": 2,  "yellow_cards": 3, "red_cards": 0}},
        {"name": "Abdoulaye Doucoure","position": "MF","nationality": "French",  "age": 31, "squad_number": 16, "stats": {"appearances": 25, "goals": 4,  "assists": 3,  "yellow_cards": 6, "red_cards": 1}},
        {"name": "Dominic Calvert-Lewin","position":"FW","nationality":"English","age": 27, "squad_number": 9,  "stats": {"appearances": 22, "goals": 8,  "assists": 2,  "yellow_cards": 1, "red_cards": 0}},
        {"name": "Jarrad Branthwaite","position": "DF","nationality": "English", "age": 22, "squad_number": 32, "stats": {"appearances": 26, "goals": 2,  "assists": 1,  "yellow_cards": 4, "red_cards": 0}},
    ],
    "Belfast FC": [
        {"name": "Michael O'Neill",  "position": "GK", "nationality": "Irish",   "age": 26, "squad_number": 1,  "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Ryan McAllister",  "position": "DF", "nationality": "Irish",   "age": 23, "squad_number": 5,  "stats": {"appearances": 25, "goals": 1,  "assists": 1,  "yellow_cards": 6, "red_cards": 1}},
        {"name": "Thomas Hughes",    "position": "MF", "nationality": "Irish",   "age": 24, "squad_number": 8,  "stats": {"appearances": 26, "goals": 3,  "assists": 4,  "yellow_cards": 5, "red_cards": 0}},
        {"name": "Ciaran McMahon",   "position": "FW", "nationality": "Irish",   "age": 25, "squad_number": 9,  "stats": {"appearances": 27, "goals": 7,  "assists": 2,  "yellow_cards": 3, "red_cards": 0}},
        {"name": "Aaron Kelly",      "position": "MF", "nationality": "Irish",   "age": 22, "squad_number": 11, "stats": {"appearances": 20, "goals": 2,  "assists": 3,  "yellow_cards": 2, "red_cards": 0}},
    ],
    "London United": [
        {"name": "James Carter",     "position": "GK", "nationality": "English", "age": 25, "squad_number": 1,  "stats": {"appearances": 28, "goals": 0,  "assists": 0,  "yellow_cards": 2, "red_cards": 0}},
        {"name": "Marcus Reid",      "position": "DF", "nationality": "English", "age": 24, "squad_number": 4,  "stats": {"appearances": 24, "goals": 0,  "assists": 1,  "yellow_cards": 7, "red_cards": 1}},
        {"name": "Danny Cooper",     "position": "MF", "nationality": "English", "age": 26, "squad_number": 8,  "stats": {"appearances": 25, "goals": 2,  "assists": 2,  "yellow_cards": 6, "red_cards": 0}},
        {"name": "Kyle Thompson",    "position": "FW", "nationality": "English", "age": 23, "squad_number": 9,  "stats": {"appearances": 26, "goals": 5,  "assists": 1,  "yellow_cards": 3, "red_cards": 1}},
        {"name": "Ryan Foster",      "position": "DF", "nationality": "English", "age": 27, "squad_number": 6,  "stats": {"appearances": 22, "goals": 0,  "assists": 0,  "yellow_cards": 5, "red_cards": 0}},
    ],
}

inserted_players = 0
for team_name, players in players_data.items():
    team_id = team_map.get(team_name)
    if not team_id:
        print(f"  ⚠️  Team not found for players: {team_name}")
        continue
    for p in players:
        existing = db.players.find_one({"name": p["name"], "team_id": team_id})
        if existing:
            print(f"  ⏭️  Player exists: {p['name']}")
            continue
        db.players.insert_one({
            "name": p["name"],
            "position": p["position"],
            "nationality": p["nationality"],
            "age": p["age"],
            "squad_number": p["squad_number"],
            "team_id": team_id,
            "stats": p["stats"],
            "created_at": datetime.utcnow(),
        })
        inserted_players += 1
        print(f"  ✅ Added player: {p['name']} ({team_name})")

print(f"\nInserted {inserted_players} players")

print("\n🎉 Database seeding complete!")
print(f"   Teams updated: {len(team_stats)}")
print(f"   Matches added: {inserted_matches}")
print(f"   Upcoming added: {inserted_upcoming}")
print(f"   Players added: {inserted_players}")