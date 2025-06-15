import os
from dotenv import load_dotenv

load_dotenv()

def get_env_var(key):
    val = os.getenv(key)
    if val:
        return val

    file_path = os.getenv(f"{key}_FILE")
    if file_path and os.path.exists(file_path):
        with open(file_path, 'r') as f:
            return f.read().strip()

    return None

MONGODB_URL = get_env_var("MONGODB_URL")
REDIS_URL = get_env_var("REDIS_URL")
