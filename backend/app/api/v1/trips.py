from fastapi import APIRouter, Depends
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from models import database_helper
from schemas.filter_scheme import FilterScheme
from schemas.trip_scheme import RequestTripScheme
from services import trip_service, tag_service
from services.response_service import ResponseService

router = APIRouter(tags=["Trips"])


@router.post("/")
async def create(trip: RequestTripScheme, request: Request,
                 db: AsyncSession = Depends(database_helper.session_getter)):
    return await ResponseService.response(
        trip_service.create(trip, request, db)
    )


@router.get("/{trip_id}")
async def get(trip_id: int, db: AsyncSession = Depends(database_helper.session_getter)):
    return await ResponseService.response(
        trip_service.get(trip_id=trip_id, db=db)
    )


@router.delete("/{trip_id}")
async def delete(trip_id: int, request: Request, db: AsyncSession = Depends(database_helper.session_getter)):
    return await ResponseService.response(
        trip_service.delete(trip_id, request, db)
    )


@router.get("/get_user_trips/")
async def get_user_trips(request: Request, db: AsyncSession = Depends(database_helper.session_getter)):
    print(1)
    return await ResponseService.response(
        trip_service.get_user_trips(request, db)
    )


@router.get("/get_available_tags/")
async def get_available_tags(db: AsyncSession = Depends(database_helper.session_getter)):
    return await ResponseService.response(
        tag_service.get_available_tags(db)
    )


@router.post("/get_filtered/")
async def get_filtered(trip_filter: FilterScheme, db: AsyncSession = Depends(database_helper.session_getter)):
    return await ResponseService.response(
        trip_service.get_filtered(trip_filter, db)
    )


@router.get("/get_upcoming/")
async def get_upcoming(request: Request, db: AsyncSession = Depends(database_helper.session_getter)):
    return await ResponseService.response(
        trip_service.get_upcoming(request, db)
    )