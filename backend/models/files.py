from beanie import Document
from datetime import datetime

from models import user

class FileRecord(Document):
    filename: str
    filepath: str
    uploaded_at: datetime = datetime.now()
    uploaded_by: str

    class Settings:
        name = "files"