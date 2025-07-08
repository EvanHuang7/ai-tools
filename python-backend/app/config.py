from .utils import get_env_var

# Secrets
mongodb_url = get_env_var("MONGODB_URL")
redis_url = get_env_var("REDIS_URL")
imagekit_private_key = get_env_var("IMAGEKIT_PRIVATE_KEY")

# Constants
imagekit_upload_url = "https://upload.imagekit.io/api/v1/files/upload"
grpc_host = get_env_var("GRPC_HOST") or "localhost"
grpc_port = "50051"
