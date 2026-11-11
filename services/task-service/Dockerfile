FROM node:24-alpine AS base

WORKDIR /app

RUN npm install --global pnpm@11.28.11

# Build stage
FROM base AS build

COPY . .

RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=task_service" \
    pnpm --filter @taskflow/task-service exec prisma generate

# Build TypeScript
RUN pnpm --filter @taskflow/task-service build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/task-service/node_modules ./services/task-service/node_modules
COPY --from=build /app/services/task-service/package.json ./services/task-service/package.json
COPY --from=build /app/services/task-service/dist ./services/task-service/dist

WORKDIR /app/services/task-service

EXPOSE 4002

CMD ["node", "dist/server.js"]
