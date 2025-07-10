from .utils import get_env_var

# Constants
imagekit_upload_url = "https://upload.imagekit.io/api/v1/files/upload"

grpc_host = get_env_var("GRPC_HOST") or "localhost"
grpc_port = "50051"

kafka_group_id = 'python-consumer-group'
kafka_auto_offset_reset = 'earliest'
kafka_security_protocol = 'SASL_SSL'
kafka_sasl_mechanism = 'SCRAM-SHA-256'
kafka_sasl_username = 'ai-tools-redpanda-user'
kafka_topic = "hello-world"

free_user_image_feature_monthly_limit = 5
standard_user_image_feature_monthly_limit = 10
pro_user_image_feature_monthly_limit = 20