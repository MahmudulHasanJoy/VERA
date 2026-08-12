"""Upsert a VERA admin user. Usage: python scripts/upsert_admin.py

Reads DATABASE_URL from backend/.env (or environment).
Email/password come from ADMIN_EMAIL / ADMIN_PASSWORD env vars.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
load_dotenv(ROOT / ".env")

from app.core.database import SessionLocal  # noqa: E402
from app.core.security import get_password_hash  # noqa: E402
from app.models import User, UserRole, VerificationStatus  # noqa: E402


def main() -> None:
    email = (os.environ.get("ADMIN_EMAIL") or "").strip().lower()
    password = os.environ.get("ADMIN_PASSWORD") or ""
    full_name = os.environ.get("ADMIN_FULL_NAME") or "VERA Admin"

    if not email or not password:
        print("Set ADMIN_EMAIL and ADMIN_PASSWORD", file=sys.stderr)
        sys.exit(1)
    if len(password) < 8:
        print("ADMIN_PASSWORD must be at least 8 characters", file=sys.stderr)
        sys.exit(1)

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            # Also try original casing match
            user = db.query(User).filter(User.email == os.environ["ADMIN_EMAIL"].strip()).first()

        if user is None:
            user = User(
                email=email,
                full_name=full_name,
                role=UserRole.ADMIN,
                hashed_password=get_password_hash(password),
                is_verified=True,
                verification_status=VerificationStatus.APPROVED,
            )
            db.add(user)
            action = "created"
        else:
            user.email = email
            user.role = UserRole.ADMIN
            user.hashed_password = get_password_hash(password)
            user.is_verified = True
            user.verification_status = VerificationStatus.APPROVED
            db.add(user)
            action = "updated"

        db.commit()
        db.refresh(user)
        print(f"ok action={action} id={user.id} role={user.role.value} email_set=yes")
    finally:
        db.close()


if __name__ == "__main__":
    main()
