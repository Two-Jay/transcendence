echo "CREATE USER noname WITH ENCRYPTED PASSWORD '1111' SUPERUSER;" | psql --username postgres
# echo "CREATE DATABASE chat OWNER noname;" | psql --username postgres
echo "CREATE DATABASE transcendence OWNER noname;" | psql --username postgres
# echo "GRANT ALL PRIVILEGES ON DATABASE chat TO noname" | psql --username postgres
echo "GRANT ALL PRIVILEGES ON DATABASE transcendence TO noname" | psql --username postgres
