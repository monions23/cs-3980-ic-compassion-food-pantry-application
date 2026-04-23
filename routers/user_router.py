

import logging

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from models.user import User


logger = logging.getLogger(__name__)

user_router = APIRouter()

@user_router.post("/")
async def create_user(user: User):
    logger.info(f"Attempting to create user with email={user.email}")
    existing = await User.find_one(User.email == user.email)
    if existing:
        logger.warning(f"User creation failed: email already exists ({user.email})")
        raise HTTPException(status_code=400, detail="Email already exists")

    await user.insert()
    logger.info(f"User created successfully with id={user.id}, email={user.email}")
    return user

@user_router.get("/{user_id}")
async def get_user(user_id: PydanticObjectId):
    logger.info(f"Fetching user with id={user_id}")
    user = await User.get(user_id)
    if not user:
        logger.warning(f"User not found with id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"User retrieved successfully with id={user_id}")
    return user

@user_router.get("/")
async def list_users():
    logger.info("Fetching all users")
    users = await User.find_all().to_list()
    logger.info(f"Retrieved {len(users)} users")
    return users

@user_router.delete("/{user_id}")
async def delete_user(user_id: PydanticObjectId):
    logger.info(f"Attempting to delete user with id={user_id}")
    user = await User.get(user_id)
    if not user:
        logger.warning(f"Delete failed: user not found with id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    await user.delete()
    logger.info(f"User deleted successfully with id={user_id}")
    return {"message": "User deleted"}

@user_router.put("/{user_id}")
async def update_user(user_id: PydanticObjectId, update_data: dict):
    logger.info(f"Attempting to update user with id={user_id}")
    user = await User.get(user_id)
    if not user:
        logger.warning(f"Update failed: user not found with id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    logger.debug(f"Update payload for user {user_id}: {update_data}")

    await user.update({"$set": update_data})
    logger.info(f"User updated successfully with id={user_id}")
    return await User.get(user_id)

