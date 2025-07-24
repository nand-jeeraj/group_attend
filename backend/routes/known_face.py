import base64
import json
import traceback
from flask import Blueprint, request, jsonify
from flask_login import login_required
from extensions import mongo
import face_recognition
import numpy as np
from PIL import Image
from io import BytesIO

known_face_bp = Blueprint("known", __name__, url_prefix="/api")

@known_face_bp.route("/known-face", methods=["POST"])
@login_required
def known_face():
    try:
        if 'image' not in request.files or 'name' not in request.form:
            return jsonify({"error": "Missing name or image"}), 400

        name = request.form['name']
        file = request.files['image']
        image_bytes = file.read()
        image = face_recognition.load_image_file(BytesIO(image_bytes))

        encodings = face_recognition.face_encodings(image)
        if not encodings:
            return jsonify({"error": "No face found"}), 400

       
        encoding_str = json.dumps(encodings[0].tolist())
        encoded_img = base64.b64encode(image_bytes).decode()

        mongo.db.known_faces.update_one(
            {"name": name},
            {"$set": {
                "encoding": encoding_str,
                "image_base64": encoded_img
            }},
            upsert=True
        )

        return jsonify({"success": True})

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed to add face"}), 500
