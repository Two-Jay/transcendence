# production docker
# FROM node:bullseye
# RUN apt-get update -y
# RUN apt-get install procps -y
FROM node:alpine
RUN apk update
RUN apk upgrade

WORKDIR /front_code_
COPY . .
RUN npm ci
RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]




# FROM node:bullseye

# RUN apt-get update -y
# RUN apt-get install procps -y

# COPY setup/setup.sh .
# ENTRYPOINT [ "setup.sh" ]
