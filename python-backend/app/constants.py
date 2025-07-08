from .utils import get_env_var

# Constants
imagekit_upload_url = "https://upload.imagekit.io/api/v1/files/upload"

grpc_host = get_env_var("GRPC_HOST") or "localhost"
grpc_port = "50051"

kafka_bootstrap_server = 'd1fgarsdfulgj4bj0b60.any.us-west-2.mpx.prd.cloud.redpanda.com:9092'
kafka_group_id = 'python-consumer-group'
kafka_auto_offset_reset = 'earliest'
kafka_security_protocol = 'SASL_SSL'
kafka_sasl_mechanism = 'SCRAM-SHA-256'
kafka_sasl_username = 'ai-tools-redpanda-user'
kafka_sasl_password = 'Ab12345678!'
kafka_topic = "hello-world"