# 빌드 스테이지
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY .env.production .env.production
COPY . .
RUN npm run build

# Caddy 스테이지
FROM caddy:2.7-alpine
COPY --from=builder /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile