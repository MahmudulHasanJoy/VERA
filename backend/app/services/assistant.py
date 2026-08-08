from __future__ import annotations

import json
from collections.abc import Iterator

from google import genai
from google.genai import types
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import Notification, User
from app.services.assistant_tools import build_assistant_tools

SYSTEM_INSTRUCTION = """You are VERA Bot for VERA (Volunteer Emergency Response Alliance) in Bangladesh.

A live platform snapshot is already in the message context — use it for counts/overview.
Only call tools when you need specific lists or details not in that snapshot
(e.g. shelter names, blood requests for a group, alerts). Prefer at most one tool call.

Write for everyday users: simple words, short answers (2–5 sentences or a few bullets),
clear next steps. Prefer page names (Blood, Shelters, Emergencies, Alerts).
Life-threatening: call 999 first, then use VERA. Never invent numbers, phones, or private data.
Only share contacts returned by tools.
"""

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.gemini_api_key:
            raise RuntimeError(
                "Gemini is not configured. Set GEMINI_API_KEY in the backend environment."
            )
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


def _session_context(user: User | None, page_path: str | None, db: Session) -> str:
    tools = build_assistant_tools(db, user)
    summary = tools[0]()  # get_platform_summary — avoid an extra Gemini tool round-trip

    lines: list[str] = [
        "Live platform snapshot (already fetched — do not re-query for these counts):",
        json.dumps(summary, separators=(",", ":")),
    ]
    if page_path:
        lines.append(f"Current page: {page_path}")
    if user:
        unread = (
            db.query(Notification)
            .filter(Notification.user_id == user.id, Notification.is_read.is_(False))
            .count()
        )
        lines.append(
            f"Signed-in: {user.full_name}; role={user.role.value}; "
            f"verified={user.is_verified}; "
            f"blood_group={user.blood_group.value if user.blood_group else None}; "
            f"unread_alerts={unread}"
        )
    else:
        lines.append("Guest user (not signed in).")
    return "\n".join(lines)


def _build_contents(
    *,
    message: str,
    history: list[dict[str, str]],
    context: str,
) -> list[types.Content]:
    contents: list[types.Content] = []
    for turn in history[-6:]:
        role = turn.get("role")
        text = (turn.get("content") or "").strip()
        if not text or role not in {"user", "assistant"}:
            continue
        contents.append(
            types.Content(
                role="user" if role == "user" else "model",
                parts=[types.Part.from_text(text=text)],
            )
        )
    contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=f"[Context]\n{context}\n\n[User]\n{message}")],
        )
    )
    return contents


def _gen_config(db: Session, user: User | None) -> types.GenerateContentConfig:
    return types.GenerateContentConfig(
        system_instruction=SYSTEM_INSTRUCTION,
        temperature=0.2,
        max_output_tokens=400,
        tools=build_assistant_tools(db, user),
        automatic_function_calling=types.AutomaticFunctionCallingConfig(maximum_remote_calls=2),
    )


def chat(
    db: Session,
    *,
    message: str,
    history: list[dict[str, str]],
    page_path: str | None = None,
    user: User | None = None,
) -> str:
    client = _get_client()
    contents = _build_contents(
        message=message,
        history=history,
        context=_session_context(user, page_path, db),
    )
    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=contents,
        config=_gen_config(db, user),
    )
    text = (response.text or "").strip()
    if not text:
        raise RuntimeError("VERA Bot received an empty response from Gemini.")
    return text


def chat_stream(
    db: Session,
    *,
    message: str,
    history: list[dict[str, str]],
    page_path: str | None = None,
    user: User | None = None,
) -> Iterator[str]:
    """Yield reply text chunks as Gemini generates them (after any tool calls)."""
    client = _get_client()
    contents = _build_contents(
        message=message,
        history=history,
        context=_session_context(user, page_path, db),
    )
    stream = client.models.generate_content_stream(
        model=settings.gemini_model,
        contents=contents,
        config=_gen_config(db, user),
    )
    produced = False
    for chunk in stream:
        text = getattr(chunk, "text", None) or ""
        if text:
            produced = True
            yield text
    if not produced:
        raise RuntimeError("VERA Bot received an empty response from Gemini.")
