
# ==============
# dev version setup.
# rogratate added

# production docker
FROM nginx:alpine

# Install logrotate
RUN apk add --no-cache logrotate

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./logrotate.conf /etc/logrotate.conf

COPY ./script.sh /script.sh
RUN chmod +x /script.sh
RUN mkdir -p /logs
RUN logrotate -d -f /etc/logrotate.d/nginx 

ENTRYPOINT ["/script.sh"]

EXPOSE 80

# ==============

# ==============
# build version setup.

# # production docker
# FROM nginx:alpine

# RUN apk update && apk add nginx \
#     && apk add --no-cache logrotate

# COPY nginx.conf ./etc/nginx/nginx.conf
# ENTRYPOINT ["nginx", "-g", "daemon off;"]
# EXPOSE 80

# ==============

# // old_dockerfile
# WORKDIR /usr/src/app
# COPY package*.json ./
# COPY tsconfig*.json ./
# RUN npm ci
# COPY src/ ./src
# RUN npm run build

# COPY nginx.conf ./etc/nginx/nginx.conf
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

# ./proxy/nginx.conf:/etc/nginx/nginx.conf
# FROM node:bullseye

# RUN apt-get update -y
# RUN apt-get install procps -y

# COPY setup/setup.sh .
# ENTRYPOINT [ "sh" ]
