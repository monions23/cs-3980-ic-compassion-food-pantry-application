import asyncio

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from models.pantry_record import PantryRecord
from models.scheduling import Scheduling
from models.user import User
from models.stock import Stock
from beanie.operators import Set


async def init():
    client = AsyncIOMotorClient("mongodb://localhost:27017/")

    db = client["food_pantry_db"]
    await init_beanie(
        database=db, document_models=[User, Stock, PantryRecord, Scheduling]
    )

    # test
    s = await User.insert_one(User(email="hi@gmail.com", password="12345", role="user"))
    print(s)


# asyncio.run(init())
