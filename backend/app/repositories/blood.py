from sqlalchemy.orm import Session

from app.models import BloodGroup, BloodRequest, EmergencyStatus, User, UserRole


class BloodRepository:
    """All database operations for blood requests and donor lookup."""

    def __init__(self, db: Session):
        self.db = db

    def list_requests(
        self,
        status_filter: EmergencyStatus | None = None,
        blood_group: BloodGroup | None = None,
    ) -> list[BloodRequest]:
        query = self.db.query(BloodRequest)
        if status_filter:
            query = query.filter(BloodRequest.status == status_filter)
        if blood_group:
            query = query.filter(BloodRequest.blood_group == blood_group)
        return query.order_by(BloodRequest.created_at.desc()).all()

    def get_by_id(self, request_id: int) -> BloodRequest | None:
        return self.db.get(BloodRequest, request_id)

    def create(self, request: BloodRequest) -> BloodRequest:
        self.db.add(request)
        self.db.flush()
        return request

    def save(self, request: BloodRequest) -> BloodRequest:
        self.db.commit()
        self.db.refresh(request)
        return request

    def find_available_donors(self, blood_group: BloodGroup) -> list[User]:
        return (
            self.db.query(User)
            .filter(
                User.role == UserRole.DONOR,
                User.blood_group == blood_group,
                User.available_for_donation.is_(True),
                User.is_active.is_(True),
            )
            .all()
        )
