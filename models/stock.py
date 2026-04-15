from typing import Optional

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field

class Stock(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    item_name: str = Field(..., description="Name of the stock item")
    quantity: int = Field(..., ge=0, description="Current quantity in pantry")
    target_quantity: int = Field(..., ge=0, description="Target quantity to maintain")
    
    class Settings:
        name = "stock"

class StockUpdate(BaseModel):
    item_name: Optional[str] = None
    quantity: Optional[int] = None
    target_quantity: Optional[int] = None