from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import mongo, login_manager
from routes import register_routes
from flask_login import UserMixin



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    

    CORS(app, supports_credentials=True)
    mongo.init_app(app)
    login_manager.init_app(app)

    register_routes(app)  
    return app

app = create_app()
class DummyUser(UserMixin):
    def __init__(self, user_id):
        self.id = str(user_id)
@login_manager.user_loader
def load_user(user_id):
    return DummyUser(user_id)




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)




