from sqlalchemy.orm import Session

from app.models import EmergencyRequest, EmergencyStatus, EmergencyType, User
from app.repositories.emergency import EmergencyRepository
from app.schemas import EmergencyRequestCreate, EmergencyRequestUpdate


class EmergencyService:
    """Business logic for emergency requests."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = EmergencyRepository(db)

    def list_emergencies(
        self,
        status_filter: EmergencyStatus | None = None,
        type_filter: EmergencyType | None = None,
    ) -> list[EmergencyRequest]:
        return self.repo.list(status_filter, type_filter)

    def create_emergency(
        self, payload: EmergencyRequestCreate, requester: User
    ) -> EmergencyRequest:
        request = EmergencyRequest(**payload.model_dump(), requester_id=requester.id)
        return self.repo.create(request)

    def get_emergency(self, request_id: int) -> EmergencyRequest | None:
        return self.repo.get_by_id(request_id)

    def update_emergency(
        self, request_id: int, payload: EmergencyRequestUpdate
    ) -> EmergencyRequest | None:
        request = self.repo.get_by_id(request_id)
        if not request:
            return None

        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(request, field, value)
        return self.repo.save(request)
