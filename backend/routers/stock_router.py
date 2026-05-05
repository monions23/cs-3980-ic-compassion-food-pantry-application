import logging
from fastapi import APIRouter, HTTPException

from models.stock import Stock, StockUpdate
from pymongo.errors import DuplicateKeyError

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
            "target_quantity": item.target_quantity,
        }
        for item in stocks
    ]


# Create a stock item
@stock_router.post("/", status_code=201)
async def create_new_stock(item: Stock):
    logger.info("Attempting to create new stock item")

    # Normalize name (must match frontend logic)
    normalized_name = item.item_name.strip().lower()

    # Check if already exists
    existing = await Stock.find_one(Stock.item_name == normalized_name)
    if existing:
        logger.warning(f"Duplicate item attempted: {normalized_name}")
        raise HTTPException(status_code=400, detail="Item already exists")

    # Ensure stored name is normalized
    item.item_name = normalized_name

    try:
        await item.insert()
    except DuplicateKeyError:
        # Backup safety (race condition protection)
        raise HTTPException(status_code=400, detail="Item already exists")

    logger.info(f"Stock item created successfully with id={item.id}")

    return {
        "public_id": item.public_id,
        "item_name": item.item_name,
        "quantity": item.quantity,
        "target_quantity": item.target_quantity,
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
        "target_quantity": item.target_quantity,
    }


# Update a stock item


@stock_router.put("/{item_id}")
async def update_stock(item_id: str, update: StockUpdate):
    logger.info(f"Attempting to update stock item id={item_id}")

    item = await Stock.find_one(Stock.public_id == item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    update_data = update.model_dump(exclude_unset=True)

    # If name is being updated → check duplicates
    if "item_name" in update_data:
        normalized_name = update_data["item_name"].strip().lower()

        existing = await Stock.find_one(Stock.item_name == normalized_name)

        if existing and existing.public_id != item_id:
            logger.warning(f"Duplicate name on update: {normalized_name}")
            raise HTTPException(status_code=400, detail="Item already exists")

        update_data["item_name"] = normalized_name

    try:
        await item.update({"$set": update_data})
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Item already exists")

    updated_item = await Stock.find_one(Stock.public_id == item_id)

    return {
        "public_id": updated_item.public_id,
        "item_name": updated_item.item_name,
        "quantity": updated_item.quantity,
        "target_quantity": updated_item.target_quantity,
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
