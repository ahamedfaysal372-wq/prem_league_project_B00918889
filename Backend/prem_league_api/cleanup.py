from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client[os.getenv("MONGO_DB", "prem_league_api")]

# Teams to keep - your 11 real teams
keep_teams = [
    "Dublin City FC",
    "Manchester City", 
    "Arsenal FC",
    "Liverpool FC",
    "Chelsea FC",
    "Tottenham Hotspur",
    "Newcastle United",
    "Leeds United",
    "Everton FC",
    "Belfast FC",
    "London United",
]

# Delete all teams NOT in the keep list
result = db.teams.delete_many({"name": {"$nin": keep_teams}})
print(f"Deleted {result.deleted_count} unwanted teams")

# For teams in keep list, keep only the FIRST one (oldest) and delete duplicates
for team_name in keep_teams:
    teams = list(db.teams.find({"name": team_name}).sort("created_at", 1))
    if len(teams) > 1:
        # Keep first, delete rest
        ids_to_delete = [t["_id"] for t in teams[1:]]
        db.teams.delete_many({"_id": {"$in": ids_to_delete}})
        print(f"Removed {len(ids_to_delete)} duplicate(s) of {team_name}")
    else:
        print(f"OK: {team_name}")

# Also clean up matches that reference deleted team IDs
valid_team_ids = [t["_id"] for t in db.teams.find({"name": {"$in": keep_teams}})]
result = db.matches.delete_many({
    "$or": [
        {"home_team_id": {"$nin": valid_team_ids}},
        {"away_team_id": {"$nin": valid_team_ids}}
    ]
})
print(f"Cleaned up {result.deleted_count} orphaned matches")

print("\nDone! Current teams:")
for t in db.teams.find().sort("stats.points", -1):
    print(f"  {t['name']} - {t.get('stats', {}).get('points', 0)} pts")