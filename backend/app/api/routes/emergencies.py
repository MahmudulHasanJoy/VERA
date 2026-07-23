from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.controllers.emergency import EmergencyController
from app.core.database import get_db
from app.models import EmergencyStatus, EmergencyType, User, UserRole
from app.schemas import EmergencyRequestCreate, EmergencyRequestRead, EmergencyRequestUpdate

router = APIRouter(prefix="/emergencies", tags=["emergencies"])


def get_emergency_controller(db: Session = Depends(get_db)) -> EmergencyController:
    return EmergencyController(db)


@router.get("", response_model=list[EmergencyRequestRead])
def list_emergencies(
    status_filter: EmergencyStatus | None = None,
    type_filter: EmergencyType | None = None,
    controller: EmergencyController = Depends(get_emergency_controller),
    _: User = Depends(get_current_user),
) -> list:
    """Router → Controller → Service → Repository"""
    return controller.list_emergencies(status_filter, type_filter)


@router.post("", response_model=EmergencyRequestRead, status_code=201)
def create_emergency(
    payload: EmergencyRequestCreate,
    controller: EmergencyController = Depends(get_emergency_controller),
    current_user: User = Depends(get_current_user),
):
    """Router → Controller → Service → Repository"""
    return controller.create_emergency(payload, current_user)


@router.get("/{request_id}", response_model=EmergencyRequestRead)
def get_emergency(
    request_id: int,
    controller: EmergencyController = Depends(get_emergency_controller),
    _: User = Depends(get_current_user),
):
    return controller.get_emergency(request_id)


@router.patch("/{request_id}", response_model=EmergencyRequestRead)
def update_emergency(
    request_id: int,
    payload: EmergencyRequestUpdate,
    controller: EmergencyController = Depends(get_emergency_controller),
    _: User = Depends(
        require_roles(UserRole.VOLUNTEER, UserRole.NGO, UserRole.HOSPITAL, UserRole.ADMIN)
    ),
):
    return controller.update_emergency(request_id, payload)
