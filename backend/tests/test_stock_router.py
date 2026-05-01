import pytest
from httpx import AsyncClient

from models.stock import Stock


@pytest.mark.anyio
async def test_create_stock(default_client: AsyncClient):
    payload = {
        "public_id": "item-1",
        "item_name": "Rice",
        "quantity": 10,
        "target_quantity": 50,
    }

    res = await default_client.post("/stock/", json=payload)

    assert res.status_code == 201

    body = res.json()
    assert body["public_id"] == payload["public_id"]
    assert body["item_name"] == payload["item_name"]

    db_item = await Stock.find_one(Stock.public_id == payload["public_id"])
    assert db_item is not None



@pytest.mark.anyio
async def test_get_all_stocks(default_client: AsyncClient):
    await Stock.insert_one(
        Stock(
            public_id="item-1",
            item_name="Beans",
            quantity=5,
            target_quantity=20,
        )
    )

    res = await default_client.get("/stock/")

    assert res.status_code == 200

    body = res.json()
    assert isinstance(body, list)
    assert len(body) == 1
    assert body[0]["item_name"] == "Beans"


@pytest.mark.anyio
async def test_get_stock_success(default_client: AsyncClient):
    await Stock.insert_one(
        Stock(
            public_id="item-1",
            item_name="Milk",
            quantity=8,
            target_quantity=30,
        )
    )

    res = await default_client.get("/stock/item-1")

    assert res.status_code == 200
    assert res.json()["item_name"] == "Milk"


@pytest.mark.anyio
async def test_get_stock_not_found(default_client: AsyncClient):
    res = await default_client.get("/stock/does-not-exist")

    assert res.status_code == 404

@pytest.mark.anyio
async def test_update_stock_success(default_client: AsyncClient):
    await Stock.insert_one(
        Stock(
            public_id="item-1",
            item_name="Eggs",
            quantity=12,
            target_quantity=40,
        )
    )

    res = await default_client.put(
        "/stock/item-1",
        json={"quantity": 20},
    )

    assert res.status_code == 200
    assert res.json()["quantity"] == 20

    db_item = await Stock.find_one(Stock.public_id == "item-1")
    assert db_item.quantity == 20


@pytest.mark.anyio
async def test_update_stock_not_found(default_client: AsyncClient):
    res = await default_client.put(
        "/stock/missing",
        json={"quantity": 20},
    )

    assert res.status_code == 404


@pytest.mark.anyio
async def test_delete_stock_success(default_client: AsyncClient):
    await Stock.insert_one(
        Stock(
            public_id="item-1",
            item_name="Bread",
            quantity=6,
            target_quantity=25,
        )
    )

    res = await default_client.delete("/stock/item-1")

    assert res.status_code == 200
    assert res.json()["message"] == "Stock deleted successfully"

    db_item = await Stock.find_one(Stock.public_id == "item-1")
    assert db_item is None


@pytest.mark.anyio
async def test_delete_stock_not_found(default_client: AsyncClient):
    res = await default_client.delete("/stock/missing")

    assert res.status_code == 404