from confluent_kafka import Consumer, KafkaException
from .models import KafkaMessage
from . import constants

conf = {
    'bootstrap.servers': constants.kafka_bootstrap_server,
    'group.id': constants.kafka_group_id,
    'auto.offset.reset': constants.kafka_auto_offset_reset,
    'security.protocol': constants.kafka_security_protocol,
    'sasl.mechanism': constants.kafka_sasl_mechanism, 
    'sasl.username': constants.kafka_sasl_username,
    'sasl.password': constants.kafka_sasl_password,
}

consumer = Consumer(conf)
topic = constants.kafka_topic

def connectKafkaConsumer():
    consumer.subscribe([topic])
    print(f"Subscribed to topic: {topic}")
    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                raise KafkaException(msg.error())
            decodedMessage = msg.value().decode('utf-8') 
            print(f"Received message: {decodedMessage}")
            createKafkaMessage(decodedMessage)
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()
        
def createKafkaMessage(message):
    try:
        KafkaMessage(message=message).save()
    except Exception as e:
        print(f"Failed to save Kafka message: {e}")
