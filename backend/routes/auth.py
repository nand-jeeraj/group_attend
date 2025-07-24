from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import DummyUser
from extensions import mongo
from datetime import datetime  

auth_bp = Blueprint("auth", __name__, url_prefix="/api")
import re

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def is_valid_password(password):
    return len(password) >= 6  

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("username") 
    password = data.get("password")

    if not email or not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    if not password or not is_valid_password(password):
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if mongo.db.users.find_one({"username": email}):
        return jsonify({"error": "User already exists"}), 409

    hashed_pw = generate_password_hash(password)
    mongo.db.faculty.insert_one({"username": email, "password": hashed_pw})

    return jsonify({"message": "Registration successful"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    user = mongo.db.faculty.find_one({"username": username})
    if user and check_password_hash(user["password"], password):
        login_user(DummyUser(user["_id"]))

        
        mongo.db.event_attendance.insert_one({
            "col_id": data.get("col_id", "UNKNOWN"),
            "event_id": data.get("event_id"),
            "event": data.get("event"),
            "event_date": datetime.utcnow(),
            "email": user.get("username", ""),  
            "regno": data.get("regno"),
            "type": data.get("type")  # student or faculty
        })

        return jsonify({"success": True})
    
    return jsonify({"success": False, "message": "Invalid"}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"success": True})


@auth_bp.route("/check-auth")
def check_auth():
    if current_user.is_authenticated:
        return jsonify({"status": "ok"})
    return jsonify({"status": "unauthorized"}), 401
