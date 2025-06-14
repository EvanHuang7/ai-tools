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
FROM nginxinc/nginx-unprivileged:1.23-alpine-perl

# Use COPY --link to avoid breaking cache if we change the second stage base image
# TODO: the api/go, api/node, api/python sections in "nginx.conf" may
# not need bc these api the routing to backend apis is in Ingress layer
COPY --link nginx.conf /etc/nginx/conf.d/default.conf

COPY --link --from=build usr/src/app/dist/ /usr/share/nginx/html

EXPOSE 8080