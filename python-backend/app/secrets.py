from .utils import get_env_var

# Secrets
mongodb_url = get_env_var("MONGODB_URL")
redis_url = get_env_var("REDIS_URL")
imagekit_private_key = get_env_var("IMAGEKIT_PRIVATE_KEY")
clerk_secret_key = get_env_var("CLERK_SECRET_KEY")

