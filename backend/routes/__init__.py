from .auth import auth_bp
from .upload import upload_bp

from .known_face import known_face_bp
from .dashboard import dashboard_bp
from .face_login import face_login_bp 

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(known_face_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(face_login_bp)

