from mongoengine import Document, IntField, StringField, DateTimeField
from datetime import datetime

class Plan(Document):
    userId = IntField(required=True)
    plan = StringField(required=True)
    
class KafkaMessage(Document):
    message = StringField(required=True)

class Image(Document):
    userId = StringField(required=True)
    inputImageUrl = StringField(required=True)
    resultImageUrl = StringField(required=True)
    
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    def save(self, *args, **kwargs):
        self.updatedAt = datetime.utcnow()
        return super(Image, self).save(*args, **kwargs)