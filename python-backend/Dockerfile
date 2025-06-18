# syntax=docker/dockerfile:1.5

# ---- Base image for building ----
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Specify working directory other than /
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
    PYTHONUNBUFFERED=1 \
    FLASK_APP=run.py \
    FLASK_ENV=production

# Use non-root user for better security
RUN useradd -u 1001 python_user

WORKDIR /app

# Copy all dependencies and runtime binaries from base stage
COPY --from=base /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=base /usr/local/bin /usr/local/bin
COPY --from=base /usr/lib /usr/lib

# Set correct ownership during build (as root)
COPY --chown=python_user:python_user . .

# Then drop privileges from root user to non-root user for better security
USER python_user

EXPOSE 8088

# When the container starts, Docker executes this CMD to start python server.
CMD ["flask", "run", "--host=0.0.0.0", "--port=8088"]
    