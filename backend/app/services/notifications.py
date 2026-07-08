import json
import logging
import smtplib
from email.message import EmailMessage
from urllib import error, request

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import Notification, User

logger = logging.getLogger("vera.notifications")


def _send_email(to_address: str, subject: str, body: str) -> None:
    if not settings.email_enabled or not to_address:
        return
    try:
        message = EmailMessage()
        message["From"] = settings.smtp_from
        message["To"] = to_address
        message["Subject"] = subject
        message.set_content(body)

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=5) as smtp:
            smtp.starttls()
            if settings.smtp_user:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(message)
    except Exception:
        logger.exception("Email notification failed for %s", to_address)


def _send_sms(phone: str | None, body: str) -> None:
    if not settings.sms_enabled or not settings.sms_provider_url or not phone:
        return
    try:
        payload = json.dumps(
            {"to": phone, "message": body, "api_key": settings.sms_api_key}
        ).encode()
        req = request.Request(
            settings.sms_provider_url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with request.urlopen(req, timeout=5) as response:
            response.read()
    except error.URLError:
        logger.exception("SMS notification failed for %s", phone)


def create_notification(
    db: Session,
    *,
    user_id: int,
    title: str,
    message: str,
    link: str | None = None,
    channels: bool = True,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        link=link,
    )
    db.add(notification)

    if channels:
        user = db.get(User, user_id)
        if user:
            body = f"{title}\n\n{message}"
            if link:
                body = f"{body}\nOpen: {link}"
            _send_email(user.email, f"[VERA] {title}", body)
            _send_sms(user.phone, f"VERA: {title} — {message}")

    return notification
