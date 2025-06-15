# syntax=docker/dockerfile:1.5

# ---- Base image for building ----
    FROM python:3.12-slim AS base

    ENV PYTHONDONTWRITEBYTECODE=1 \
        PYTHONUNBUFFERED=1
    
    WORKDIR /app
    
    RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        && rm -rf /var/lib/apt/lists/*
    
    COPY requirements.txt ./
    
    RUN --mount=type=cache,target=/root/.cache/pip \
        pip install --no-cache-dir -r requirements.txt
    
    # ---- Final runtime image ----
    FROM python:3.12-slim AS runtime
    
    ENV PYTHONDONTWRITEBYTECODE=1 \
        PYTHONUNBUFFERED=1 \
        FLASK_APP=run.py \
        FLASK_ENV=production
    
    RUN useradd -u 1001 python_user
    
    WORKDIR /app
    
    COPY --from=base /usr/local/lib/python3.12 /usr/local/lib/python3.12
    COPY --from=base /usr/local/bin /usr/local/bin
    COPY --from=base /usr/lib /usr/lib
    
    COPY --chown=python_user:python_user . .
    
    USER python_user
    
    EXPOSE 8088
    
    CMD ["flask", "run", "--host=0.0.0.0", "--port=8088"]
    