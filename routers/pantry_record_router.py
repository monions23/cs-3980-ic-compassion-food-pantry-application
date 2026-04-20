from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from models.pantry_record import PantryRecord, PantryRecordUpdate

pantry_record_router = APIRouter()


# Show all records
@pantry_record_router.get("/")
async def get_all_pantry_records():
    return await PantryRecord.find_all().to_list()


# Create a record
@pantry_record_router.post("/", status_code=201)
async def create_new_pantry_record(item: PantryRecord) -> PantryRecord:
    item.id = None
    now = datetime.now(timezone.utc)
    item.created_at = now
    item.updated_at = now

    await item.insert()
    return item


# Get a record
@pantry_record_router.get("/{item_id}")
async def get_pantry_record(item_id: str):
    item = await PantryRecord.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


# Update a record
@pantry_record_router.put("/{item_id}")
async def update_stock(item_id: str, update: PantryRecordUpdate):
    item = await PantryRecord.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    update_data = update.model_dump(exclude_unset=True)

    update_data["updated_at"] = datetime.now(timezone.utc)

    await item.update({"$set": update_data})

    updated_item = await PantryRecord.get(item_id)
    return updated_item


# Delete a record
@pantry_record_router.delete("/{item_id}")
async def delete_stock(item_id: str):
    item = await PantryRecord.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    await item.delete()
    return {"message": "Pantry record deleted successfully"}