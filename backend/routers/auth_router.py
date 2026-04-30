from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from auth.authenticate import authenticate
from models.user import User
from auth.hash_password import verify_password
from auth.jwt_handler import TokenData, create_access_token, verify_access_token
import logging

from auth.hash_password import hash_password, verify_password
from database import Database
from models.user import User, TokenResponse
from datetime import datetime, timedelta, timezone
import secrets
import resend
from database import get_settings


settings = get_settings()
resend.api_key = settings.RESEND_API_KEY

logger = logging.getLogger(__name__)

auth_router = APIRouter()

user_database = Database(User)


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@auth_router.post("/signup")
async def sign_user_up(user: User) -> dict:
    logger.info(f"User [{user.email}] is signing up.")
    db_user = await User.find_one(User.email == user.email)

    if db_user:
        logger.warning(f"\t User [{user.email}] has already signed up.")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with email provided exists already.",
        )
    hashed_password = hash_password(user.password)
    user.password = str(hashed_password, "utf-8")
    await user_database.save(user)
    logger.info(f"\t User [{user.email}] is created.")
    return {"message": "User created successfully"}


@auth_router.post("/sign-in", response_model=TokenResponse)
async def sign_in(
    user: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> TokenResponse:
    logger.info(f"User [{user.username}] is signing in the system.")

    db_user = await User.find_one(User.email == user.username)

    if not db_user or not db_user.active:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    logger.info(f"\tUser [{user.username}] signed in")

    access_token, expiry = create_access_token(
        {"email": db_user.email, "role": str(db_user.role)}
    )

    return TokenResponse(
        email=db_user.email,
        role=str(db_user.role),
        access_token=access_token,
        expiry=expiry,
    )


@auth_router.get("/me")
async def get_me(
    current_user: Annotated[TokenData, Depends(authenticate)],
) -> TokenData:
    logger.info(f"/me accessed by user={current_user.email}")
    return current_user


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@auth_router.post("/reset-password")
async def reset_password(data: dict):
    token = data["token"]
    new_password = data["new_password"]

    token_data = verify_access_token(token)

    # 🔒 ensure it's a reset token
    if token_data.role != "reset" and getattr(token_data, "type", None) != "reset":
        raise HTTPException(status_code=401, detail="Invalid reset token")

    user = await User.find_one(User.email == token_data.email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(new_password)
    await user.save()

    return {"message": "Password updated successfully"}
# async def reset_password(data: ResetPasswordRequest):
#     token_data = verify_access_token(data.token)

#     if not token_data:
#         raise HTTPException(status_code=400, detail="Invalid or expired token")

#     user = await User.find_one(User.email == token_data.email)

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user.password = hash_password(data.new_password)
#     await user.save()

#     return {"message": "Password updated successfully"}


@auth_router.put("/change-password")
async def change_password(data: dict, current_user=Depends(authenticate)):
    user = await User.find_one(User.email == current_user.email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data["current_password"], user.password):
        raise HTTPException(status_code=401, detail="Incorrect current password")

    user.password = hash_password(data["new_password"])
    await user.save()

    return {"message": "Password updated successfully"}


from pydantic import BaseModel, EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# @auth_router.post("/forgot-password")
# async def forgot_password(data: ForgotPasswordRequest):
#     user = await User.find_one(User.email == data.email)

#     if not user:
#         return {"message": "If that email exists, a reset link was sent."}

#     # generate token
#     token = secrets.token_urlsafe(32)

#     user.reset_token = token
#     user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(minutes=15)
#     await user.save()

#     # create reset link
#     reset_link = f"{settings.FRONTEND_URL}/reset-password.html?token={token}"

#     # send email
#     resend.Emails.send(
#         {
#             "from": "onboarding@resend.dev",
#             "to": user.email,
#             "subject": "Reset your password",
#             "html": f"""
#             <p>Click the link below to reset your password:</p>
#             <a href="{reset_link}">Reset Password</a>
#         """,
#         }
#     )

#     return {"message": "If that email exists, a reset link was sent."}

@auth_router.post("/forgot-password")
async def forgot_password(data: dict):
    email = data["email"]

    user = await User.find_one(User.email == email)

    # always return same message (security best practice)
    if not user:
        return {"message": "If user exists, email sent"}

    reset_token, _ = create_access_token(
        {"email": user.email, "type": "reset"},
        expires_delta=timedelta(minutes=10)
    )

    reset_link = f"http://127.0.0.1:8000/reset-password.html?token={reset_token}"

    # TODO: send via Resend
    print("RESET LINK:", reset_link)

    return {"message": "If user exists, email sent"}