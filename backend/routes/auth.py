from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from models.user import DummyUser
from extensions import mongo
from datetime import datetime  
import os
import face_recognition
import numpy as np

from PIL import Image

auth_bp = Blueprint("auth", __name__, url_prefix="/api")
import re

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def is_valid_password(password):
    return len(password) >= 6  
UPLOAD_FOLDER = 'uploads/faces'

@auth_bp.route("/register", methods=["POST"])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    image_file = request.files.get('image')

    if not all([name, email, password, image_file]):
        return jsonify({'error': 'All fields required'}), 400

    if mongo.db.users.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    # Convert image to face encoding
    try:
        img = Image.open(image_file.stream).convert('RGB')
        img_array = np.array(img)
        encodings = face_recognition.face_encodings(img_array)

        if len(encodings) == 0:
            return jsonify({'error': 'No face detected in the image'}), 400

        face_encoding = encodings[0].tolist()
    except Exception as e:
        return jsonify({'error': 'Image processing failed'}), 500

    # Hash the password
    hashed_password = generate_password_hash(password)

    mongo.db.users.insert_one({
        'name': name,
        'email': email,
        'password': hashed_password,
        'face_encoding': face_encoding
    })

    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password required'}), 400

        user = mongo.db.users.find_one({"email": email})
        if user and check_password_hash(user["password"], password):
         login_user(DummyUser(user["_id"]))

        
        return jsonify({'success': True, 'message': 'Login successful'}), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"success": True})


@auth_bp.route("/check-auth")
def check_auth():
    if current_user.is_authenticated:
        return jsonify({"status": "ok"})
    return jsonify({"status": "unauthorized"}), 401
