import pytest
from httpx import AsyncClient
from auth import jwt_handler
from models.scheduling import Scheduling


@pytest.mark.anyio
async def test_create_schedule(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token(
        {"email": "user@test.com", "role": "BasicUser"}
    )

    payload = {"name": "Test User", "date": "2026-05-01T10:00:00"}

    response = await default_client.post(
        "/scheduling/", json=payload, headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200

    body = response.json()

    assert body["email"] == "user@test.com"
    assert body["name"] == "Test User"


# get my schedule
@pytest.mark.anyio
async def test_get_my_schedule(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token(
        {"email": "me@test.com", "role": "BasicUser"}
    )

    # create schedule first
    await default_client.post(
        "/scheduling/",
        json={"name": "Me", "date": "2026-05-01T10:00:00"},
        headers={"Authorization": f"Bearer {token}"},
    )

    response = await default_client.get(
        "/scheduling/me", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert len(response.json()) > 0


# get all (admin only)
@pytest.mark.anyio
async def test_get_all_schedules_admin(default_client: AsyncClient):
    admin_token, _ = jwt_handler.create_access_token(
        {"email": "admin@test.com", "role": "SuperAdmin"}
    )

    response = await default_client.get(
        "/scheduling/", headers={"Authorization": f"Bearer {admin_token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


# get all from basicuser role (forbidden)
@pytest.mark.anyio
async def test_get_all_schedules_forbidden(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token(
        {"email": "user@test.com", "role": "BasicUser"}
    )

    response = await default_client.get(
        "/scheduling/", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 403


# get user schedule
@pytest.mark.anyio
async def test_get_user_schedule(default_client: AsyncClient):
    response = await default_client.get("/scheduling/user/user@test.com")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


# update schedule
@pytest.mark.anyio
async def test_update_schedule(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token(
        {"email": "user@test.com", "role": "BasicUser"}
    )

    create = await default_client.post(
        "/scheduling/",
        json={"name": "Update Me", "date": "2026-05-01T10:00:00"},
        headers={"Authorization": f"Bearer {token}"},
    )

    schedule_id = create.json().get("id") or create.json().get("_id")

    response = await default_client.put(
        f"/scheduling/{schedule_id}",
        json={"name": "Updated Name", "date": "2026-05-02T10:00:00"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200


# delete schedule
@pytest.mark.anyio
async def test_delete_schedule(default_client: AsyncClient):
    token, _ = jwt_handler.create_access_token(
        {"email": "user@test.com", "role": "BasicUser"}
    )

    create = await default_client.post(
        "/scheduling/",
        json={"name": "Delete Me", "date": "2026-05-01T10:00:00"},
        headers={"Authorization": f"Bearer {token}"},
    )

    schedule_id = create.json().get("id") or create.json().get("_id")

    response = await default_client.delete(
        f"/scheduling/{schedule_id}", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
