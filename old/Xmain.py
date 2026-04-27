from typing import Annotated

from fastapi import APIRouter, FastAPI, HTTPException, Path
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles

from old.Xtracker_routes import tracker_router

app = FastAPI(title="Lab Reagent Tracker", version="1.0.0")


@app.get("/")
async def home():
    return FileResponse("./frontend/index.html")


app.include_router(tracker_router, tags=["Reagents"], prefix="/reagents")


app.mount("/", StaticFiles(directory="frontend"), name="static")


@app.exception_handler(HTTPException)
async def my_http_exception_handler(request, ex):
    return PlainTextResponse(str(ex.detail), status_code=ex.status_code)
