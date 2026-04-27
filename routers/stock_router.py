
import logging
from fastapi import APIRouter, HTTPException

from models.stock import Stock, StockUpdate

logger = logging.getLogger(__name__)


stock_router = APIRouter()


# Show all stock
@stock_router.get("/")
async def get_all_stocks():
    logger.info("Fetching all stock items")
    stocks = await Stock.find_all().to_list()
    logger.info(f"Retrieved {len(stocks)} stock items")
    return [
        {
            "public_id": item.public_id,
            "item_name": item.item_name,
            "quantity": item.quantity,
            "target_quantity": item.target_quantity
        }
        for item in stocks
    ]


# Create a stock item
@stock_router.post("/", status_code=201)
async def create_new_stock(item: Stock) -> Stock:
    logger.info("Attempting to create new stock item")
    await item.insert()
    logger.info(f"Stock item created successfully with id={item.id}")
    return {
        "public_id": item.public_id,
        "item_name": item.item_name,
        "quantity": item.quantity,
        "target_quantity": item.target_quantity
    }

# Get a stock item


@stock_router.get("/{item_id}")
async def get_stock(item_id: str):
    logger.info(f"Fetching stock item id={item_id}")

    item = await Stock.find_one(Stock.public_id == item_id)
    if not item:
        logger.warning(f"Stock item not found id={item_id}")
        raise HTTPException(status_code=404, detail="Item not found")
    logger.info(f"Stock item retrieved id={item_id}")
    return {
        "public_id": item.public_id,
        "item_name": item.item_name,
        "quantity": item.quantity,
        "target_quantity": item.target_quantity
    }

# Update a stock item


@stock_router.put("/{item_id}")
async def update_stock(item_id: str, update: StockUpdate):
    logger.info(f"Attempting to update stock item id={item_id}")
    item = await Stock.find_one(Stock.public_id == item_id)

    if not item:
        logger.warning(f"Update failed: stock item not found id={item_id}")
        raise HTTPException(status_code=404, detail="Item not found")

    update_data = update.model_dump(exclude_unset=True)
    logger.debug(f"Update payload for stock id={item_id}: {update_data}")

    await item.update({"$set": update_data})

    updated_item = await Stock.find_one(Stock.public_id == item_id)

    logger.info(f"Stock item updated successfully id={item_id}")

    return {
        "public_id": updated_item.public_id,
        "item_name": updated_item.item_name,
        "quantity": updated_item.quantity,
        "target_quantity": updated_item.target_quantity
    }

# Delete a stock item


@stock_router.delete("/{item_id}")
async def delete_stock(item_id: str):
    logger.info(f"Attempting to delete stock item id={item_id}")
    item = await Stock.find_one(Stock.public_id == item_id)
    if not item:
        logger.warning(f"Delete failed: stock item not found id={item_id}")
        raise HTTPException(status_code=404, detail="Item not found")

    await item.delete()
    logger.info(f"Stock item deleted successfully id={item_id}")
    return {"message": "Stock deleted successfully"}
