from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import os
import shutil
from auth.authenticate import authenticate
from models.files import FileRecord

files_router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@files_router.post("/upload")
async def upload_file(file: UploadFile = File(...), user=Depends(authenticate)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    record = FileRecord(
        filename=file.filename,
        filepath=file_path,
        uploaded_by=user.email
    )
    await record.insert()

    return record

@files_router.get("/files")
async def get_files(user=Depends(authenticate)):
    return await FileRecord.find_all().to_list()

from fastapi.responses import FileResponse

@files_router.get("/files/download/{file_id}")
async def download_file(file_id: str):
    file = await FileRecord.get(file_id)

    return FileResponse(
        path=file.filepath,
        filename=file.filename
    )


@files_router.delete("/files/{file_id}")
async def delete_file(file_id: str, user=Depends(authenticate)):

    file = await FileRecord.get(file_id)

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    if file.uploaded_by != user.email and user.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this file")

    await file.delete()

    return {"message": "File deleted"}
