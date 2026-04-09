from beanie import Document
from pydantic import Field

class Stock(Document):
    item_name: str = Field(..., description="Name of the stock item")
    quantity: int = Field(..., ge=0, description="Current quantity in pantry")
    target_quantity: int = Field(..., ge=0, description="Target quantity to maintain")
    
    class Settings:
        name = "stock"