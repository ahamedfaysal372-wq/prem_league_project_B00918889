import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

_client = None  # Store MongoDB client so we don't reconnect every time


def get_db():
    """Return a connected MongoDB database handle."""
    global _client

    # Create MongoDB client if it doesn't exist
    if _client is None:
        uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        _client = MongoClient(uri)

    # Select the database
    db_name = os.getenv("MONGO_DB", "prem_league_api")
    return _client[db_name]