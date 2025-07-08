from .utils import get_env_var

# Constants
imagekit_upload_url = "https://upload.imagekit.io/api/v1/files/upload"
grpc_host = get_env_var("GRPC_HOST") or "localhost"
grpc_port = "50051"
