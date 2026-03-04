FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable \
  && corepack prepare yarn@4.12.0 --activate \
  && yarn install --immutable

COPY . .
RUN yarn build

FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable \
  && corepack prepare yarn@4.12.0 --activate \
  && yarn install --immutable --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["yarn", "start"]
