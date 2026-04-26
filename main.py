from typing import Annotated
import logging
from fastapi import APIRouter, FastAPI, HTTPException, Path
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from database import init
from routers.auth_router import auth_router
from routers.stock_router import stock_router
from routers.user_router import user_router
from routers.scheduling_router import scheduling_router
from routers.pantry_record_router import pantry_record_router
from logging_setup import setup_logging

setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Application starts up...")
    await init()
    print("Database connected")

    yield

    # Shutdown logic (optional)
    print("Shutting down...")


app = FastAPI(
    title="IC Compassion Food Pantry",
    version="1.0.0",
    swagger_ui_parameters={"persistAuthorization": True},
    lifespan=lifespan,
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://127.0.0.1:5500"] if using Live Server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return FileResponse("frontend/main-logged-out.html")


app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(stock_router, prefix="/stock", tags=["Stock"])
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(scheduling_router, prefix="/scheduling", tags=["Scheduling"])
app.include_router(
    pantry_record_router, prefix="/pantry-records", tags=["Pantry Records"]
)


app.mount("/", StaticFiles(directory="frontend"), name="static")


@app.exception_handler(HTTPException)
async def my_http_exception_handler(request, ex):
    return PlainTextResponse(str(ex.detail), status_code=ex.status_code)
