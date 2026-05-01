import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_create_pantry_record(default_client):
    payload = {
        "name": "John Doe",
        "num_ppl_in_families": 3,
    }

    response = await default_client.post("/pantry-records/", json=payload)

    assert response.status_code == 201
    body = response.json()

    assert body["num_ppl_in_families"] == 3
    assert "public_id" in body
    assert "name_id" in body


@pytest.mark.anyio
async def test_get_all_pantry_records(default_client: AsyncClient):
    await default_client.post(
        "/pantry-records/",
        json={
            "name": "Alice",
            "num_ppl_in_families": 2,
        },
    )

    await default_client.post(
        "/pantry-records/",
        json={
            "name": "Bob",
            "num_ppl_in_families": 4,
        },
    )

    response = await default_client.get("/pantry-records/")

    assert response.status_code == 200
    body = response.json()

    assert isinstance(body, list)
    assert len(body) >= 2


@pytest.mark.anyio
async def test_get_pantry_record_success(default_client: AsyncClient):
    create = await default_client.post(
        "/pantry-records/",
        json={
            "name": "Test User",
            "num_ppl_in_families": 1,
        },
    )

    record = create.json()
    record_id = record["public_id"]

    response = await default_client.get(f"/pantry-records/{record_id}")

    assert response.status_code == 200
    body = response.json()

    assert body["public_id"] == record_id
    assert body["num_ppl_in_families"] == 1


@pytest.mark.anyio
async def test_get_pantry_record_not_found(default_client: AsyncClient):
    response = await default_client.get("/pantry-records/does-not-exist")

    assert response.status_code == 404

    try:
        body = response.json()
        assert "not found" in body["detail"].lower()
    except Exception:
        # fallback if response is plain text
        assert "not found" in response.text.lower()


@pytest.mark.anyio
async def test_update_pantry_record_not_found(default_client: AsyncClient):
    response = await default_client.put(
        "/pantry-records/bad-id",
        json={"num_ppl_in_families": 5},
    )

    assert response.status_code == 404

    try:
        body = response.json()
        assert "not found" in body["detail"].lower()
    except Exception:
        assert "not found" in response.text.lower()


@pytest.mark.anyio
async def test_delete_pantry_record(default_client: AsyncClient):
    create = await default_client.post(
        "/pantry-records/",
        json={
            "name": "Delete User",
            "num_ppl_in_families": 2,
        },
    )

    record_id = create.json()["public_id"]

    response = await default_client.delete(f"/pantry-records/{record_id}")

    assert response.status_code == 200

    # confirm deletion
    check = await default_client.get(f"/pantry-records/{record_id}")
    assert check.status_code == 404


@pytest.mark.anyio
async def test_delete_pantry_record_not_found(default_client: AsyncClient):
    response = await default_client.delete("/pantry-records/missing")

    assert response.status_code == 404

    try:
        body = response.json()
        assert "not found" in body["detail"].lower()
    except Exception:
        assert "not found" in response.text.lower()
