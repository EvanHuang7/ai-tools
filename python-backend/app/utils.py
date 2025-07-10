from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
import os
from datetime import datetime
from mongoengine.queryset.visitor import Q
from .models import ImageFeatureMonthlyUsage
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

# Get the the first day of current month
def get_current_year_and_month_start(dt: datetime) -> datetime:
    return datetime(dt.year, dt.month, 1)

# Check user image feature monthly usage
def check_image_feature_monthly_usage(user_id: str) -> int:
    # Get current year and 1st day of current month
    now = datetime.utcnow()
    month_start = get_current_year_and_month_start(now)

    # Check current usage record
    usage_record = ImageFeatureMonthlyUsage.objects(
        Q(userId=user_id) & Q(monthAndYear=month_start)
    ).first()

    if usage_record:
        return usage_record.usage
    # Create a record if not exist
    else:
        return 0
    
# Increase user image feature monthly usage or create a record if no exsit
def increment_image_feature_monthly_usage(user_id: str, count: int = 1):
    # Get current year and 1st day of current month
    now = datetime.utcnow()
    month_start = get_current_year_and_month_start(now)

    # Check current usage record
    usage_record = ImageFeatureMonthlyUsage.objects(
        Q(userId=user_id) & Q(monthAndYear=month_start)
    ).first()

    # Increase 1 usage if exist
    if usage_record:
        usage_record.usage += count
    # Create a record if not exist
    else:
        usage_record = ImageFeatureMonthlyUsage(
            userId=user_id,
            usage=count,
            monthAndYear=month_start
        )

    usage_record.save()