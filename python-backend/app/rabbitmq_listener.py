# rabbitmq.py
import json
import threading
import pika
from flask import current_app
from .models import KafkaMessage  # reuse this Mongo model
from . import secrets, constants

RABBITMQ_URL = secrets.rabbitmq_url 
QUEUE_NAME = constants.rabbitmq_queue 

def connectRabbitMQConsumer(app):
    def consume():
        with app.app_context():
            params = pika.URLParameters(RABBITMQ_URL)
            connection = pika.BlockingConnection(params)
            channel = connection.channel()
            channel.queue_declare(queue=QUEUE_NAME, durable=True)

            def callback(ch, method, properties, body):
                try:
                    decoded_message = body.decode("utf-8")
                    parsed_message = json.loads(decoded_message)

                    print(f"Received RabbitMQ message: {parsed_message}")

                    if parsed_message.get("type") == "test":
                        createRabbitMessage(parsed_message.get("message"))
                    else:
                        # Store in Redis with 1-hour expiry
                        current_app.redis_client.setex(
                            parsed_message.get("redisKey"),
                            3600,
                            json.dumps(parsed_message)
                        )
                except json.JSONDecodeError:
                    print("Failed to parse RabbitMQ JSON message")
                except Exception as e:
                    print(f"Unexpected error while handling RabbitMQ message: {e}")

            channel.basic_consume(
                queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True
            )

            print(f"Subscribed to RabbitMQ queue: {QUEUE_NAME}")
            try:
                channel.start_consuming()
            except KeyboardInterrupt:
                print("Stopping RabbitMQ consumer")
            finally:
                connection.close()

    threading.Thread(target=consume, daemon=True).start()


def createRabbitMessage(message):
    try:
        KafkaMessage(message=message).save()  # Reuse existing model
    except Exception as e:
        print(f"Failed to save RabbitMQ message: {e}")
