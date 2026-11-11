FROM node:24-alpine AS base

WORKDIR /app

RUN npm install --global pnpm@11.28.11

# Build stage
FROM base AS build

COPY . .

RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    pnpm --filter @taskflow/auth-service exec prisma generate

# Compile TypeScript
RUN pnpm --filter @taskflow/auth-service build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/auth-service/node_modules ./services/auth-service/node_modules
COPY --from=build /app/services/auth-service/package.json ./services/auth-service/package.json
COPY --from=build /app/services/auth-service/dist ./services/auth-service/dist

WORKDIR /app/services/auth-service

EXPOSE 4001

CMD ["node", "dist/src/server.js"]
