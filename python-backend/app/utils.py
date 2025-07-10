import os
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
# Get env value from env variable or env variable file
def get_env_var(key):
    val = os.getenv(key)
    if val:
        return val
    
    # Read the secret from file Only if creating a docker secret 
	# within Docker Swarm.
    file_path = os.getenv(f"{key}_FILE")
    if file_path and os.path.exists(file_path):
        with open(file_path, 'r') as f:
            return f.read().strip()

    return None

# Build Imagekit remove background image url
def append_transformation(url: str, tr: str) -> str:
    parsed = urlparse(url)
    query = parse_qs(parsed.query)
    # this overwrites any existing 'tr' if present
    query['tr'] = tr 
    new_query = urlencode(query, doseq=True)
    return urlunparse(parsed._replace(query=new_query))

# Get the current year, month, first day of month
def get_current_year_and_month_start(dt: datetime) -> datetime:
    return datetime(dt.year, dt.month, 1)
