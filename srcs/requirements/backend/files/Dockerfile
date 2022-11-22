# production docker
# FROM node:bullseye
# RUN apt-get update -y

FROM node:alpine
RUN apk update
RUN apk upgrade

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci
COPY src/ ./src
COPY user_profile_images/ ./user_profile_images
RUN npm run build

ENTRYPOINT [ "node", "dist/main.js" ]





# # development docker
# FROM node:bullseye

# RUN apt-get update -y
# RUN apt-get install procps -y

# COPY setup/setup.sh .
# ENTRYPOINT [ "sh" ]
