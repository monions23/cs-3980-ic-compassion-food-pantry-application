# app/models/pantry_record.py
from beanie import Document
from pydantic import Field
from typing import List, Dict
from datetime import datetime

class PantryRecord(Document):
    date: datetime = Field(default_factory=datetime, description="Date of the record")
    num_families: int = Field(..., ge=0, description="Number of families served")
    items_checked_out: List[Dict[str, int]] = Field(
        ..., 
        description="List of stock items and quantities checked out, e.g., [{'item_name': 'rice', 'quantity': 5}]"
    )
    updated_by: str = Field(..., description="Email of the user/admin who updated this record")

    class Settings:
        name = "pantry_records"