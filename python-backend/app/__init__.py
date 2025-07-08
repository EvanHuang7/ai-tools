from flask import Flask
from mongoengine import connect
import redis
import threading
from . import secrets
from . import kafka

# Global redis_client to use elsewhere
redis_client = None

def create_app():
    app = Flask(__name__)

    # Connect to MongoDB
    connect(host=secrets.mongodb_url)

    # Connect to Redis
    app.redis_client = redis.from_url(secrets.redis_url)
    
    # Start a Kafka connection as consumer once server is running
    # Kafka connection is running in a separate daemon thread or background task,
    # so that it won't block starting the python app server.
    consumer_thread = threading.Thread(target=kafka.connectKafkaConsumer, daemon=True)
    consumer_thread.start()

    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app
