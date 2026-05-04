from datetime import timedelta
import logging

from fastapi import APIRouter, Depends, HTTPException

from auth.authenticate import authenticate
from auth.hash_password import verify_password
from auth.jwt_handler import create_access_token
from models.user import ChangeEmailRequest, ChangeRoleRequest, User, UserRole

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
    logger.info(f"User [{user.email}] has updated their email.")
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
    logger.info(f"User created successfully with id={user.public_id}, email={user.email}")
    return user


@user_router.get("/")
async def get_users(user=Depends(authenticate)):

    if user.role != UserRole.SuperAdmin:
        raise HTTPException(status_code=403, detail="Not authorized")

    users = await User.find_all().to_list()

    print(users)
    return [{"id": str(u.public_id), "email": u.email, "role": u.role} for u in users]


@user_router.get("/me")
async def get_current_user(user=Depends(authenticate)):
    return {"email": user.email, "role": user.role}


@user_router.get("/{user_id}")
async def get_user(user_id: str):
    logger.info(f"Fetching user with id={user_id}")
    user = await User.get(user_id)
    if not user:
        logger.warning(f"User not found with id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"User retrieved successfully with id={user_id}")
    return user


@user_router.put("/{user_id}")
async def update_user(user_id: str, update_data: dict):
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
async def delete_user(user_id: str):
    logger.info(f"Attempting to delete user with id={user_id}")
    user = await User.get(user_id)
    if not user:
        logger.warning(f"Delete failed: user not found with id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    await user.delete()
    logger.info(f"User deleted successfully with id={user_id}")
    return {"message": "User deleted"}


@user_router.put("/{user_id}/role")
async def change_user_role(
    user_id: str,
    data: ChangeRoleRequest,
    current_user=Depends(authenticate),
):
    logger.info(
        f"SuperAdmin {current_user.email} attempting role change for user_id={user_id}"
    )

    # only SuperAdmin can change roles
    if current_user.role != UserRole.SuperAdmin:
        raise HTTPException(status_code=403, detail="Not authorized")

    # validate role values
    if data.role not in ["BasicUser", "SuperAdmin"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    print("Looking for UUID:", user_id)
    user = await User.find_one(User.public_id == user_id)
    print("Found user:", user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # update role
    user.role = data.role
    await user.save()

    logger.info(
        f"User {user.email} role updated to {data.role} by {current_user.email}"
    )

    return {
        "message": "Role updated successfully",
        "user": {"id": str(user.public_id), "email": user.email, "role": user.role},
    }
