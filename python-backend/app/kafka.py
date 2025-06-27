from confluent_kafka import Consumer, KafkaException

conf = {
    'bootstrap.servers': 'd1fgarsdfulgj4bj0b60.any.us-west-2.mpx.prd.cloud.redpanda.com:9092',
    'group.id': 'python-consumer-group',
    'auto.offset.reset': 'earliest',
    'security.protocol': 'SASL_SSL',
    'sasl.mechanism': 'SCRAM-SHA-256', 
    'sasl.username': 'ai-tools-redpanda-user',
    'sasl.password': 'Ab12345678!',
}

consumer = Consumer(conf)
topic = "hello-world"

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
            print(f"Received message: {msg.value().decode('utf-8')}")
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()
