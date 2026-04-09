from typing import Annotated

from fastapi import APIRouter, FastAPI, HTTPException, Path
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from database import init

# from old.Xtracker_routes import tracker_router

app = FastAPI(title="IC Compassion Food Pantry", version="1.0.0")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await init()
    print("Database connected")

    yield

    # Shutdown logic (optional)
    print("Shutting down...")


app = FastAPI(title="IC Compassion Food Pantry", version="1.0.0", lifespan=lifespan)


@app.get("/")
async def home():
    return {"message": "Food Pantry API running"}


# app.include_router(tracker_router, tags=["Reagents"], prefix="/reagents")


# app.mount("/", StaticFiles(directory="frontend"), name="static")


# @app.exception_handler(HTTPException)
# async def my_http_exception_handler(request, ex):
#     return PlainTextResponse(str(ex.detail), status_code=ex.status_code)
