import asyncio
from functools import lru_cache

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings, SettingsConfigDict
from pymongo import AsyncMongoClient
from models.pantry_record import PantryRecord
from models.scheduling import Scheduling
from models.user import User
from models.stock import Stock
from beanie.operators import Set


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings():
    return Settings()


async def init():

    settings = get_settings()

    client = AsyncMongoClient(settings.DATABASE_URL)
    await init_beanie(
        database=client.get_default_database(),
        document_models=[User, Stock, PantryRecord, Scheduling],
    )


# asyncio.run(init())
