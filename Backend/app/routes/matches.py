from flask import Blueprint, request
from datetime import datetime
from bson import ObjectId
from app.db import get_db
from app.utils import admin_required

matches_bp = Blueprint("matches", __name__)


# ------------------------
# Helper: calculate team stat increments
# ------------------------
def _team_stats_inc(home_goals: int, away_goals: int):
    home = {
        "stats.played": 1,
        "stats.gf": home_goals,
        "stats.ga": away_goals,
    }
    away = {
        "stats.played": 1,
        "stats.gf": away_goals,
        "stats.ga": home_goals,
    }
    if home_goals > away_goals:
        home.update({"stats.wins": 1, "stats.points": 3})
        away.update({"stats.losses": 1})
    elif home_goals < away_goals:
        away.update({"stats.wins": 1, "stats.points": 3})
        home.update({"stats.losses": 1})
    else:
        home.update({"stats.draws": 1, "stats.points": 1})
        away.update({"stats.draws": 1, "stats.points": 1})
    return home, away


# ------------------------
# CREATE MATCH (Admin only)
# ------------------------
@matches_bp.post("")
@admin_required
def create_match():
    db = get_db()
    body = request.get_json(silent=True) or {}

    home_team_id = body.get("home_team_id")
    away_team_id = body.get("away_team_id")
    match_date = body.get("match_date")
    stadium = (body.get("stadium") or "").strip()

    if not home_team_id or not away_team_id or not match_date:
        return {"error": "home_team_id, away_team_id, match_date required"}, 400

    if home_team_id == away_team_id:
        return {"error": "home and away teams must be different"}, 400

    try:
        home_oid = ObjectId(home_team_id)
        away_oid = ObjectId(away_team_id)
    except Exception:
        return {"error": "invalid team id"}, 400

    home_team = db.teams.find_one({"_id": home_oid})
    away_team = db.teams.find_one({"_id": away_oid})

    if not home_team or not away_team:
        return {"error": "one or both teams not found"}, 404

    existing = db.matches.find_one({
        "home_team_id": home_oid,
        "away_team_id": away_oid,
        "match_date": match_date,
        "status": "scheduled"
    })
    if existing:
        return {"error": "match already scheduled for these teams on this date"}, 409

    doc = {
        "home_team_id": home_oid,
        "away_team_id": away_oid,
        "match_date": match_date,
        "stadium": stadium or (home_team.get("stadium") or {}).get("name") or "",
        "status": "scheduled",
        "score": None,
        "created_at": datetime.utcnow(),
        "finished_at": None,
    }

    res = db.matches.insert_one(doc)
    return {"message": "match created", "match_id": str(res.inserted_id)}, 201


# ------------------------
# LIST MATCHES (Public)
# ------------------------
@matches_bp.get("")
def list_matches():
    db = get_db()
    status = request.args.get("status")
    team_id = request.args.get("team_id")

    query = {}
    if status:
        query["status"] = status.strip().lower()

    if team_id:
        try:
            tid = ObjectId(team_id)
        except Exception:
            return {"error": "invalid team_id"}, 400
        query["$or"] = [
            {"home_team_id": tid},
            {"away_team_id": tid}
        ]

    matches = []
    for m in db.matches.find(query).limit(100):
        m["_id"] = str(m["_id"])
        m["home_team_id"] = str(m["home_team_id"])
        m["away_team_id"] = str(m["away_team_id"])
        matches.append(m)

    return {"count": len(matches), "results": matches}, 200


# ------------------------
# GET SINGLE MATCH (Public)
# ------------------------
@matches_bp.get("/<match_id>")
def get_match(match_id):
    db = get_db()
    try:
        oid = ObjectId(match_id)
    except Exception:
        return {"error": "invalid match id"}, 400

    match = db.matches.find_one({"_id": oid})
    if not match:
        return {"error": "match not found"}, 404

    match["_id"] = str(match["_id"])
    match["home_team_id"] = str(match["home_team_id"])
    match["away_team_id"] = str(match["away_team_id"])
    return match, 200


