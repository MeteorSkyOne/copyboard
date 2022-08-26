FROM node:16.16.0-alpine

LABEL maintainer="MeteorSky <meteorskymail@gmail.com>"

WORKDIR /web

COPY web/package*.json ./

RUN npm install

COPY web .

RUN npm run build

WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server .

RUN mv /web/dist .

EXPOSE 3000

ENTRYPOINT npm run start