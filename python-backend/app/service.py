from datetime import datetime
from mongoengine.queryset.visitor import Q

from . import utils
from .models import ImageFeatureMonthlyUsage

# Get user image feature monthly usage
def get_image_feature_monthly_usage(user_id: str) -> int:
    # Get current year and 1st day of current month
    now = datetime.utcnow()
    month_start = utils.get_current_year_and_month_start(now)

    # Check current usage record
    usage_record = ImageFeatureMonthlyUsage.objects(
        Q(userId=user_id) & Q(monthAndYear=month_start)
    ).first()

    if usage_record:
        return usage_record.usage
    else:
        return 0
    
# Increase user image feature monthly usage or create a record if no exsit
def increment_image_feature_monthly_usage(user_id: str, count: int = 1):
    # Get current year and 1st day of current month
    now = datetime.utcnow()
    month_start = utils.get_current_year_and_month_start(now)

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