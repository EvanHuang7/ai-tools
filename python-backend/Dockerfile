# syntax=docker/dockerfile:1.5

# ---- Base image for building ----
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install build dependencies and clean cache
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY requirements.txt ./

# Use cache for pip packages
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir -r requirements.txt

# ---- Final runtime image ----
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Use non-root user
RUN useradd -u 1001 django_user

WORKDIR /app

COPY --from=base /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=base /usr/local/bin /usr/local/bin
COPY --from=base /usr/lib /usr/lib

COPY --chown=django_user:django_user . .

# Copy the healthcheck script
COPY --chown=django_user:django_user healthcheck.py ./healthcheck.py

USER django_user

EXPOSE 8088

CMD ["python", "manage.py", "runserver", "0.0.0.0:8088"]
    