# ------------------------
# START MATCH (Admin only)
# NEW - changes status to live
# ------------------------
@matches_bp.put("/<match_id>/start")
@admin_required
def start_match(match_id):
    db = get_db()
    try:
        oid = ObjectId(match_id)
    except Exception:
        return {"error": "invalid match id"}, 400

    match = db.matches.find_one({"_id": oid})
    if not match:
        return {"error": "match not found"}, 404

    if match.get("status") != "scheduled":
        return {"error": "only scheduled matches can be started"}, 409

    db.matches.update_one(
        {"_id": oid},
        {"$set": {
            "status": "live",
            "score": {"home_goals": 0, "away_goals": 0},
            "started_at": datetime.utcnow()
        }}
    )

    return {"message": "match is now live"}, 200


# ------------------------
# UPDATE LIVE SCORE (Admin only)
# NEW - updates score while match is live
# ------------------------
@matches_bp.put("/<match_id>/update-score")
@admin_required
def update_score(match_id):
    db = get_db()
    try:
        oid = ObjectId(match_id)
    except Exception:
        return {"error": "invalid match id"}, 400

    match = db.matches.find_one({"_id": oid})
    if not match:
        return {"error": "match not found"}, 404

    if match.get("status") != "live":
        return {"error": "match is not live"}, 409

    body = request.get_json(silent=True) or {}
    home_goals = body.get("home_goals")
    away_goals = body.get("away_goals")

    if not isinstance(home_goals, int) or not isinstance(away_goals, int):
        return {"error": "goals must be integers"}, 400

    if home_goals < 0 or away_goals < 0:
        return {"error": "goals cannot be negative"}, 400

    db.matches.update_one(
        {"_id": oid},
        {"$set": {
            "score": {
                "home_goals": home_goals,
                "away_goals": away_goals
            }
        }}
    )

    return {"message": "score updated", "score": {"home_goals": home_goals, "away_goals": away_goals}}, 200


# ------------------------
# FINISH MATCH (Admin only)
# ------------------------
@matches_bp.put("/<match_id>/finish")
@admin_required
def finish_match(match_id):
    db = get_db()
    try:
        oid = ObjectId(match_id)
    except Exception:
        return {"error": "invalid match id"}, 400

    body = request.get_json(silent=True) or {}
    home_goals = body.get("home_goals")
    away_goals = body.get("away_goals")

    if not isinstance(home_goals, int) or not isinstance(away_goals, int):
        return {"error": "goals must be integers"}, 400

    if home_goals < 0 or away_goals < 0:
        return {"error": "goals cannot be negative"}, 400

    match = db.matches.find_one({"_id": oid})
    if not match:
        return {"error": "match not found"}, 404

    if match.get("status") == "finished":
        return {"error": "match already finished"}, 409

    db.matches.update_one(
        {"_id": oid},
        {"$set": {
            "status": "finished",
            "score": {
                "home_goals": home_goals,
                "away_goals": away_goals
            },
            "finished_at": datetime.utcnow()
        }}
    )

    home_inc, away_inc = _team_stats_inc(home_goals, away_goals)
    db.teams.update_one({"_id": match["home_team_id"]}, {"$inc": home_inc})
    db.teams.update_one({"_id": match["away_team_id"]}, {"$inc": away_inc})

    return {"message": "match finished and team stats updated"}, 200


# ------------------------
# DELETE MATCH (Admin only)
# ------------------------
@matches_bp.delete("/<match_id>")
@admin_required
def delete_match(match_id):
    db = get_db()
    try:
        oid = ObjectId(match_id)
    except Exception:
        return {"error": "invalid match id"}, 400

    match = db.matches.find_one({"_id": oid})
    if not match:
        return {"error": "match not found"}, 404

    if match.get("status") == "finished":
        return {"error": "cannot delete finished matches"}, 409

    db.matches.delete_one({"_id": oid})
    return {"message": "match deleted"}, 200