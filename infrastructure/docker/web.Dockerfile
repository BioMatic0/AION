FROM node:24-alpine AS base
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @aion/web build
CMD ["pnpm", "--filter", "@aion/web", "start"]