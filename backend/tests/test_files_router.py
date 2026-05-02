import pytest
from httpx import AsyncClient
from auth import jwt_handler
from models.files import FileRecord


# upload file
@pytest.mark.anyio
async def test_upload_file(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token(
        {"email": "user@test.com", "role": "BasicUser"}
    )

    file_content = b"hello world"

    files = {"file": ("test.txt", file_content, "text/plain")}

    response = await default_client.post(
        "/upload", files=files, headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    body = response.json()

    assert body["filename"] == "test.txt"
    assert body["uploaded_by"] == "user@test.com"


# get all files
@pytest.mark.anyio
async def test_get_files(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token(
        {"email": "user@test.com", "role": "BasicUser"}
    )

    await default_client.post(
        "/upload",
        files={"file": ("a.txt", b"abc", "text/plain")},
        headers={"Authorization": f"Bearer {token}"},
    )

    response = await default_client.get(
        "/files", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


# download file
@pytest.mark.anyio
async def test_download_file(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token(
        {"email": "user@test.com", "role": "BasicUser"}
    )

    upload = await default_client.post(
        "/upload",
        files={"file": ("download.txt", b"data", "text/plain")},
        headers={"Authorization": f"Bearer {token}"},
    )

    file_id = upload.json()["_id"]

    response = await default_client.get(f"/files/download/{file_id}")

    assert response.status_code == 200
    assert response.headers["content-disposition"].startswith("attachment")


# delete file by owner
@pytest.mark.anyio
async def test_delete_file_owner(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token({
        "email": "user@test.com",
        "role": "BasicUser"
    })

    upload = await default_client.post(
        "/upload",
        files={"file": ("delete.txt", b"delete me", "text/plain")},
        headers={"Authorization": f"Bearer {token}"}
    )

    file_id = upload.json()["_id"]

    response = await default_client.delete(
        f"/files/{file_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["message"] == "File deleted"


# attemping to delete file as non-owner should fail
@pytest.mark.anyio
async def test_delete_file_forbidden(default_client: AsyncClient):
    owner_token, _ = jwt_handler.create_access_token({
        "email": "owner@test.com",
        "role": "BasicUser"
    })

    other_token, _ = jwt_handler.create_access_token({
        "email": "other@test.com",
        "role": "BasicUser"
    })

    upload = await default_client.post(
        "/upload",
        files={"file": ("secret.txt", b"secret", "text/plain")},
        headers={"Authorization": f"Bearer {owner_token}"}
    )

    file_id = upload.json()["_id"]

    response = await default_client.delete(
        f"/files/{file_id}",
        headers={"Authorization": f"Bearer {other_token}"}
    )

    assert response.status_code == 403


# delete file not found
@pytest.mark.anyio
async def test_delete_file_not_found(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token({
        "email": "user@test.com",
        "role": "SuperAdmin"
    })

    fake_id = "507f1f77bcf86cd799439011"  # valid ObjectId

    response = await default_client.delete(
        f"/files/{fake_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 404
