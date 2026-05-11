FROM node:24-slim AS builder

WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV npm_config_user_agent=pnpm/11.0.0

RUN corepack enable

COPY . .
RUN find . -name "*.tsbuildinfo" -delete

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm run build

FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app /app

EXPOSE 8080

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
