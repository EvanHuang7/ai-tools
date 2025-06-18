# syntax=docker/dockerfile:1.5

FROM node:20.14-bullseye-slim AS build

# Specify working directory other than / in container
WORKDIR /usr/src/app

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
# This base image inlcude `CMD ["nginx", "-g", "daemon off;"]` by default
# So, when the container starts, it use this CMD to runs Nginx in the foreground.
# The build files of React app served by Nginx, so the app runs when Nginx starts.
FROM nginxinc/nginx-unprivileged:1.23-alpine-perl

# Use COPY --link to avoid breaking cache if we change the second stage base image
# It is used for input requests routing if there is no Ingress layer
COPY --link nginx.conf /etc/nginx/conf.d/default.conf

COPY --link --from=build usr/src/app/dist/ /usr/share/nginx/html

# EXPOSE port here is just a documation of image, not real expose action
EXPOSE 8080