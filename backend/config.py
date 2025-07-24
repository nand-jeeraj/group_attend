import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
    UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/attendance_db")
