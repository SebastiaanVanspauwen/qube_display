# build stage
FROM node:16 as build-stage

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY src ./src

RUN pnpm build

EXPOSE 9000 10016 7777

CMD ["pnpm", "serve"]
