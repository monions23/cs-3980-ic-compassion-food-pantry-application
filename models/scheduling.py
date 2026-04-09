# app/models/scheduling.py
from beanie import Document
from pydantic import Field
from datetime import datetime

class Scheduling(Document):
    user_email: str = Field(..., description="Email of the user assigned to this task")
    task: str = Field(..., description="Description of the task")
    date: datetime = Field(..., description="Date and time of the task")
    
    class Settings:
        name = "scheduling"