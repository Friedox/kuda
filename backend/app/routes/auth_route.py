from fastapi import APIRouter, Depends

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from ..services import auth_service
from ..database import get_async_db
from ..schemas.user_scheme import CreateUserScheme, CredentialsScheme
from ..services.response_service import ResponseService

router = APIRouter()


@router.post("/signup", tags=["auth"])
async def sign_up(user: CreateUserScheme, db: AsyncSession = Depends(get_async_db)):
    return await ResponseService.response(
        auth_service.register_user(user, db)
    )


@router.post("/login")
async def login(user: CredentialsScheme, db: AsyncSession = Depends(get_async_db)):
    return await ResponseService.response(
        auth_service.login_user(user, db)
    )


@router.post("/set_pass")
async def set_pass(new_pass: str, request: Request, db: AsyncSession = Depends(get_async_db)):
    return await ResponseService.response(
        auth_service.set_pass(new_pass, request, db)
    )


@router.get("/getusers/me")
async def get_info(request: Request, db: AsyncSession = Depends(get_async_db)):
    return await ResponseService.response(
        auth_service.get_info(request, db)
    )


@router.post("/logout")
async def logout(request: Request):
    return await ResponseService.response(
        auth_service.logout(request)
    )