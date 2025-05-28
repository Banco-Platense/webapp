# Production Dockerfile
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Build the app
FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
COPY .env* ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runtime
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/.env* ./

EXPOSE 3000
ENV PORT=${PORT}
ENV HOSTNAME=${HOSTNAME}

CMD ["node", "server.js"]