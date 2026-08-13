from sqlalchemy.orm import Session

from app.models import BloodGroup, BloodRequest, EmergencyStatus, User
from app.repositories.blood import BloodRepository
from app.schemas import BloodRequestCreate, BloodRequestUpdate
from app.services.notifications import create_notification


class BloodService:
    """Business logic for blood requests (matching donors, notifications)."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = BloodRepository(db)

    def list_requests(
        self,
        status_filter: EmergencyStatus | None = None,
        blood_group: BloodGroup | None = None,
    ) -> list[BloodRequest]:
        return self.repo.list_requests(status_filter, blood_group)

    def create_request(self, payload: BloodRequestCreate, requester: User) -> BloodRequest:
        request = BloodRequest(**payload.model_dump(), requester_id=requester.id)
        self.repo.create(request)

        donors = self.repo.find_available_donors(payload.blood_group)
        notified = 0
        for donor in donors:
            if donor.id == requester.id:
                continue
            create_notification(
                self.db,
                user_id=donor.id,
                title="Urgent blood request",
                message=f"{payload.patient_name} needs {payload.blood_group.value} blood.",
                link="/blood",
            )
            notified += 1

        create_notification(
            self.db,
            user_id=requester.id,
            title="Blood request posted",
            message=(
                f"Your request for {payload.blood_group.value} was submitted. "
                f"{notified} matching donor{'s' if notified != 1 else ''} alerted in-app."
            ),
            link="/blood",
            channels=False,
        )

        return self.repo.save(request)

    def update_request(self, request_id: int, payload: BloodRequestUpdate) -> BloodRequest | None:
        request = self.repo.get_by_id(request_id)
        if not request:
            return None

        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(request, field, value)
        return self.repo.save(request)

    def find_donors(self, blood_group: BloodGroup) -> list[dict]:
        donors = self.repo.find_available_donors(blood_group)
        return [
            {
                "id": donor.id,
                "full_name": donor.full_name,
                "phone": donor.phone,
                "blood_group": donor.blood_group.value if donor.blood_group else None,
                "address": donor.address,
            }
            for donor in donors
        ]
