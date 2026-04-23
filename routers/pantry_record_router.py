import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from models.pantry_record import PantryRecord, PantryRecordUpdate

logger = logging.getLogger(__name__)

pantry_record_router = APIRouter()


# Show all records
@pantry_record_router.get("/")
async def get_all_pantry_records():
    logger.info("Fetching all pantry records")
    records = await PantryRecord.find_all().to_list()

    logger.info(f"Retrieved {len(records)} pantry records")
    return records


# Create a record
@pantry_record_router.post("/", status_code=201)
async def create_new_pantry_record(item: PantryRecord) -> PantryRecord:
    logger.info("Attempting to create new pantry record")
    item.id = None
    now = datetime.now(timezone.utc)
    item.created_at = now
    # item.updated_at = now

    await item.insert()
    logger.info(f"Pantry record created successfully with id={item.id}")
    return item


# Get a record
@pantry_record_router.get("/{item_id}")
async def get_pantry_record(item_id: str):
    logger.info(f"Fetching pantry record id={item_id}")
    item = await PantryRecord.get(item_id)
    if not item:
        logger.warning(f"Pantry record not found id={item_id}")
        raise HTTPException(status_code=404, detail="Item not found")
    logger.info(f"Pantry record retrieved id={item_id}")
    return item


# Update a record
@pantry_record_router.put("/{item_id}")
async def update_pantry_record(item_id: str, update: PantryRecordUpdate):
    logger.info(f"Attempting to update pantry record id={item_id}")
    item = await PantryRecord.get(item_id)
    if not item:
        logger.warning(f"Update failed: pantry record not found id={item_id}")
        raise HTTPException(status_code=404, detail="Item not found")

    update_data = update.model_dump(exclude_unset=True)
    logger.debug(f"Update payload for pantry record {item_id}: {update_data}")

    update_data["updated_at"] = datetime.now(timezone.utc)

    await item.update({"$set": update_data})

    updated_item = await PantryRecord.get(item_id)
    logger.info(f"Pantry record updated successfully id={item_id}")
    return updated_item


# Delete a record
@pantry_record_router.delete("/{item_id}")
async def delete_pantry_record(item_id: str):
    logger.info(f"Attempting to delete pantry record id={item_id}")

    item = await PantryRecord.get(item_id)
    if not item:
        logger.warning(f"Delete failed: pantry record not found id={item_id}")
        raise HTTPException(status_code=404, detail="Item not found")

    await item.delete()
    logger.info(f"Pantry record deleted successfully id={item_id}")
    return {"message": "Pantry record deleted successfully"}