from typing import Annotated

from fastapi import APIRouter, FastAPI, HTTPException, Path
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from database import init
from routers.stock_router import stock_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await init()
    print("Database connected")

    yield

    # Shutdown logic (optional)
    print("Shutting down...")


app = FastAPI(title="IC Compassion Food Pantry", version="0.135.3", lifespan=lifespan)


@app.get("/")
async def home():
    return FileResponse("frontend/main.html")


app.include_router(stock_router, prefix="/stock", tags=["Stock"])


app.mount("/", StaticFiles(directory="frontend"), name="static")


@app.exception_handler(HTTPException)
async def my_http_exception_handler(request, ex):
    return PlainTextResponse(str(ex.detail), status_code=ex.status_code)
