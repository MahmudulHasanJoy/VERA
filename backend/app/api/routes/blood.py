from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.controllers.blood import BloodController
from app.core.database import get_db
from app.models import BloodGroup, EmergencyStatus, User, UserRole
from app.schemas import BloodRequestCreate, BloodRequestRead, BloodRequestUpdate

router = APIRouter(prefix="/blood", tags=["blood"])


def get_blood_controller(db: Session = Depends(get_db)) -> BloodController:
    return BloodController(db)


@router.get("/requests", response_model=list[BloodRequestRead])
def list_blood_requests(
    status_filter: EmergencyStatus | None = None,
    blood_group: BloodGroup | None = None,
    controller: BloodController = Depends(get_blood_controller),
    _: User = Depends(get_current_user),
) -> list:
    """Router → Controller → Service → Repository"""
    return controller.list_requests(status_filter, blood_group)


@router.post("/requests", response_model=BloodRequestRead, status_code=201)
def create_blood_request(
    payload: BloodRequestCreate,
    controller: BloodController = Depends(get_blood_controller),
    current_user: User = Depends(get_current_user),
):
    """Router → Controller → Service → Repository (+ notify matching donors)."""
    return controller.create_request(payload, current_user)


@router.patch("/requests/{request_id}", response_model=BloodRequestRead)
def update_blood_request(
    request_id: int,
    payload: BloodRequestUpdate,
    controller: BloodController = Depends(get_blood_controller),
    _: User = Depends(
        require_roles(UserRole.DONOR, UserRole.HOSPITAL, UserRole.VOLUNTEER, UserRole.ADMIN)
    ),
):
    return controller.update_request(request_id, payload)


@router.get("/donors", response_model=list[dict])
def find_donors(
    blood_group: BloodGroup,
    controller: BloodController = Depends(get_blood_controller),
    _: User = Depends(get_current_user),
) -> list[dict]:
    return controller.find_donors(blood_group)
