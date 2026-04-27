from datetime import datetime
from enum import StrEnum, unique

from beanie import Document
from pydantic import BaseModel, ConfigDict, EmailStr


@unique
class UserRole(StrEnum):
    BasicUser = "BasicUser"
    SuperAdmin = "SuperAdmin"


class User(Document):
    email: EmailStr
    role: UserRole = UserRole.BasicUser
    password: str = ""
    active: bool = True

    model_config = ConfigDict(
        json_schema_extra={
            "example": {"email": "python-web-dev@cs.uiowa.edu", "password": "strong!!!"}
        }
    )

    class Settings:
        name = "users"


class TokenResponse(BaseModel):
    email: str
    role: str
    access_token: str
    expiry: datetime


class UserDto(BaseModel):
    id: str
    email: EmailStr = ""
    role: str = UserRole.BasicUser
    active: bool = True
