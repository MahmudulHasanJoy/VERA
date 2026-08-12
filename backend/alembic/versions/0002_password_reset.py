"""Add password reset fields to users.

Revision ID: 0002_password_reset
Revises: 0001_initial
Create Date: 2026-08-12
"""

from alembic import op
import sqlalchemy as sa


revision = "0002_password_reset"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("password_reset_token_hash", sa.String(length=128), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("password_reset_expires", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "password_reset_expires")
    op.drop_column("users", "password_reset_token_hash")
