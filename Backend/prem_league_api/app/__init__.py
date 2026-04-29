from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from app.routes.auth import auth_bp
from app.routes.teams import teams_bp
from app.routes.players import players_bp
from app.routes.matches import matches_bp


def create_app():
    load_dotenv()

    app = Flask(__name__)

    CORS(app)

    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(teams_bp, url_prefix="/teams")
    app.register_blueprint(players_bp, url_prefix="/players")
    app.register_blueprint(matches_bp, url_prefix="/matches")

    @app.get("/")
    def home():
        return {"service": "prem_league_api", "status": "ok"}, 200

    return app