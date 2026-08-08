from __future__ import annotations

from typing import Any

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models import (
    BloodGroup,
    BloodRequest,
    CampaignStatus,
    CoordinationStatus,
    CoverageStatus,
    DisasterCoverage,
    Donation,
    EmergencyRequest,
    EmergencyStatus,
    EmergencyType,
    FundraisingCampaign,
    IncidentReport,
    NGOCoordination,
    Notification,
    OpportunityStatus,
    Resource,
    ResourceType,
    Shelter,
    User,
    UserRole,
    VolunteerOpportunity,
)


def _clamp_limit(limit: int | None, default: int = 10, maximum: int = 25) -> int:
    if limit is None:
        return default
    return max(1, min(int(limit), maximum))


def _enum_value(value: Any) -> Any:
    return value.value if hasattr(value, "value") else value


def _like(column, query: str | None):
    if not query or not query.strip():
        return None
    return column.ilike(f"%{query.strip()}%")


def build_assistant_tools(db: Session, user: User | None) -> list:
    """Python tools Gemini can call against the live VERA database."""

    def get_platform_summary() -> dict[str, Any]:
        """Get live counts across VERA: emergencies, blood, shelters, volunteers, campaigns, coverage."""
        return {
            "open_emergencies": db.query(EmergencyRequest)
            .filter(EmergencyRequest.status == EmergencyStatus.OPEN)
            .count(),
            "open_blood_requests": db.query(BloodRequest)
            .filter(BloodRequest.status == EmergencyStatus.OPEN)
            .count(),
            "active_shelters": db.query(Shelter).filter(Shelter.is_active.is_(True)).count(),
            "shelters_with_free_beds": db.query(Shelter)
            .filter(Shelter.is_active.is_(True), Shelter.available_beds > 0)
            .count(),
            "available_blood_donors": db.query(User)
            .filter(
                User.role == UserRole.DONOR,
                User.available_for_donation.is_(True),
                User.is_active.is_(True),
            )
            .count(),
            "verified_volunteers": db.query(User)
            .filter(User.role == UserRole.VOLUNTEER, User.is_verified.is_(True))
            .count(),
            "active_campaigns": db.query(FundraisingCampaign)
            .filter(FundraisingCampaign.status == CampaignStatus.ACTIVE)
            .count(),
            "open_incidents": db.query(IncidentReport)
            .filter(IncidentReport.status == EmergencyStatus.OPEN)
            .count(),
            "open_volunteer_opportunities": db.query(VolunteerOpportunity)
            .filter(VolunteerOpportunity.status == OpportunityStatus.OPEN)
            .count(),
            "underserved_or_critical_areas": db.query(DisasterCoverage)
            .filter(
                DisasterCoverage.coverage_status.in_(
                    [CoverageStatus.UNDERSERVED, CoverageStatus.CRITICAL]
                )
            )
            .count(),
            "total_resources": db.query(Resource).count(),
            "open_coordination_requests": db.query(NGOCoordination)
            .filter(NGOCoordination.status == CoordinationStatus.OPEN)
            .count(),
        }

    def search_emergencies(
        status: str | None = "open",
        emergency_type: str | None = None,
        location_query: str | None = None,
        limit: int = 10,
    ) -> dict[str, Any]:
        """Search emergency help requests. status examples: open, in_progress, resolved. type examples: medical, blood, shelter, rescue."""
        q = db.query(EmergencyRequest)
        if status:
            try:
                q = q.filter(EmergencyRequest.status == EmergencyStatus(status.lower()))
            except ValueError:
                return {"error": f"Unknown status '{status}'", "items": []}
        if emergency_type:
            try:
                q = q.filter(EmergencyRequest.emergency_type == EmergencyType(emergency_type.lower()))
            except ValueError:
                return {"error": f"Unknown emergency_type '{emergency_type}'", "items": []}
        loc = _like(EmergencyRequest.location, location_query)
        if loc is not None:
            q = q.filter(loc)
        rows = q.order_by(EmergencyRequest.created_at.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "title": row.title,
                    "description": (row.description or "")[:240],
                    "type": _enum_value(row.emergency_type),
                    "status": _enum_value(row.status),
                    "location": row.location,
                    "contact_phone": row.contact_phone,
                    "created_at": row.created_at.isoformat() if row.created_at else None,
                }
                for row in rows
            ],
        }

    def search_blood_requests(
        blood_group: str | None = None,
        status: str | None = "open",
        location_query: str | None = None,
        limit: int = 10,
    ) -> dict[str, Any]:
        """Search blood donation requests. blood_group examples: A+, O-, B+."""
        q = db.query(BloodRequest)
        if status:
            try:
                q = q.filter(BloodRequest.status == EmergencyStatus(status.lower()))
            except ValueError:
                return {"error": f"Unknown status '{status}'", "items": []}
        if blood_group:
            try:
                q = q.filter(BloodRequest.blood_group == BloodGroup(blood_group))
            except ValueError:
                return {"error": f"Unknown blood_group '{blood_group}'", "items": []}
        if location_query and location_query.strip():
            pattern = f"%{location_query.strip()}%"
            q = q.filter(
                or_(
                    BloodRequest.location.ilike(pattern),
                    BloodRequest.hospital_name.ilike(pattern),
                )
            )
        rows = q.order_by(BloodRequest.created_at.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "patient_name": row.patient_name,
                    "blood_group": _enum_value(row.blood_group),
                    "units_needed": row.units_needed,
                    "hospital_name": row.hospital_name,
                    "location": row.location,
                    "contact_phone": row.contact_phone,
                    "is_urgent": row.is_urgent,
                    "status": _enum_value(row.status),
                    "notes": (row.notes or "")[:160],
                }
                for row in rows
            ],
        }

    def find_blood_donors(blood_group: str, limit: int = 10) -> dict[str, Any]:
        """Find available blood donors for a blood group like A+, O-, B+."""
        try:
            group = BloodGroup(blood_group)
        except ValueError:
            return {"error": f"Unknown blood_group '{blood_group}'", "items": []}
        rows = (
            db.query(User)
            .filter(
                User.role == UserRole.DONOR,
                User.blood_group == group,
                User.available_for_donation.is_(True),
                User.is_active.is_(True),
            )
            .limit(_clamp_limit(limit))
            .all()
        )
        return {
            "blood_group": blood_group,
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "full_name": row.full_name,
                    "phone": row.phone,
                    "blood_group": _enum_value(row.blood_group),
                    "address": row.address,
                }
                for row in rows
            ],
        }

    def list_shelters(
        only_with_beds: bool = True,
        location_query: str | None = None,
        limit: int = 10,
    ) -> dict[str, Any]:
        """List shelters and free beds. Set only_with_beds false to include full shelters."""
        q = db.query(Shelter).filter(Shelter.is_active.is_(True))
        if only_with_beds:
            q = q.filter(Shelter.available_beds > 0)
        loc = _like(Shelter.address, location_query)
        name = _like(Shelter.name, location_query)
        if location_query and location_query.strip():
            q = q.filter(or_(loc, name))
        rows = q.order_by(Shelter.available_beds.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "name": row.name,
                    "address": row.address,
                    "capacity": row.capacity,
                    "available_beds": row.available_beds,
                    "contact_phone": row.contact_phone,
                }
                for row in rows
            ],
        }

    def search_incidents(
        status: str | None = "open",
        severity: str | None = None,
        location_query: str | None = None,
        limit: int = 10,
    ) -> dict[str, Any]:
        """Search disaster/incident reports. severity examples: low, medium, high, critical."""
        q = db.query(IncidentReport)
        if status:
            try:
                q = q.filter(IncidentReport.status == EmergencyStatus(status.lower()))
            except ValueError:
                return {"error": f"Unknown status '{status}'", "items": []}
        if severity:
            q = q.filter(IncidentReport.severity.ilike(severity.strip()))
        loc = _like(IncidentReport.location, location_query)
        if loc is not None:
            q = q.filter(loc)
        rows = q.order_by(IncidentReport.created_at.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "title": row.title,
                    "description": (row.description or "")[:240],
                    "disaster_type": row.disaster_type,
                    "severity": row.severity,
                    "location": row.location,
                    "status": _enum_value(row.status),
                }
                for row in rows
            ],
        }

    def list_resources(
        resource_type: str | None = None,
        location_query: str | None = None,
        limit: int = 10,
    ) -> dict[str, Any]:
        """List relief resources (food, medicine, clothing, equipment, money, other)."""
        q = db.query(Resource)
        if resource_type:
            try:
                q = q.filter(Resource.resource_type == ResourceType(resource_type.lower()))
            except ValueError:
                return {"error": f"Unknown resource_type '{resource_type}'", "items": []}
        loc = _like(Resource.location, location_query)
        name = _like(Resource.name, location_query)
        if location_query and location_query.strip():
            q = q.filter(or_(loc, name))
        rows = q.order_by(Resource.created_at.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "name": row.name,
                    "type": _enum_value(row.resource_type),
                    "quantity": row.quantity,
                    "unit": row.unit,
                    "location": row.location,
                    "notes": (row.notes or "")[:160],
                }
                for row in rows
            ],
        }

    def list_campaigns(status: str | None = "active", limit: int = 10) -> dict[str, Any]:
        """List fundraising campaigns and how much they have raised."""
        q = db.query(FundraisingCampaign)
        if status:
            try:
                q = q.filter(FundraisingCampaign.status == CampaignStatus(status.lower()))
            except ValueError:
                return {"error": f"Unknown status '{status}'", "items": []}
        rows = q.order_by(FundraisingCampaign.created_at.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "title": row.title,
                    "cause": row.cause,
                    "goal_amount": row.goal_amount,
                    "raised_amount": row.raised_amount,
                    "status": _enum_value(row.status),
                    "description": (row.description or "")[:200],
                }
                for row in rows
            ],
        }

    def list_recent_donations(limit: int = 10) -> dict[str, Any]:
        """List recent donations (type/amount/items). Does not expose donor private accounts."""
        rows = db.query(Donation).order_by(Donation.created_at.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "donation_type": _enum_value(row.donation_type),
                    "amount": row.amount,
                    "item_description": row.item_description,
                    "allocated_to": row.allocated_to,
                    "campaign_id": row.campaign_id,
                    "created_at": row.created_at.isoformat() if row.created_at else None,
                }
                for row in rows
            ],
        }

    def list_volunteer_opportunities(
        status: str | None = "open",
        location_query: str | None = None,
        limit: int = 10,
    ) -> dict[str, Any]:
        """List volunteer opportunities and open slots."""
        q = db.query(VolunteerOpportunity)
        if status:
            try:
                q = q.filter(VolunteerOpportunity.status == OpportunityStatus(status.lower()))
            except ValueError:
                return {"error": f"Unknown status '{status}'", "items": []}
        loc = _like(VolunteerOpportunity.location, location_query)
        if loc is not None:
            q = q.filter(loc)
        rows = q.order_by(VolunteerOpportunity.created_at.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "title": row.title,
                    "description": (row.description or "")[:200],
                    "location": row.location,
                    "slots": row.slots,
                    "filled_slots": row.filled_slots,
                    "open_slots": max(row.slots - row.filled_slots, 0),
                    "start_date": row.start_date,
                    "end_date": row.end_date,
                    "status": _enum_value(row.status),
                }
                for row in rows
            ],
        }

    def list_coverage_areas(
        status: str | None = None,
        limit: int = 10,
    ) -> dict[str, Any]:
        """List disaster coverage areas. status: served, partial, underserved, critical."""
        q = db.query(DisasterCoverage)
        if status:
            try:
                q = q.filter(DisasterCoverage.coverage_status == CoverageStatus(status.lower()))
            except ValueError:
                return {"error": f"Unknown status '{status}'", "items": []}
        rows = q.order_by(DisasterCoverage.updated_at.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "area_name": row.area_name,
                    "coverage_status": _enum_value(row.coverage_status),
                    "notes": (row.notes or "")[:200],
                    "latitude": row.latitude,
                    "longitude": row.longitude,
                }
                for row in rows
            ],
        }

    def list_coordination_requests(
        status: str | None = "open",
        limit: int = 10,
    ) -> dict[str, Any]:
        """List NGO/volunteer coordination requests."""
        q = db.query(NGOCoordination)
        if status:
            try:
                q = q.filter(NGOCoordination.status == CoordinationStatus(status.lower()))
            except ValueError:
                return {"error": f"Unknown status '{status}'", "items": []}
        rows = q.order_by(NGOCoordination.created_at.desc()).limit(_clamp_limit(limit)).all()
        return {
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "title": row.title,
                    "message": (row.message or "")[:200],
                    "volunteers_needed": row.volunteers_needed,
                    "location": row.location,
                    "status": _enum_value(row.status),
                }
                for row in rows
            ],
        }

    def get_my_alerts(limit: int = 10) -> dict[str, Any]:
        """Get the signed-in user's alert inbox notifications."""
        if not user:
            return {"error": "User is not signed in", "items": []}
        rows = (
            db.query(Notification)
            .filter(Notification.user_id == user.id)
            .order_by(Notification.created_at.desc())
            .limit(_clamp_limit(limit))
            .all()
        )
        unread = (
            db.query(Notification)
            .filter(Notification.user_id == user.id, Notification.is_read.is_(False))
            .count()
        )
        return {
            "unread_count": unread,
            "count": len(rows),
            "items": [
                {
                    "id": row.id,
                    "title": row.title,
                    "message": row.message,
                    "link": row.link,
                    "is_read": row.is_read,
                    "created_at": row.created_at.isoformat() if row.created_at else None,
                }
                for row in rows
            ],
        }

    def search_across_vera(query: str, limit: int = 8) -> dict[str, Any]:
        """Broad keyword search across emergencies, blood, shelters, incidents, resources, campaigns, opportunities."""
        term = (query or "").strip()
        if not term:
            return {"error": "query is required", "results": {}}
        per = _clamp_limit(limit, default=5, maximum=10)
        pattern = f"%{term}%"

        emergencies = (
            db.query(EmergencyRequest)
            .filter(
                or_(
                    EmergencyRequest.title.ilike(pattern),
                    EmergencyRequest.description.ilike(pattern),
                    EmergencyRequest.location.ilike(pattern),
                )
            )
            .order_by(EmergencyRequest.created_at.desc())
            .limit(per)
            .all()
        )
        blood = (
            db.query(BloodRequest)
            .filter(
                or_(
                    BloodRequest.patient_name.ilike(pattern),
                    BloodRequest.hospital_name.ilike(pattern),
                    BloodRequest.location.ilike(pattern),
                    BloodRequest.notes.ilike(pattern),
                )
            )
            .order_by(BloodRequest.created_at.desc())
            .limit(per)
            .all()
        )
        shelters = (
            db.query(Shelter)
            .filter(
                Shelter.is_active.is_(True),
                or_(Shelter.name.ilike(pattern), Shelter.address.ilike(pattern)),
            )
            .limit(per)
            .all()
        )
        incidents = (
            db.query(IncidentReport)
            .filter(
                or_(
                    IncidentReport.title.ilike(pattern),
                    IncidentReport.description.ilike(pattern),
                    IncidentReport.location.ilike(pattern),
                    IncidentReport.disaster_type.ilike(pattern),
                )
            )
            .order_by(IncidentReport.created_at.desc())
            .limit(per)
            .all()
        )
        resources = (
            db.query(Resource)
            .filter(or_(Resource.name.ilike(pattern), Resource.location.ilike(pattern)))
            .order_by(Resource.created_at.desc())
            .limit(per)
            .all()
        )
        campaigns = (
            db.query(FundraisingCampaign)
            .filter(
                or_(
                    FundraisingCampaign.title.ilike(pattern),
                    FundraisingCampaign.cause.ilike(pattern),
                    FundraisingCampaign.description.ilike(pattern),
                )
            )
            .order_by(FundraisingCampaign.created_at.desc())
            .limit(per)
            .all()
        )
        opportunities = (
            db.query(VolunteerOpportunity)
            .filter(
                or_(
                    VolunteerOpportunity.title.ilike(pattern),
                    VolunteerOpportunity.description.ilike(pattern),
                    VolunteerOpportunity.location.ilike(pattern),
                )
            )
            .order_by(VolunteerOpportunity.created_at.desc())
            .limit(per)
            .all()
        )
        coverage = (
            db.query(DisasterCoverage)
            .filter(
                or_(
                    DisasterCoverage.area_name.ilike(pattern),
                    DisasterCoverage.notes.ilike(pattern),
                )
            )
            .limit(per)
            .all()
        )

        return {
            "query": term,
            "results": {
                "emergencies": [
                    {"id": r.id, "title": r.title, "status": _enum_value(r.status), "location": r.location}
                    for r in emergencies
                ],
                "blood_requests": [
                    {
                        "id": r.id,
                        "patient_name": r.patient_name,
                        "blood_group": _enum_value(r.blood_group),
                        "location": r.location,
                        "status": _enum_value(r.status),
                    }
                    for r in blood
                ],
                "shelters": [
                    {
                        "id": r.id,
                        "name": r.name,
                        "address": r.address,
                        "available_beds": r.available_beds,
                    }
                    for r in shelters
                ],
                "incidents": [
                    {
                        "id": r.id,
                        "title": r.title,
                        "severity": r.severity,
                        "location": r.location,
                        "status": _enum_value(r.status),
                    }
                    for r in incidents
                ],
                "resources": [
                    {
                        "id": r.id,
                        "name": r.name,
                        "type": _enum_value(r.resource_type),
                        "quantity": r.quantity,
                        "location": r.location,
                    }
                    for r in resources
                ],
                "campaigns": [
                    {
                        "id": r.id,
                        "title": r.title,
                        "raised_amount": r.raised_amount,
                        "goal_amount": r.goal_amount,
                        "status": _enum_value(r.status),
                    }
                    for r in campaigns
                ],
                "volunteer_opportunities": [
                    {
                        "id": r.id,
                        "title": r.title,
                        "location": r.location,
                        "open_slots": max(r.slots - r.filled_slots, 0),
                        "status": _enum_value(r.status),
                    }
                    for r in opportunities
                ],
                "coverage_areas": [
                    {
                        "id": r.id,
                        "area_name": r.area_name,
                        "coverage_status": _enum_value(r.coverage_status),
                    }
                    for r in coverage
                ],
            },
        }

    # Fix the walrus mistake in search_across_vera - I accidentally wrote bad code
    # I'll rewrite that list comprehension cleanly in the file rewrite below if needed.

    tools = [
        get_platform_summary,
        search_emergencies,
        search_blood_requests,
        find_blood_donors,
        list_shelters,
        search_incidents,
        list_resources,
        list_campaigns,
        list_recent_donations,
        list_volunteer_opportunities,
        list_coverage_areas,
        list_coordination_requests,
        get_my_alerts,
        search_across_vera,
    ]
    return tools
