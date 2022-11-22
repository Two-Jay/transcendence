# production docker
# FROM node:bullseye
# RUN apt-get update -y
FROM node:alpine
RUN apk update
RUN apk upgrade

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src/ ./src
RUN npm ci
RUN npm run build

ENTRYPOINT [ "node", "dist/main.js" ]

EXPOSE 3000





# # development docker
# FROM node:bullseye

# RUN apt-get update -y
# RUN apt-get install procps -y

# COPY setup/setup.sh .
# ENTRYPOINT [ "sh" ]
