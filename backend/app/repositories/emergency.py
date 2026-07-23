from sqlalchemy.orm import Session

from app.models import EmergencyRequest, EmergencyStatus, EmergencyType


class EmergencyRepository:
    """All database operations for emergency requests."""

    def __init__(self, db: Session):
        self.db = db

    def list(
        self,
        status_filter: EmergencyStatus | None = None,
        type_filter: EmergencyType | None = None,
    ) -> list[EmergencyRequest]:
        query = self.db.query(EmergencyRequest)
        if status_filter:
            query = query.filter(EmergencyRequest.status == status_filter)
        if type_filter:
            query = query.filter(EmergencyRequest.emergency_type == type_filter)
        return query.order_by(EmergencyRequest.created_at.desc()).all()

    def get_by_id(self, request_id: int) -> EmergencyRequest | None:
        return self.db.get(EmergencyRequest, request_id)

    def create(self, request: EmergencyRequest) -> EmergencyRequest:
        self.db.add(request)
        self.db.commit()
        self.db.refresh(request)
        return request

    def save(self, request: EmergencyRequest) -> EmergencyRequest:
        self.db.commit()
        self.db.refresh(request)
        return request
