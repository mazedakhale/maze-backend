FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash curl jq

COPY package*.json ./
COPY wait-for-it.sh ./

RUN chmod +x wait-for-it.sh

RUN jq 'del(.scripts.prepare)' package.json > package.temp.json && mv package.temp.json package.json

RUN npm install
RUN npm prune --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["./wait-for-it.sh", "mysql:3306", "--", "node", "dist/main"]
