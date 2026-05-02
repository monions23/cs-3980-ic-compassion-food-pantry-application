import pytest
from httpx import AsyncClient, patch

from models.user import User
from auth.hash_password import hash_password
from auth.jwt_handler import create_access_token
from datetime import timedelta


@pytest.mark.anyio
async def test_signup_success(default_client: AsyncClient):
    payload = {
        "email": "signup@test.com",
        "password": "test123",
    }

    res = await default_client.post("/auth/signup", json=payload)

    assert res.status_code == 200
    assert res.json()["message"] == "User created successfully"

    db_user = await User.find_one(User.email == payload["email"])
    assert db_user is not None


@pytest.mark.anyio
async def test_signup_duplicate(default_client: AsyncClient):
    email = "dup@test.com"

    await User.insert_one(
        User(
            email=email,
            password=hash_password("test").decode("utf-8"),
        )
    )

    res = await default_client.post(
        "/auth/signup",
        json={"email": email, "password": "newpass"},
    )

    assert res.status_code == 409


@pytest.mark.anyio
async def test_signin_success(default_client: AsyncClient):
    email = "login@test.com"
    password = "mypassword"

    await User.insert_one(
        User(
            email=email,
            password=hash_password(password).decode("utf-8"),
        )
    )

    res = await default_client.post(
        "/auth/sign-in",
        data={"username": email, "password": password},
    )

    assert res.status_code == 200

    body = res.json()
    assert body["email"] == email
    assert "access_token" in body


@pytest.mark.anyio
async def test_signin_wrong_password(default_client: AsyncClient):
    email = "wrong@test.com"

    await User.insert_one(
        User(
            email=email,
            password=hash_password("correct").decode("utf-8"),
        )
    )

    res = await default_client.post(
        "/auth/sign-in",
        data={"username": email, "password": "wrong"},
    )

    assert res.status_code == 401


@pytest.mark.anyio
async def test_signin_user_not_found(default_client: AsyncClient):
    res = await default_client.post(
        "/auth/sign-in",
        data={"username": "nope@test.com", "password": "1234"},
    )

    assert res.status_code == 401


@pytest.mark.anyio
async def test_get_me(default_client: AsyncClient, access_token: str):
    res = await default_client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert res.status_code == 200
    body = res.json()

    assert body["email"] == "test@uiowa.edu"


@pytest.mark.anyio
async def test_get_me_no_token(default_client: AsyncClient):
    res = await default_client.get("/auth/me")

    assert res.status_code == 401


@pytest.mark.anyio
async def test_change_password_success(default_client: AsyncClient):
    email = "change@test.com"
    password = "oldpass"

    await User.insert_one(
        User(
            email=email,
            password=hash_password(password).decode("utf-8"),
        )
    )

    # login first
    login = await default_client.post(
        "/auth/sign-in",
        data={"username": email, "password": password},
    )

    token = login.json()["access_token"]

    res = await default_client.put(
        "/auth/change-password",
        json={
            "current_password": password,
            "new_password": "newpass",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200


@pytest.mark.anyio
async def test_change_password_success(default_client: AsyncClient):
    email = "change@test.com"
    password = "oldpass"

    await User.insert_one(
        User(
            email=email,
            password=hash_password(password).decode("utf-8"),
        )
    )

    # login first
    login = await default_client.post(
        "/auth/sign-in",
        data={"username": email, "password": password},
    )

    token = login.json()["access_token"]

    res = await default_client.put(
        "/auth/change-password",
        json={
            "current_password": password,
            "new_password": "newpass",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200


from backend.auth.jwt_handler import create_access_token
from datetime import timedelta


@pytest.mark.anyio
async def test_reset_password_success(default_client: AsyncClient):
    email = "reset@test.com"

    await User.insert_one(
        User(
            email=email,
            password=hash_password("oldpass").decode("utf-8"),
        )
    )

    token, _ = create_access_token(
        {"email": email, "type": "reset"},
        expires_delta=timedelta(minutes=10),
    )

    res = await default_client.post(
        "/auth/reset-password",
        json={
            "token": token,
            "new_password": "newpass",
        },
    )

    assert res.status_code == 200


@pytest.mark.anyio
async def test_reset_password_invalid_token(default_client: AsyncClient):
    res = await default_client.post(
        "/auth/reset-password",
        json={
            "token": "invalid",
            "new_password": "1234",
        },
    )

    assert res.status_code == 401


@pytest.mark.anyio
async def test_reset_password_wrong_token_type(default_client: AsyncClient):
    email = "wrongtype@test.com"

    await User.insert_one(
        User(
            email=email,
            password=hash_password("oldpass").decode("utf-8"),
        )
    )

    # normal login token, NOT reset token
    token, _ = create_access_token({"email": email, "role": "BasicUser"})

    res = await default_client.post(
        "/auth/reset-password",
        json={
            "token": token,
            "new_password": "newpass",
        },
    )

    assert res.status_code == 401


@pytest.mark.anyio
async def test_signin_inactive_user(default_client: AsyncClient):
    email = "inactive@test.com"

    await User.insert_one(
        User(
            email=email,
            password=hash_password("test").decode("utf-8"),
            active=False,
        )
    )

    res = await default_client.post(
        "/auth/sign-in",
        data={"username": email, "password": "test"},
    )

    assert res.status_code == 401


@pytest.mark.anyio
async def test_get_me_invalid_token(default_client: AsyncClient):
    res = await default_client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalidtoken"},
    )

    assert res.status_code == 401


@pytest.mark.anyio
async def test_reset_password_user_not_found(default_client: AsyncClient):

    token, _ = create_access_token(
        {"email": "ghost@test.com", "type": "reset"},
        expires_delta=timedelta(minutes=10),
    )

    res = await default_client.post(
        "/auth/reset-password",
        json={
            "token": token,
            "new_password": "newpass",
        },
    )

    assert res.status_code == 404


@pytest.mark.anyio
async def test_reset_password_expired_token(default_client: AsyncClient):

    email = "expired@test.com"

    await User.insert_one(
        User(
            email=email,
            password=hash_password("old").decode("utf-8"),
        )
    )

    token, _ = create_access_token(
        {"email": email, "type": "reset"},
        expires_delta=timedelta(seconds=-1),  # already expired
    )

    res = await default_client.post(
        "/auth/reset-password",
        json={
            "token": token,
            "new_password": "newpass",
        },
    )

    assert res.status_code in (401, 403)


@pytest.mark.anyio
async def test_change_password_user_not_found(default_client: AsyncClient):
    from backend.auth.jwt_handler import create_access_token

    token, _ = create_access_token({"email": "ghost@test.com", "role": "BasicUser"})

    res = await default_client.put(
        "/auth/change-password",
        json={
            "current_password": "x",
            "new_password": "y",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404
