import pytest
from httpx import AsyncClient
from backend.models.user import User
from backend.auth.hash_password import hash_password

@pytest.mark.anyio
async def test_create_user(default_client: AsyncClient):
    payload = {
        "email": "test-create@uiowa.edu",
        "password": "test123",
    }

    response = await default_client.post("/users/", json=payload)

    assert response.status_code == 200
    body = response.json()

    assert body["email"] == payload["email"]

    db_user = await User.find_one(User.email == payload["email"])
    assert db_user is not None

# @pytest.mark.anyio
# async def test_create_user_duplicate_fails(default_client: AsyncClient):
#     email = "duplicate@uiowa.edu"

#     await User.insert_one(
#         User(
#             email=email,
#             password=hash_password("test").decode("utf-8"),
#         )
#     )

#     payload = {
#         "email": email,
#         "password": "newpass",
#     }

#     response = await default_client.post("/users/", json=payload)

#     assert response.status_code == 400
#     assert response.json()["detail"] == "Email already exists"

# @pytest.mark.anyio
# async def test_list_users(default_client: AsyncClient):
#     await User.insert_one(
#         User(email="list@uiowa.edu", password="hashed")
#     )

#     response = await default_client.get("/users/")

#     assert response.status_code == 200
#     assert isinstance(response.json(), list)

# @pytest.mark.anyio
# async def test_get_user_by_id(default_client: AsyncClient):
#     user = User(email="get@uiowa.edu", password="hashed")
#     await user.insert()

#     response = await default_client.get(f"/users/{user.id}")

#     assert response.status_code == 200
#     assert response.json()["email"] == user.email

# @pytest.mark.anyio
# async def test_delete_user(default_client: AsyncClient):
#     user = User(email="delete@uiowa.edu", password="hashed")
#     await user.insert()

#     response = await default_client.delete(f"/users/{user.id}")

#     assert response.status_code == 200
#     assert response.json()["message"] == "User deleted"

#     db_user = await User.get(user.id)
#     assert db_user is None