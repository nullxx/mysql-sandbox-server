## Pull the mysql:5.7 image
FROM mysql:5.7

ENV MYSQL_DATABASE=mysql-sandbox \
    MYSQL_ROOT_PASSWORD=password

# when container will be started, we'll have `mysql-sandbox` database created with this schema
COPY ./setup.sql /docker-entrypoint-initdb.d/
