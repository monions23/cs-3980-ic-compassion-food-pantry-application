from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional

class Scheduling(Document):
    date: datetime = Field(..., description="Appointment time")

    visitor_name: Optional[str] = Field(
        default=None, description="Visitor name"
    )

    visitor_contact: Optional[str] = Field(
        default=None, description="Phone/email if needed"
    )

    assigned_by: Optional[str] = Field(
        default=None, description="Employee who scheduled the visitor"
    )

    class Settings:
        name = "scheduling"