# app/models/pantry_record.py
from uuid import uuid4

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone


class PantryRecord(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    public_id: str = Field(default_factory=lambda: uuid4().hex)
    name_id: str = Field(default_factory=lambda: uuid4().hex)
    name: str = Field(
        ..., description="Name of the person associated with the this pantry record"
    )
    num_ppl_in_families: int = Field(
        ..., ge=0, description="Number of people in families served"
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="When the record was created",
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="When the record was last updated",
    )

    # updated_by: str = Field(
    #     ..., description="Email of the user/admin who updated this record"
    # )

    class Settings:
        name = "pantry_records"


class PantryRecordUpdate(BaseModel):
    num_ppl_in_families: Optional[int] = None
    # updated_by: Optional[str] = None
