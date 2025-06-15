from flask import Flask
from mongoengine import connect
import redis
from . import config

# Global redis_client to use elsewhere
redis_client = None

def create_app():
    app = Flask(__name__)

    # Connect to MongoDB
    connect(host=config.MONGODB_URL)

    # Connect to Redis
    app.redis_client = redis.from_url(config.REDIS_URL)

    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app
