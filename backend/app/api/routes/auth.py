import hashlib
import secrets
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models import User, UserRole
from app.schemas import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    Token,
    UserCreate,
    UserRead,
)
from app.services.notifications import send_email

router = APIRouter(prefix="/auth", tags=["auth"])


def _hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    if payload.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=400,
            detail="Admin accounts cannot be self-registered. Contact the VERA team.",
        )

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        phone=payload.phone,
        role=payload.role,
        organization_name=payload.organization_name,
        address=payload.address,
        latitude=payload.latitude,
        longitude=payload.longitude,
        blood_group=payload.blood_group,
        available_for_donation=payload.role == UserRole.DONOR and payload.blood_group is not None,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(str(user.id))
    return Token(access_token=token)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
) -> ForgotPasswordResponse:
    """Always return a generic message so emails cannot be enumerated."""
    generic = (
        "If that email is registered, a password reset link is ready. "
        "Check your inbox, or use the on-screen link when email is not configured."
    )
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user:
        # Case-insensitive fallback for mixed-case stored emails
        user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        return ForgotPasswordResponse(message=generic)

    raw_token = secrets.token_urlsafe(32)
    user.password_reset_token_hash = _hash_reset_token(raw_token)
    user.password_reset_expires = datetime.now(UTC).replace(tzinfo=None) + timedelta(
        minutes=settings.password_reset_expire_minutes
    )
    db.add(user)
    db.commit()

    reset_url = f"{settings.frontend_url.rstrip('/')}/reset-password?token={raw_token}"
    emailed = send_email(
        user.email,
        "[VERA] Reset your password",
        (
            f"Hi {user.full_name},\n\n"
            "We received a request to reset your VERA password.\n"
            f"Open this link within {settings.password_reset_expire_minutes} minutes:\n\n"
            f"{reset_url}\n\n"
            "If you did not request this, you can ignore this email.\n"
        ),
    )

    # Without SMTP, return the token so the demo UI can complete the flow.
    if emailed:
        return ForgotPasswordResponse(message=generic)
    return ForgotPasswordResponse(
        message=generic + " Email delivery is not configured on this server, so use the link below.",
        reset_token=raw_token,
        reset_url=reset_url,
    )


@router.post("/reset-password", response_model=dict)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    token_hash = _hash_reset_token(payload.token.strip())
    user = (
        db.query(User)
        .filter(User.password_reset_token_hash == token_hash)
        .first()
    )
    if not user or not user.password_reset_expires:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")

    expires = user.password_reset_expires
    if expires.tzinfo is not None:
        expires = expires.replace(tzinfo=None)
    if expires < datetime.now(UTC).replace(tzinfo=None):
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")

    user.hashed_password = get_password_hash(payload.new_password)
    user.password_reset_token_hash = None
    user.password_reset_expires = None
    db.add(user)
    db.commit()
    return {"message": "Password updated. You can sign in with your new password."}


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)) -> User:
    return current_user
