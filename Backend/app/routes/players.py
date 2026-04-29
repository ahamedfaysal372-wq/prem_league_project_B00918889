from flask import Blueprint, request
from datetime import datetime
from bson import ObjectId
import re

from app.db import get_db
from app.utils import admin_required

players_bp = Blueprint("players", __name__)

ALLOWED_POSITIONS = {"GK", "DF", "MF", "FW"}


# ------------------------
# CREATE PLAYER (Admin only)
# ------------------------
@players_bp.post("")
@admin_required
def create_player():
    db = get_db()
    body = request.get_json(silent=True) or {}

    name = (body.get("name") or "").strip()
    position = (body.get("position") or "").strip().upper()
    nationality = (body.get("nationality") or "").strip()
    age = body.get("age")
    squad_number = body.get("squad_number")
    team_id = body.get("team_id")

    if not name or position not in ALLOWED_POSITIONS or not nationality or not team_id:
        return {"error": "name, nationality, team_id required and position must be GK/DF/MF/FW"}, 400

    try:
        team_oid = ObjectId(team_id)
    except Exception:
        return {"error": "invalid team_id"}, 400

    if not db.teams.find_one({"_id": team_oid}):
        return {"error": "team not found"}, 404

    doc = {
        "name": name,
        "position": position,
        "nationality": nationality,
        "age": age,
        "squad_number": squad_number,
        "team_id": team_oid,
        "stats": body.get("stats") or {
            "appearances": 0,
            "goals": 0,
            "assists": 0,
            "yellow_cards": 0,
            "red_cards": 0,
        },
        "created_at": datetime.utcnow(),
    }

    res = db.players.insert_one(doc)
    return {"message": "player created", "player_id": str(res.inserted_id)}, 201


# ------------------------
# LIST PLAYERS (Public)
# ------------------------
@players_bp.get("")
def list_players():
    db = get_db()

    query = {}
    team_id = request.args.get("team_id")
    position = request.args.get("position")
    q = request.args.get("q")

    if team_id:
        try:
            query["team_id"] = ObjectId(team_id)
        except Exception:
            return {"error": "invalid team_id"}, 400

    if position:
        pos = position.strip().upper()
        if pos not in ALLOWED_POSITIONS:
            return {"error": "position must be GK/DF/MF/FW"}, 400
        query["position"] = pos

    if q:
        query["name"] = {"$regex": re.escape(q.strip()), "$options": "i"}

    try:
        page = int(request.args.get("page", 1))
    except ValueError:
        return {"error": "page must be an integer"}, 400

    try:
        limit = int(request.args.get("limit", 20))
    except ValueError:
        return {"error": "limit must be an integer"}, 400

    if page < 1:
        return {"error": "page must be >= 1"}, 400

    if limit < 1 or limit > 200:
        return {"error": "limit must be between 1 and 200"}, 400

    skip = (page - 1) * limit
    total = db.players.count_documents(query)
    total_pages = (total + limit - 1) // limit if total > 0 else 0

    players = []
    cursor = db.players.find(query).skip(skip).limit(limit)
    for p in cursor:
        p["_id"] = str(p["_id"])
        p["team_id"] = str(p["team_id"])
        players.append(p)

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages,
        "count": len(players),
        "results": players
    }, 200


# ------------------------
# GET SINGLE PLAYER (Public)
# ------------------------
@players_bp.get("/<player_id>")
def get_player(player_id):
    db = get_db()
    try:
        oid = ObjectId(player_id)
    except Exception:
        return {"error": "invalid player id"}, 400

    p = db.players.find_one({"_id": oid})
    if not p:
        return {"error": "player not found"}, 404

    p["_id"] = str(p["_id"])
    p["team_id"] = str(p["team_id"])
    return p, 200


# ------------------------
# UPDATE PLAYER (Admin only)
# ------------------------
@players_bp.put("/<player_id>")
@admin_required
def update_player(player_id):
    db = get_db()
    try:
        oid = ObjectId(player_id)
    except Exception:
        return {"error": "invalid player id"}, 400

    body = request.get_json(silent=True) or {}

    allowed_fields = ["name", "position", "nationality", "age", "squad_number", "team_id", "stats"]
    update_fields = {}
    for field in allowed_fields:
        if field in body:
            update_fields[field] = body[field]

    if "position" in update_fields:
        pos = (update_fields["position"] or "").strip().upper()
        if pos not in ALLOWED_POSITIONS:
            return {"error": "position must be GK/DF/MF/FW"}, 400
        update_fields["position"] = pos

    if "team_id" in update_fields:
        try:
            team_oid = ObjectId(update_fields["team_id"])
        except Exception:
            return {"error": "invalid team_id"}, 400
        if not db.teams.find_one({"_id": team_oid}):
            return {"error": "team not found"}, 404
        update_fields["team_id"] = team_oid

    if not update_fields:
        return {"error": "no valid fields to update"}, 400

    result = db.players.update_one({"_id": oid}, {"$set": update_fields})

    if result.matched_count == 0:
        return {"error": "player not found"}, 404

    return {"message": "player updated"}, 200


# ------------------------
# DELETE PLAYER (Admin only)
# ------------------------
@players_bp.delete("/<player_id>")
@admin_required
def delete_player(player_id):
    db = get_db()
    try:
        oid = ObjectId(player_id)
    except Exception:
        return {"error": "invalid player id"}, 400

    result = db.players.delete_one({"_id": oid})

    if result.deleted_count == 0:
        return {"error": "player not found"}, 404

    return {"message": "player deleted"}, 200