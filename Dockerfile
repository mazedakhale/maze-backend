FROM node:18-alpine

WORKDIR /app

# Install basic utilities
RUN apk add --no-cache bash curl jq

# Copy dependency files
COPY package*.json ./
COPY wait-for-it.sh ./

RUN chmod +x wait-for-it.sh

# Remove any 'prepare' script that may break builds
RUN jq 'del(.scripts.prepare)' package.json > package.temp.json && mv package.temp.json package.json

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build app (requires devDependencies like cross-env, nestjs/cli)
RUN npm run build

# Remove dev dependencies AFTER build
RUN npm prune --production

EXPOSE 3000

# Start app, wait for MySQL first
CMD ["./wait-for-it.sh", "mysql:3306", "--", "node", "dist/main"]
