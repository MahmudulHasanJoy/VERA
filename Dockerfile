# Railway production image for VERA FastAPI (repo root build context).
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

RUN sed -i 's/\r$//' entrypoint.sh && chmod +x entrypoint.sh

EXPOSE 8000

# Shell form so ${PORT} expands. Do NOT set a Railway "Custom Start Command"
# with a bare `$PORT` — Railway will pass it as a literal string.
CMD ["sh", "-c", "alembic upgrade head || echo 'alembic failed — continuing'; exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
