FROM node:16 as build-stage

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app
COPY . ./
RUN pnpm install --frozen-lockfile
EXPOSE 8081

CMD ["pnpm", "dev", "--host", "8081"]