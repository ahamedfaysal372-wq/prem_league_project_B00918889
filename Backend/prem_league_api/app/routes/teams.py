from flask import Blueprint, request
from datetime import datetime
from bson import ObjectId

from app.db import get_db
from app.utils import admin_required

teams_bp = Blueprint("teams", __name__)


# ------------------------
# CREATE TEAM (Admin only)
# ------------------------
@teams_bp.post("")
@admin_required
def create_team():
    db = get_db()
    body = request.get_json(silent=True) or {}

    name = (body.get("name") or "").strip()
    city = (body.get("city") or "").strip()
    stadium = body.get("stadium") or {}

    if not name or not city:
        return {"error": "name and city are required"}, 400

    doc = {
        "name": name,
        "short_name": (body.get("short_name") or "").strip(),
        "city": city,
        "founded": body.get("founded"),
        "manager": (body.get("manager") or "").strip(),
        "colours": body.get("colours") or [],
        "stadium": {
            "name": (stadium.get("name") or "").strip(),
            "capacity": int(stadium.get("capacity") or 0),
        },
        "stats": {
            "played": 0,
            "wins": 0,
            "draws": 0,
            "losses": 0,
            "gf": 0,
            "ga": 0,
            "points": 0,
        },
        "created_at": datetime.utcnow(),
    }

    res = db.teams.insert_one(doc)
    return {"message": "team created", "team_id": str(res.inserted_id)}, 201


# ------------------------
# LIST TEAMS (Public)
# ------------------------
@teams_bp.get("")
def list_teams():
    db = get_db()
    city = request.args.get("city")

    query = {}
    if city:
        query["city"] = city

    teams = []
    for team in db.teams.find(query).limit(200):
        team["_id"] = str(team["_id"])
        teams.append(team)

    return {"count": len(teams), "results": teams}, 200


# ------------------------
# LEAGUE TABLE (Public)
# !! Must be BEFORE /<team_id> route !!
# ------------------------
@teams_bp.get("/table")
def league_table():
    db = get_db()

    teams = list(db.teams.find())

    table = []
    for t in teams:
        stats = t.get("stats", {})
        played = stats.get("played", 0)
        wins = stats.get("wins", 0)
        draws = stats.get("draws", 0)
        losses = stats.get("losses", 0)
        gf = stats.get("gf", 0)
        ga = stats.get("ga", 0)
        points = stats.get("points", 0)

        table.append({
            "team_id": str(t["_id"]),
            "name": t["name"],
            "played": played,
            "wins": wins,
            "draws": draws,
            "losses": losses,
            "gf": gf,
            "ga": ga,
            "gd": gf - ga,
            "points": points
        })

    table.sort(
        key=lambda x: (x["points"], x["gd"], x["gf"]),
        reverse=True
    )

    return {"table": table}, 200


# ------------------------
# GET SINGLE TEAM (Public)
# ------------------------
@teams_bp.get("/<team_id>")
def get_team(team_id):
    db = get_db()
    try:
        oid = ObjectId(team_id)
    except Exception:
        return {"error": "invalid team id"}, 400

    team = db.teams.find_one({"_id": oid})
    if not team:
        return {"error": "team not found"}, 404

    team["_id"] = str(team["_id"])
    return team, 200


# ------------------------
# UPDATE TEAM (Admin only)
# ------------------------
@teams_bp.put("/<team_id>")
@admin_required
def update_team(team_id):
    db = get_db()

    try:
        oid = ObjectId(team_id)
    except Exception:
        return {"error": "invalid team id"}, 400

    body = request.get_json(silent=True) or {}

    allowed_fields = [
        "name",
        "short_name",
        "city",
        "founded",
        "manager",
        "colours",
        "stadium",
    ]

    update_fields = {}
    for field in allowed_fields:
        if field in body:
            update_fields[field] = body[field]

    if not update_fields:
        return {"error": "no valid fields to update"}, 400

    result = db.teams.update_one({"_id": oid}, {"$set": update_fields})

    if result.matched_count == 0:
        return {"error": "team not found"}, 404

    return {"message": "team updated"}, 200


# ------------------------
# DELETE TEAM (Admin only)
# ------------------------
@teams_bp.delete("/<team_id>")
@admin_required
def delete_team(team_id):
    db = get_db()

    try:
        oid = ObjectId(team_id)
    except Exception:
        return {"error": "invalid team id"}, 400

    result = db.teams.delete_one({"_id": oid})

    if result.deleted_count == 0:
        return {"error": "team not found"}, 404

    return {"message": "team deleted"}, 200