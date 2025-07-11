# Pin specific version for stability
# Use slim for reduced image size
FROM node:20.14-bullseye-slim AS base

# Set NODE_ENV
ENV NODE_ENV production

# Specify working directory other than /
WORKDIR /usr/src/app

# Copy only files required to install
# dependencies (better layer caching)
COPY package*.json ./

# Install only production dependencies
# Use cache mount to speed up install of existing dependencies
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production

# Use non-root user for better security
USER node

# Use --chown on COPY commands to set file permissions
# Copy the healthcheck script
# Copy all files inside healthcheck folder to container working directory level
COPY --chown=node:node ./healthcheck/ .

# Copy remaining source code AFTER installing dependencies. 
# Again, copy only the necessary files
COPY --chown=node:node ./src/ .

# Indicate expected port
EXPOSE 3000

# When the container starts, Docker executes this CMD to start node server.
# The host is default to be '0.0.0.0' in "index.js" file, so 
# the app running in container also listens on all interfaces (both external and localhost of physical machine or VM or container). 
CMD [ "node", "index.js" ]