from mongoengine import Document, IntField, StringField

class Plan(Document):
    userId = IntField(required=True)
    plan = StringField(required=True)
