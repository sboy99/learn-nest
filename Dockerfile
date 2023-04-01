FROM node:18 AS builder

# Create app directory
WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

COPY prisma ./prisma/

# Install app dependencies
RUN yarn

COPY . .

RUN yarn build

FROM node:18

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder ["/app/package.json", "/app/yarn.lock", "./"]
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 8000
CMD [ "yarn", "start:migrate:prod" ]
