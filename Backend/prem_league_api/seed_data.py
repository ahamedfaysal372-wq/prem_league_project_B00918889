import json
from datetime import datetime
from pathlib import Path
from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["prem_league_api"]

# Load dataset file
data_file = Path("data/league_dataset.json")
with data_file.open("r", encoding="utf-8") as f:
    dataset = json.load(f)

# Optional: clear old data first
db.teams.delete_many({})
db.players.delete_many({})
db.matches.delete_many({})

# -------------------------
# Insert teams
# -------------------------
team_name_to_id = {}

for team in dataset.get("teams", []):
    team_doc = {
        "name": team["name"],
        "short_name": team.get("short_name", team["name"][:3].upper()),
        "city": team["city"],
        "manager": team.get("manager", ""),
        "founded": team.get("founded"),
        "colours": team.get("colours", []),
        "stadium": {
            "name": team.get("stadium", ""),
            "capacity": team.get("capacity", 20000)
        },
        "stats": {
            "played": 0,
            "wins": 0,
            "draws": 0,
            "losses": 0,
            "gf": 0,
            "ga": 0,
            "points": 0
        },
        "created_at": datetime.utcnow()
    }

    result = db.teams.insert_one(team_doc)
    team_name_to_id[team["name"]] = result.inserted_id

# -------------------------
# Insert players
# Assign players across teams in round-robin style
# -------------------------
team_names = list(team_name_to_id.keys())

for index, player in enumerate(dataset.get("players", [])):
    team_name = team_names[index % len(team_names)]
    team_id = team_name_to_id[team_name]

    player_doc = {
        "name": player["name"],
        "position": player["position"],
        "nationality": player["nationality"],
        "age": player.get("age", 24),
        "squad_number": player.get("squad_number", (index % 30) + 1),
        "team_id": team_id,
        "stats": {
            "appearances": 0,
            "goals": 0,
            "assists": 0,
            "yellow_cards": 0,
            "red_cards": 0
        },
        "created_at": datetime.utcnow()
    }

    db.players.insert_one(player_doc)

# -------------------------
# Insert matches
# Convert team names to ObjectIds
# -------------------------
for match in dataset.get("matches", []):
    home_team_id = team_name_to_id.get(match["home_team"])
    away_team_id = team_name_to_id.get(match["away_team"])

    if not home_team_id or not away_team_id:
        continue

    match_doc = {
        "home_team_id": home_team_id,
        "away_team_id": away_team_id,
        "match_date": match["date"],
        "stadium": match.get("stadium", ""),
        "status": "scheduled",
        "score": None,
        "created_at": datetime.utcnow(),
        "finished_at": None
    }

    db.matches.insert_one(match_doc)

print("Seeding complete.")
print(f"Teams inserted: {db.teams.count_documents({})}")
print(f"Players inserted: {db.players.count_documents({})}")
print(f"Matches inserted: {db.matches.count_documents({})}")