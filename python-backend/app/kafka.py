import json
import threading
from flask import current_app
from confluent_kafka import Consumer, KafkaException
from .models import KafkaMessage
from . import constants
from . import secrets

conf = {
    'bootstrap.servers': secrets.kafka_bootstrap_server,
    'group.id': constants.kafka_group_id,
    'auto.offset.reset': constants.kafka_auto_offset_reset,
    'security.protocol': constants.kafka_security_protocol,
    'sasl.mechanism': constants.kafka_sasl_mechanism, 
    'sasl.username': constants.kafka_sasl_username,
    'sasl.password': secrets.kafka_sasl_user_password,
}

def connectKafkaConsumer(app):
    consumer = Consumer(conf)
    topic = constants.kafka_topic
    
    def consume():
        # Activate Flask app context to use redis client in this file
        with app.app_context():
            consumer.subscribe([topic])
            print(f"Subscribed to topic: {topic}")
            try:
                while True:
                    msg = consumer.poll(timeout=1.0)
                    if msg is None:
                        continue
                    if msg.error():
                        raise KafkaException(msg.error())
                    
                    # Kafka message handler
                    try:
                        # Decode and parse JSON
                        decodedMessage = msg.value().decode('utf-8')
                        parsedMessage = json.loads(decodedMessage)

                        print(f"Received Kafka message: {parsedMessage}")
                        
                        if parsedMessage.get("type") == "test":
                            createKafkaMessage(parsedMessage.get("message"))
                        # Case type: 'app-monthly-usage'
                        else:
                            # Serialize the value as a JSON string.
                            # Message expires after 1 hour, and when a 
                            # Redis key expires, Redis automatically deletes it.
                            current_app.redis_client.setex(parsedMessage.get("redisKey"), 3600, json.dumps(parsedMessage))
                                
                    except json.JSONDecodeError:
                        print("Failed to parse JSON from Kafka message")
                    except Exception as e:
                        print(f"Unexpected error while handling message: {e}")
                    
            except KeyboardInterrupt:
                pass
            finally:
                consumer.close()
    # Run the consuming function in a daemon thread
    # Kafka connection is running in a separate daemon thread or background task,
    # so that it won't block starting the python app server.
    threading.Thread(target=consume, daemon=True).start()
        
def createKafkaMessage(message):
    try:
        KafkaMessage(message=message).save()
    except Exception as e:
        print(f"Failed to save Kafka message: {e}")
