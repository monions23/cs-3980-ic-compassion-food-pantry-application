from datetime import timedelta
import logging

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException

from auth.authenticate import authenticate
from auth.hash_password import verify_password
from auth.jwt_handler import create_access_token
from models.user import ChangeEmailRequest, User


logger = logging.getLogger(__name__)

user_router = APIRouter()


@user_router.put("/change-email")
async def change_email(data: ChangeEmailRequest, current_user=Depends(authenticate)):
    user = await User.find_one(User.email == current_user.email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # verify password
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # check if email already exists
    existing = await User.find_one(User.email == data.new_email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")

    # update email
    user.email = data.new_email
    await user.save()

    new_token, expiry = create_access_token(
        {"email": user.email, "role": str(user.role)}
    )

    return {
        "message": "Email updated successfully",
        "access_token": new_token,
        "expiry": expiry,
    }


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


@user_router.get("/")
async def list_users():
    logger.info("Fetching all users")
    users = await User.find_all().to_list()
    logger.info(f"Retrieved {len(users)} users")
    return users


@user_router.get("/{user_id}")
async def get_user(user_id: PydanticObjectId):
    logger.info(f"Fetching user with id={user_id}")
    user = await User.get(user_id)
    if not user:
        logger.warning(f"User not found with id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"User retrieved successfully with id={user_id}")
    return user


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
