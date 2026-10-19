# syntax=docker/dockerfile:1

# ---- build ----
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

COPY . .

# Public origin: set in Coolify as a *build* variable (e.g. https://maelle.example.com).
ARG SITE_URL=https://example.com
ENV VITE_SITE_URL=$SITE_URL
# The Lovable config defaults to Cloudflare; NITRO_PRESET wins and targets a plain Node server.
ENV NITRO_PRESET=node-server

RUN bun run build \
 && sed -i "s|__SITE_URL__|${SITE_URL%/}|g" .output/public/sitemap.xml .output/public/robots.txt

# ---- run ----
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0
COPY --from=build /app/.output ./.output

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null || exit 1

CMD ["node", ".output/server/index.mjs"]
