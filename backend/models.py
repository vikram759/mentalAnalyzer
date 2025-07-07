from mongoengine import Document, StringField, DateTimeField
from datetime import datetime

class JournalEntry(Document):
    text = StringField(required=True)
    emotion = StringField(required=True)
    timestamp = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'journal_entries'
    }