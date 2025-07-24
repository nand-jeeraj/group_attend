import base64
import traceback
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from PIL import Image
from io import BytesIO
from extensions import mongo
from utils.face_utils import load_known_faces_from_db, recognize_faces_from_bytes
from datetime import datetime

upload_bp = Blueprint("upload", __name__, url_prefix="/api")

@upload_bp.route("/upload", methods=["POST"])
@login_required
def upload():
    try:
        print("Upload route hit")

        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]

       
        image_bytes = file.read()

        
        known_encs, known_names = load_known_faces_from_db()

        
        present, unknown, total = recognize_faces_from_bytes(
            image_bytes, known_encs, known_names
        )
        print("Face recognition complete")

       
        for name in present:
            print(f"Marking present: {name}")
            
            mongo.db.students.update_one({"name": name}, {"$setOnInsert": {"name": name}}, upsert=True)

            student_data = mongo.db.students.find_one({"name": name})
            if not student_data:
                print(f"Student {name} not found in DB, skipping...")
                continue

            mongo.db.attendance.insert_one({
                "student_name": name,
                "user": getattr(current_user, "username", str(current_user.id)),
                "col_id": student_data.get("col_id", "UNKNOWN"),
                "program": student_data.get("program", "UNKNOWN"),
                "programcode": student_data.get("programcode", "UNKNOWN"),
                "course": student_data.get("course", "UNKNOWN"),
                "coursecode": student_data.get("coursecode", "UNKNOWN"),
                "faculty": student_data.get("faculty", "UNKNOWN"),
                "faculty_id": student_data.get("faculty_id", "UNKNOWN"),
                "year": datetime.utcnow().year,
                "period": "Morning",
                "student_regno": student_data.get("student_regno", "UNKNOWN"),
                "attendance": 1,
                "timestamp": datetime.utcnow()
            })

        
        image_base64 = base64.b64encode(image_bytes).decode()

        mongo.db.uploaded_photos.insert_one({
            "col_id": student_data.get("col_id", "UNKNOWN") if present else "UNKNOWN",
            "uploaded_by": str(current_user.id),
            "timestamp": datetime.utcnow(),
            "image_base64": image_base64,
            "present_students": present,
            "unknown_faces": unknown,
            "total_faces": total
        })

        return jsonify({
            "present": present,
            "unknown": unknown,
            "total": total
        })

    except Exception as e:
        print("Exception in upload route:", str(e))
        traceback.print_exc()
        return jsonify({"error": "Upload failed", "details": str(e)}), 500
