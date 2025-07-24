from flask import Blueprint, jsonify
from flask_login import login_required
from extensions import mongo

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")

@dashboard_bp.route("/dashboard", methods=["GET"])
@login_required
def dashboard():
    pipeline = [{"$group": {"_id": "$student_name", "count": {"$sum": 1}}}]
    data = list(mongo.db.attendance.aggregate(pipeline))
    return jsonify(data)

@dashboard_bp.route("/history", methods=["GET"])
@login_required
def history():
    recs = list(mongo.db.attendance.find().sort("timestamp", -1))
    for r in recs:
        r["_id"] = str(r["_id"])
        r["timestamp"] = r["timestamp"].isoformat()
    return jsonify(recs)
