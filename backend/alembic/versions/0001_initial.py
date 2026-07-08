"""Initial VERA schema (14 tables).

Revision ID: 0001_initial
Revises:
Create Date: 2026-07-08

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001_initial"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("role", sa.Enum("citizen", "volunteer", "donor", "ngo", "hospital", "admin", name="userrole"), nullable=False),
        sa.Column("organization_name", sa.String(255), nullable=True),
        sa.Column("address", sa.String(500), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("blood_group", sa.Enum("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", name="bloodgroup"), nullable=True),
        sa.Column("available_for_donation", sa.Boolean(), server_default=sa.text("0"), nullable=False),
        sa.Column("id_document_type", sa.Enum("nid", "passport", "other", name="documenttype"), nullable=True),
        sa.Column("id_document_number", sa.String(64), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("1"), nullable=False),
        sa.Column("is_verified", sa.Boolean(), server_default=sa.text("0"), nullable=False),
        sa.Column("verification_status", sa.Enum("pending", "approved", "rejected", name="verificationstatus"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_id", "users", ["id"])

    op.create_table(
        "emergency_requests",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("requester_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column(
            "emergency_type",
            sa.Enum(
                "medical",
                "blood",
                "ambulance",
                "food",
                "shelter",
                "rescue",
                "transport",
                "missing_person",
                "other",
                name="emergencytype",
            ),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.Enum("open", "in_progress", "verified", "resolved", "cancelled", name="emergencystatus"),
            nullable=False,
        ),
        sa.Column("location", sa.String(500), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("contact_phone", sa.String(32), nullable=True),
        sa.Column("assigned_volunteer_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("is_verified", sa.Boolean(), server_default=sa.text("0"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_emergency_requests_id", "emergency_requests", ["id"])

    op.create_table(
        "blood_requests",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("requester_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("patient_name", sa.String(255), nullable=False),
        sa.Column("blood_group", sa.Enum("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", name="bloodgroup"), nullable=False),
        sa.Column("units_needed", sa.Integer(), nullable=False),
        sa.Column("hospital_name", sa.String(255), nullable=True),
        sa.Column("location", sa.String(500), nullable=True),
        sa.Column("contact_phone", sa.String(32), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column(
            "status",
            sa.Enum("open", "in_progress", "verified", "resolved", "cancelled", name="emergencystatus"),
            nullable=False,
        ),
        sa.Column("is_urgent", sa.Boolean(), server_default=sa.text("1"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_blood_requests_id", "blood_requests", ["id"])

    op.create_table(
        "resources",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("organization_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column(
            "resource_type",
            sa.Enum("food", "medicine", "clothing", "equipment", "money", "other", name="resourcetype"),
            nullable=False,
        ),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit", sa.String(32), nullable=False),
        sa.Column("location", sa.String(500), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_resources_id", "resources", ["id"])

    op.create_table(
        "ngo_coordinations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("requester_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("volunteers_needed", sa.Integer(), nullable=False),
        sa.Column("location", sa.String(500), nullable=True),
        sa.Column(
            "status",
            sa.Enum("open", "accepted", "completed", "cancelled", name="coordinationstatus"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_ngo_coordinations_id", "ngo_coordinations", ["id"])

    op.create_table(
        "fundraising_campaigns",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("creator_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("cause", sa.String(255), nullable=False),
        sa.Column("goal_amount", sa.Float(), nullable=False),
        sa.Column("raised_amount", sa.Float(), nullable=False),
        sa.Column("status", sa.Enum("active", "paused", "completed", name="campaignstatus"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_fundraising_campaigns_id", "fundraising_campaigns", ["id"])

    op.create_table(
        "donations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("donor_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("campaign_id", sa.Integer(), sa.ForeignKey("fundraising_campaigns.id"), nullable=True),
        sa.Column(
            "donation_type",
            sa.Enum("money", "food", "medicine", "clothing", "equipment", "other", name="donationtype"),
            nullable=False,
        ),
        sa.Column("amount", sa.Float(), nullable=True),
        sa.Column("item_description", sa.Text(), nullable=True),
        sa.Column("allocated_to", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_donations_id", "donations", ["id"])

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("link", sa.String(255), nullable=True),
        sa.Column("is_read", sa.Boolean(), server_default=sa.text("0"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_notifications_id", "notifications", ["id"])

    op.create_table(
        "shelters",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("address", sa.String(500), nullable=False),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("available_beds", sa.Integer(), nullable=False),
        sa.Column("contact_phone", sa.String(32), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("managed_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("1"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_shelters_id", "shelters", ["id"])

    op.create_table(
        "incident_reports",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("reporter_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("disaster_type", sa.String(64), nullable=False),
        sa.Column("severity", sa.String(32), nullable=False),
        sa.Column("location", sa.String(500), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column(
            "status",
            sa.Enum("open", "in_progress", "verified", "resolved", "cancelled", name="emergencystatus"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_incident_reports_id", "incident_reports", ["id"])

    op.create_table(
        "volunteer_opportunities",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("organization_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("location", sa.String(500), nullable=False),
        sa.Column("slots", sa.Integer(), nullable=False),
        sa.Column("filled_slots", sa.Integer(), nullable=False),
        sa.Column("start_date", sa.String(32), nullable=True),
        sa.Column("end_date", sa.String(32), nullable=True),
        sa.Column("status", sa.Enum("open", "closed", "completed", name="opportunitystatus"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_volunteer_opportunities_id", "volunteer_opportunities", ["id"])

    op.create_table(
        "volunteer_applications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("opportunity_id", sa.Integer(), sa.ForeignKey("volunteer_opportunities.id"), nullable=False),
        sa.Column("volunteer_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.Enum("pending", "approved", "rejected", name="applicationstatus"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_volunteer_applications_id", "volunteer_applications", ["id"])

    op.create_table(
        "certificates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("volunteer_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("organization_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("program_name", sa.String(255), nullable=False),
        sa.Column("certificate_code", sa.String(64), nullable=False),
        sa.Column("issue_date", sa.DateTime(), nullable=False),
        sa.Column("is_verified", sa.Boolean(), server_default=sa.text("1"), nullable=False),
    )
    op.create_index("ix_certificates_id", "certificates", ["id"])
    op.create_index("ix_certificates_certificate_code", "certificates", ["certificate_code"], unique=True)

    op.create_table(
        "disaster_coverage",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("area_name", sa.String(255), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column(
            "coverage_status",
            sa.Enum("served", "partial", "underserved", "critical", name="coveragestatus"),
            nullable=False,
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("reported_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_disaster_coverage_id", "disaster_coverage", ["id"])


def downgrade() -> None:
    op.drop_table("disaster_coverage")
    op.drop_table("certificates")
    op.drop_table("volunteer_applications")
    op.drop_table("volunteer_opportunities")
    op.drop_table("incident_reports")
    op.drop_table("shelters")
    op.drop_table("notifications")
    op.drop_table("donations")
    op.drop_table("fundraising_campaigns")
    op.drop_table("ngo_coordinations")
    op.drop_table("resources")
    op.drop_table("blood_requests")
    op.drop_table("emergency_requests")
    op.drop_table("users")
