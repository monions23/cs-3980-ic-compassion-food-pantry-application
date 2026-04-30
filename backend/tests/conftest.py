import os
from typing import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient

from backend.auth import jwt_handler
from backend.database import get_settings, init
from backend.main import app
from backend.models.user import User


# ==========================
# TEST CONFIG

TEST_DATABASE_URL = "mongodb://localhost:27017/test_db"
TEST_SECRET_KEY = "test_secret_key_for_tests_1234567890"

# override env vars
os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["SECRET_KEY"] = TEST_SECRET_KEY

# refresh cached settings
get_settings.cache_clear()

# override JWT secret
jwt_handler.SECRET_KEY = TEST_SECRET_KEY


# CLIENT FIXTURE

@pytest.fixture
async def default_client() -> AsyncGenerator[AsyncClient, None]:
    # initialize DB
    await init()

    # clean database BEFORE each test
    await User.find_all().delete()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        yield client


# AUTH TOKEN FIXTURE

@pytest.fixture
async def access_token() -> str:
    token, _ = jwt_handler.create_access_token(
        {
            "email": "test@uiowa.edu",
            "role": "BasicUser"
        }
    )
    return token