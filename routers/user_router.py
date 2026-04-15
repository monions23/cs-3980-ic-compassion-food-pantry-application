

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from models.user import User

user_router = APIRouter()

@user_router.post("/")
async def create_user(user: User):
    existing = await User.find_one(User.email == user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    await user.insert()
    return user

@user_router.get("/{user_id}")
async def get_user(user_id: PydanticObjectId):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@user_router.get("/")
async def list_users():
    return await User.find_all().to_list()

@user_router.delete("/{user_id}")
async def delete_user(user_id: PydanticObjectId):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await user.delete()
    return {"message": "User deleted"}

@user_router.put("/{user_id}")
async def update_user(user_id: PydanticObjectId, update_data: dict):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await user.update({"$set": update_data})
    return await User.get(user_id)

