FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app .
RUN npm ci --production
EXPOSE 3000
CMD ["node", "build/index.js"]
