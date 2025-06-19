
# Pin specific version for stability
# Use separate stage for building image
# Use debian for easier build utilities
FROM golang:1.24.4-bullseye AS build-base

WORKDIR /app 

# Copy only files required to install dependencies (better layer caching)
COPY go.mod go.sum ./

# Use cache mount to speed up install of existing dependencies
RUN --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  go mod download

FROM build-base AS dev

# Install air for hot reload & delve for debugging
RUN go install github.com/cosmtrek/air@latest && \
  go install github.com/go-delve/delve/cmd/dlv@latest

COPY . .

CMD ["air", "-c", ".air.toml"]

FROM build-base AS build-production

# Add non root user
RUN useradd -u 1001 nonroot

COPY . .

# Compile healthcheck 
# Creating a single binary file named healthcheck inside the /app directory
RUN go build \
  -ldflags="-linkmode external -extldflags -static" \
  -tags netgo \
  -o healthcheck \
  ./healthcheck/healthcheck.go

# Compile application during build rather than at runtime
# Add flags to statically link binary
RUN go build \
  -ldflags="-linkmode external -extldflags -static" \
  -tags netgo \
  -o go-backend

# Use separate stage for deployable image
FROM scratch

# Set gin mode
ENV GIN_MODE=release

WORKDIR /

# Copy the passwd file
COPY --from=build-production /etc/passwd /etc/passwd

# Copy the healthcheck binary from the build stage into healthcheck folder
# Start with "/", which is treated as an absolute path inside the container.
COPY --from=build-production /app/healthcheck/healthcheck healthcheck

# Copy the app binary from the build stage
# Not Start with "/", which is treated as a relative path inside the current WORKDIR
COPY --from=build-production /app/go-backend go-backend

# Use nonroot user
USER nonroot

# Indicate expected port
EXPOSE 8000

# "go-backend" in this CMD is a executable binary file.
# The host is set to be '0.0.0.0' in "main.go" file, and "main.go" file 
# is part of "go-backend" binary, so the app running in container also
# listens on all interfaces (both external and localhost of physical machine or VM or container). 
# When the container starts, Docker executes this CMD to start go server.
CMD ["/go-backend"]