# app/models/pantry_record.py
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone


class PantryRecord(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="When the record was created",
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="When the record was last updated",
    )

    num_ppl_in_families: int = Field(
        ..., ge=0, description="Number of people in families served"
    )

    updated_by: str = Field(
        ..., description="Email of the user/admin who updated this record"
    )

    class Settings:
        name = "pantry_records"


class PantryRecordUpdate(BaseModel):
    num_ppl_in_families: Optional[int] = None
    updated_by: Optional[str] = None
