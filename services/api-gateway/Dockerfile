
# Base image
FROM node:24-alpine AS base

WORKDIR /app

# Install the pnpm version used by TaskFlow
RUN npm install --global pnpm@11.28.11

# Build stage
FROM base AS build

# Copy monorepo source
COPY . .

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Build only API Gateway
RUN pnpm --filter @taskflow/api-gateway build

# Runtime stage
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy dependencies and compiled application
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/api-gateway/node_modules ./services/api-gateway/node_modules
COPY --from=build /app/services/api-gateway/package.json ./services/api-gateway/package.json
COPY --from=build /app/services/api-gateway/dist ./services/api-gateway/dist

WORKDIR /app/services/api-gateway

CMD ["node", "dist/server.js"]
