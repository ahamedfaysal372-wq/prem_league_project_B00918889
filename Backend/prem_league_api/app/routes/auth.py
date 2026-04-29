from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from bson import ObjectId

from app.db import get_db

# Blueprint for authentication routes
auth_bp = Blueprint("auth", __name__)


# ------------------------
# REGISTER
# ------------------------
@auth_bp.post("/register")
def register():
    db = get_db()
    body = request.get_json(silent=True) or {}

    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    # Basic validation
    if not name or not email or len(password) < 6:
        return {"error": "name, email required and password must be 6+ chars"}, 400

    # Prevent duplicate user emails
    if db.users.find_one({"email": email}):
        return {"error": "email already registered"}, 409

    doc = {
        "name": name,
        "email": email,
        # Password is stored as a secure hash
        "password_hash": generate_password_hash(password),
        "role": "user",  # default role
        "favourite_team_id": None,
        "created_at": datetime.utcnow(),
    }

    res = db.users.insert_one(doc)
    return {"message": "registered", "user_id": str(res.inserted_id)}, 201


# ------------------------
# LOGIN
# ------------------------
@auth_bp.post("/login")
def login():
    db = get_db()
    body = request.get_json(silent=True) or {}

    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    # Check user exists and password is correct
    user = db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        return {"error": "invalid credentials"}, 401

    # Generate JWT token used for protected routes
    token = create_access_token(identity=str(user["_id"]))
    return {"access_token": token}, 200


# ------------------------
# ME (requires JWT)
# ------------------------
@auth_bp.get("/me")
@jwt_required()  # User must send a valid JWT token
def me():
    db = get_db()
    user_id = get_jwt_identity()

    # Get current logged-in user
    user = db.users.find_one({"_id": ObjectId(user_id)}, {"password_hash": 0})
    if not user:
        return {"error": "user not found"}, 404

    # Convert MongoDB ObjectId to string for JSON
    user["_id"] = str(user["_id"])
    if user.get("favourite_team_id"):
        user["favourite_team_id"] = str(user["favourite_team_id"])

    return user, 200