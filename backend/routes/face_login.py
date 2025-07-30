import os
import json
from flask import Blueprint, request, jsonify
from flask_login import login_user
from werkzeug.utils import secure_filename
import face_recognition
from extensions import mongo
from bson import ObjectId
from flask_login import UserMixin
import numpy as np
from PIL import Image

face_login_bp = Blueprint("face_login", __name__, url_prefix="/api")

KNOWN_FACES_FOLDER = os.path.join("uploads", "known_faces")
USERS_FACE_FOLDER = os.path.join("uploads", "faces")


class DummyUser(UserMixin):
    def __init__(self, user_id):
        self.id = str(user_id)

@face_login_bp.route("/face-login", methods=["POST"])
def face_login():
    image_file = request.files.get('image')

    if not image_file:
        return jsonify({'error': 'No image provided'}), 400

    img = Image.open(image_file.stream)
    img_array = np.array(img)

    unknown_encodings = face_recognition.face_encodings(img_array)

    if len(unknown_encodings) == 0:
        return jsonify({'error': 'No face found in image'}), 400

    unknown_encoding = unknown_encodings[0]

    users = list(mongo.db.users.find())

    for user in users:
        encoding_data = user.get('face_encoding')

        if not encoding_data:
            continue  

        try:
           
            if isinstance(encoding_data, str):
                known_encoding = np.array(json.loads(encoding_data))
            else:
                known_encoding = np.array(encoding_data)
        except Exception as e:
            continue  

        if known_encoding is None or known_encoding.size == 0:
            continue  

        matches = face_recognition.compare_faces([known_encoding], unknown_encoding)

        if matches[0]:
            user_obj = DummyUser(user['_id'])  
            login_user(user_obj)
            return jsonify({'message': 'Login successful', 'email': user['email'], 'name': user['name']}), 200

    return jsonify({'error': 'Face not recognized'}), 401
