from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.models import EmergencyRequest, EmergencyStatus, EmergencyType, User, UserRole
from app.repositories.emergency import EmergencyRepository
from app.schemas import EmergencyRequestCreate, EmergencyRequestUpdate
from app.services.notifications import create_notification


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
        self.repo.create(request)

        create_notification(
            self.db,
            user_id=requester.id,
            title="Emergency submitted",
            message=f"Your request \"{payload.title}\" is live. Verified responders can see it now.",
            link="/emergencies",
            channels=False,
        )

        responders = (
            self.db.query(User)
            .filter(
                User.is_active.is_(True),
                User.id != requester.id,
                or_(
                    and_(User.role == UserRole.VOLUNTEER, User.is_verified.is_(True)),
                    User.role.in_([UserRole.NGO, UserRole.HOSPITAL, UserRole.ADMIN]),
                ),
            )
            .all()
        )
        for responder in responders:
            create_notification(
                self.db,
                user_id=responder.id,
                title="New emergency request",
                message=f"{payload.title} ({payload.emergency_type.value}) — {payload.location or 'location pending'}",
                link="/emergencies",
                channels=False,
            )

        return self.repo.save(request)

    def get_emergency(self, request_id: int) -> EmergencyRequest | None:
        return self.repo.get_by_id(request_id)

    def update_emergency(
        self, request_id: int, payload: EmergencyRequestUpdate
    ) -> EmergencyRequest | None:
        request = self.repo.get_by_id(request_id)
        if not request:
            return None

        previous_status = request.status
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(request, field, value)

        if payload.status and payload.status != previous_status:
            create_notification(
                self.db,
                user_id=request.requester_id,
                title="Emergency status updated",
                message=f"Your request \"{request.title}\" is now {payload.status.value}.",
                link="/emergencies",
                channels=False,
            )

        return self.repo.save(request)
