from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId

from app.db import get_db


# Decorator to restrict routes to admin users only
def admin_required(fn):

    @wraps(fn)
    @jwt_required()  # Requires a valid JWT token
    def wrapper(*args, **kwargs):

        db = get_db()

        # Get user id from the JWT token
        user_id = get_jwt_identity()

        # Find the user in database
        user = db.users.find_one({"_id": ObjectId(user_id)}, {"role": 1})

        # Check if user is admin
        if not user or user.get("role") != "admin":
            return {"error": "admin access required"}, 403

        # Continue if user is admin
        return fn(*args, **kwargs)

    return wrapper