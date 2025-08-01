from mongoengine import Document, IntField, StringField, DateTimeField
from datetime import datetime

# NOTE: Don't need do anything after adding a new schema for mongodb case
class Image(Document):
    userId = StringField(required=True)
    inputImageUrl = StringField(required=True)
    resultImageUrl = StringField(required=True)
    
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    def save(self, *args, **kwargs):
        self.updatedAt = datetime.utcnow()
        return super(Image, self).save(*args, **kwargs)
    
class ImageFeatureMonthlyUsage(Document):
    userId = StringField(required=True)
    usage = IntField(required=True)

    # Month-Year stored as first day of the month for easy range querying
    monthAndYear = DateTimeField(required=True)

    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    def save(self, *args, **kwargs):
        self.updatedAt = datetime.utcnow()
        return super(ImageFeatureMonthlyUsage, self).save(*args, **kwargs)