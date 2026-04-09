from beanie import Document


class User(Document):
    email: str
    password: str
    role: str # will be admin or user

    class Settings:
        name = "users"
