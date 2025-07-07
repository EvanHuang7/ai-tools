# syntax=docker/dockerfile:1.5

FROM node:20.14-bullseye-slim AS build

# Specify working directory other than / in container
WORKDIR /usr/src/app

# Accept VITE env var at build time
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_VAPI_PUBLIC_KEY
# ENV in the Dockerfile expects ARG passed in 
# from the outside (e.g. the cli arg of build image cli).
# It doesn’t read from ".env" file by itself.
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_VAPI_PUBLIC_KEY=$VITE_VAPI_PUBLIC_KEY

# Copy only files required for dependencies install
# (better layer caching)
COPY package*.json ./

# Use cache mount to speed up install of existing dependencies
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install

COPY . .

RUN npm run build

# Use separate stage for deployable image
# This base image includes `CMD ["nginx", "-g", "daemon off;"]` by default
# So, when the container starts, it uses this CMD to run Nginx in the foreground.
# The build files of the React app are served by Nginx, so the app runs when Nginx starts.
FROM nginxinc/nginx-unprivileged:1.23-alpine-perl

# Use COPY --link to avoid breaking cache if we change the second stage base image
# It is used for input requests routing if there is no Ingress layer
COPY --link nginx.conf /etc/nginx/conf.d/default.conf

COPY --link --from=build usr/src/app/dist/ /usr/share/nginx/html

# EXPOSE port here is just a documentation of image, not real expose action
EXPOSE 8080