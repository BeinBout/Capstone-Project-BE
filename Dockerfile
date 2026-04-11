FROM node:25.8.0 AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

FROM node:25.8.0 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

FROM node:25.8.0 AS runtime

WORKDIR /app

RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app .

RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/index.js"]