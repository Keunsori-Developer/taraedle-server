FROM node:18-alpine AS builder
RUN mkdir -p /var/app
WORKDIR /var/app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
RUN mkdir -p /var/app
WORKDIR /var/app
COPY --from=builder /var/app/dist ./dist
COPY --from=builder /var/app/.env ./.env
COPY --from=builder /var/app/package.json ./package.json
COPY --from=builder /var/app/package-lock.json ./package-lock.json
COPY --from=builder /var/app/node_modules ./node_modules

CMD [ "node", "./dist/main" ]