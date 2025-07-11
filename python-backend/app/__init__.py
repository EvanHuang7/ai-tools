from flask import Flask
from mongoengine import connect
import redis
from . import secrets
from . import kafka
from . import rabbitmq_listener

# Global redis_client to use elsewhere
redis_client = None

def create_app():
    app = Flask(__name__)

    # Connect to MongoDB
    connect(host=secrets.mongodb_url)

    # Connect to Redis
    app.redis_client = redis.from_url(secrets.redis_url)
    
    # Start a Kafka connection as consumer once server is running
    # kafka.connectKafkaConsumer(app)
    
    # 🔁 Replace Kafka with RabbitMQ
    rabbitmq_listener.connectRabbitMQConsumer(app)

    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app
