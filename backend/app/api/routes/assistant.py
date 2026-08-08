import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models import User
from app.services import assistant as assistant_service

router = APIRouter(prefix="/assistant", tags=["assistant"])

optional_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=4000)


class AssistantChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatMessage] = Field(default_factory=list, max_length=24)
    page_path: str | None = Field(default=None, max_length=200)


class AssistantChatResponse(BaseModel):
    reply: str


def get_optional_user(
    token: str | None = Depends(optional_oauth2),
    db: Session = Depends(get_db),
) -> User | None:
    if not token:
        return None
    user_id = decode_access_token(token)
    if not user_id:
        return None
    user = db.get(User, int(user_id))
    if not user or not user.is_active:
        return None
    return user


@router.post("/chat", response_model=AssistantChatResponse)
def assistant_chat(
    payload: AssistantChatRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
) -> AssistantChatResponse:
    try:
        reply = assistant_service.chat(
            db,
            message=payload.message.strip(),
            history=[m.model_dump() for m in payload.history],
            page_path=payload.page_path,
            user=current_user,
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except Exception as exc:  # noqa: BLE001
        detail = str(exc)
        if "RESOURCE_EXHAUSTED" in detail or "429" in detail:
            detail = (
                "Gemini quota is temporarily used up. Please wait a minute and try again, "
                "or enable billing / use another API key."
            )
        else:
            detail = f"VERA Bot could not reach Gemini: {exc}"
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=detail,
        ) from exc

    return AssistantChatResponse(reply=reply)


@router.post("/chat/stream")
def assistant_chat_stream(
    payload: AssistantChatRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
) -> StreamingResponse:
    def event_stream():
        try:
            for delta in assistant_service.chat_stream(
                db,
                message=payload.message.strip(),
                history=[m.model_dump() for m in payload.history],
                page_path=payload.page_path,
                user=current_user,
            ):
                yield f"data: {json.dumps({'delta': delta}, ensure_ascii=False)}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as exc:  # noqa: BLE001
            message = str(exc)
            if "RESOURCE_EXHAUSTED" in message or "429" in message:
                message = (
                    "Gemini quota is temporarily used up. Please wait a minute and try again."
                )
            yield f"data: {json.dumps({'error': message}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
