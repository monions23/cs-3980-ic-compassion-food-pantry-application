# import asyncio
# from functools import lru_cache
# import json
# from typing import Any

# from beanie import PydanticObjectId, init_beanie
# from motor.motor_asyncio import AsyncIOMotorClient
# from pydantic import BaseModel
# from pydantic_settings import BaseSettings, SettingsConfigDict
# from pymongo import AsyncMongoClient
# from models.pantry_record import PantryRecord
# from models.scheduling import Scheduling
# from models.user import User
# from models.stock import Stock
# from beanie.operators import Set
from functools import lru_cache
import json
from typing import Any

from beanie import init_beanie, PydanticObjectId
from pydantic_settings import BaseSettings, SettingsConfigDict
from models.stock import Stock
from models.user import User
from models.scheduling import Scheduling
from models.pantry_record import PantryRecord
from pymongo import AsyncMongoClient
from pydantic import BaseModel


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

class Database:
    def __init__(self, model):
        self.model = model

    async def save(self, document) -> PydanticObjectId:
        m = await document.create()
        return m.id

    async def get(self, id: PydanticObjectId) -> Any:
        doc = await self.model.get(id)
        if doc:
            return doc
        return False

    async def get_all(self) -> list[Any]:
        docs = await self.model.find_all().to_list()
        return docs

    async def update(self, id: PydanticObjectId, body: BaseModel) -> Any:
        doc_id = id
        des_body = body.model_dump_json(exclude_defaults=True)
        des_body = json.loads(des_body)
        doc = await self.get(doc_id)
        if not doc:
            return False
        await doc.set(des_body)
        return doc

    async def delete(self, id: PydanticObjectId) -> bool:
        doc = await self.get(id)
        if not doc:
            return False
        await doc.delete()
        return True

# asyncio.run(init())
