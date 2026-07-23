from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import EmergencyStatus, EmergencyType, User
from app.schemas import EmergencyRequestCreate, EmergencyRequestUpdate
from app.services.emergency import EmergencyService


class EmergencyController:
    """Orchestrates HTTP concerns for the emergency feature (calls Service)."""

    def __init__(self, db: Session):
        self.service = EmergencyService(db)

    def list_emergencies(
        self,
        status_filter: EmergencyStatus | None = None,
        type_filter: EmergencyType | None = None,
    ):
        return self.service.list_emergencies(status_filter, type_filter)

    def create_emergency(self, payload: EmergencyRequestCreate, current_user: User):
        return self.service.create_emergency(payload, current_user)

    def get_emergency(self, request_id: int):
        request = self.service.get_emergency(request_id)
        if not request:
            raise HTTPException(status_code=404, detail="Emergency request not found")
        return request

    def update_emergency(self, request_id: int, payload: EmergencyRequestUpdate):
        updated = self.service.update_emergency(request_id, payload)
        if not updated:
            raise HTTPException(status_code=404, detail="Emergency request not found")
        return updated
