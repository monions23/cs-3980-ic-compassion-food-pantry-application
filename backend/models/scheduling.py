from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional


# email of visitor, timeslot they want to come in (date and time)
class Scheduling(Document):

    date: datetime = Field(..., description="Appointment time")

    email: Optional[str] = Field(default=None, description="Visitor email")

    # visitor_contact: Optional[str] = Field(
    #     default=None, description="Phone/email if needed"
    # )

    # assigned_by: Optional[str] = Field(
    #     default=None, description="Employee who scheduled the visitor"
    # )

    class Settings:
        name = "scheduling"
