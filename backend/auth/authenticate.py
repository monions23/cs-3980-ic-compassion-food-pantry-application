from auth.jwt_handler import TokenData, verify_access_token
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/sign-in")


async def authenticate(token: str = Depends(oauth2_scheme)) -> TokenData:
    # print("TOKEN:", token)
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in for access"
        )

    token_data = verify_access_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in for access"
        )
    # print("TOKEN RECEIVED:", token)
    return token_data


