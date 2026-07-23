from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import BloodGroup, EmergencyStatus, User
from app.schemas import BloodRequestCreate, BloodRequestUpdate
from app.services.blood import BloodService


class BloodController:
    """Orchestrates HTTP concerns for the blood feature (calls Service)."""

    def __init__(self, db: Session):
        self.service = BloodService(db)

    def list_requests(
        self,
        status_filter: EmergencyStatus | None = None,
        blood_group: BloodGroup | None = None,
    ):
        return self.service.list_requests(status_filter, blood_group)

    def create_request(self, payload: BloodRequestCreate, current_user: User):
        return self.service.create_request(payload, current_user)

    def update_request(self, request_id: int, payload: BloodRequestUpdate):
        updated = self.service.update_request(request_id, payload)
        if not updated:
            raise HTTPException(status_code=404, detail="Blood request not found")
        return updated

    def find_donors(self, blood_group: BloodGroup):
        return self.service.find_donors(blood_group)
