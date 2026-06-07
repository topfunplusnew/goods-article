FROM node:22-bookworm AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-bookworm AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV BACKEND_ORIGIN=http://127.0.0.1:3000
ENV NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
ENV NEXT_PUBLIC_API_BASE_URL=/api/v1
ENV INTERNAL_API_BASE_URL=http://127.0.0.1:3000/api/v1
ENV NEXT_PUBLIC_LOCALE_TRANSLATE=true
ENV LOCALE_TRANSLATION_PROVIDER=google_gtx
RUN pnpm build

FROM node:22-bookworm AS runner
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app ./
EXPOSE 3000
CMD ["pnpm", "start"]
