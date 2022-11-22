FROM redis:bullseye
EXPOSE 6379
COPY redis.conf /usr/local/etc/redis/redis.conf
ENTRYPOINT [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
