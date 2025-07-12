# rabbitmq.py
import json
import threading
import pika
from flask import current_app
from . import secrets, constants

def connectRabbitMQConsumer(app):
    def consume():
        # Activate Flask app context to use redis client in this file
        with app.app_context():
            params = pika.URLParameters(secrets.rabbitmq_url)
            connection = pika.BlockingConnection(params)
            channel = connection.channel()
            channel.queue_declare(queue=constants.rabbitmq_queue, durable=True)

            def callback(ch, method, properties, body):
                try:
                    # Decode and parse JSON
                    decoded_message = body.decode("utf-8")
                    parsed_message = json.loads(decoded_message)

                    print(f"Received RabbitMQ message: {parsed_message}")

                    # Message expires after 1 hour, and when a 
                    # Redis key expires, Redis automatically deletes it.
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
                queue=constants.rabbitmq_queue, on_message_callback=callback, auto_ack=True
            )

            print(f"Subscribed to RabbitMQ queue: {constants.rabbitmq_queue}")
            try:
                channel.start_consuming()
            except KeyboardInterrupt:
                print("Stopping RabbitMQ consumer")
            finally:
                connection.close()

    threading.Thread(target=consume, daemon=True).start()
