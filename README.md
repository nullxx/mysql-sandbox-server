
<h1 align="center">
<img src="logo.svg" width="120">
    <p>
    MYSQL Sandbox
    </p>
</h1>

![GitHub top language](https://img.shields.io/github/languages/top/nullxx/mysql-sandbox-server?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/nullxx/mysql-sandbox-server?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/nullxx/mysql-sandbox-server?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/nullxx/mysql-sandbox-server?style=for-the-badge)

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#requirements">Requirements</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

# Getting started
This is the backend for mysql-sandbox. This is a online real database program to test your mysql queries.

You can see a demo [here](https://mysql-sandbox.nullx.me/)
# Develop
## Requirements
* Docker
## Installation
This repo has two containers:
* MySQL container
  * Port exposed: [6603](https://github.com/nullxx/mysql-sandbox-server/blob/f4a2241f4075c50d4b57b49ac165dcf438956ecc/docker-compose.yml#L6)
* api container
  * Port exposed: [3001](https://github.com/nullxx/mysql-sandbox-server/blob/f4a2241f4075c50d4b57b49ac165dcf438956ecc/docker-compose.yml#L12)
* Steps to follow:
   * Place environment variables
   * Edit ```.env```variable with your favourite text editor
   * Run it

    ```console
    nullxx@github:~$ cp ./nodejs-microservice/.env.example ./nodejs-microservice/.env
    nullxx@github:~$ nano ./nodejs-microservice/.env
    nullxx@github:~$ docker-compose up --build
    ```
    <details>
    <summary>Example output</summary>
    
        Building mysql
        Step 1/3 : FROM mysql:5.7
         ---> 697daaecf703
        Step 2/3 : ENV MYSQL_DATABASE=mysql-sandbox     MYSQL_ROOT_PASSWORD=password
         ---> Running in ac84e2713a4d
        Removing intermediate container ac84e2713a4d
         ---> 930105b5643b
        Step 3/3 : COPY ./test-dump.sql /docker-entrypoint-initdb.d/
         ---> 114478ea6327

        Successfully built 114478ea6327
        Successfully tagged mysql-sandbox-server_mysql:latest
        Building api
        Step 1/7 : FROM node:8
         ---> 8eeadf3757f4
        Step 2/7 : RUN mkdir -p /usr/src/app
         ---> Using cache
         ---> bf4493fd7ed0
        Step 3/7 : WORKDIR /usr/src/app
         ---> Using cache
         ---> 0877598c5940
        Step 4/7 : COPY package*.json ./
         ---> Using cache
         ---> e97762c50a31
        Step 5/7 : RUN npm install
         ---> Using cache
         ---> c01208cac595
        Step 6/7 : COPY . .
         ---> f4e2f107f924
        Step 7/7 : CMD ["node", "-r", "dotenv/config", "app.js", "dotenv_config_path=.env"]
         ---> Running in a76662e0984b
        Removing intermediate container a76662e0984b
         ---> 23783deb2454

        Successfully built 23783deb2454
        Successfully tagged mysql-sandbox-server_api:latest
        Creating mysql-sandbox-server_mysql_1 ... done
        Creating mysql-sandbox-server_api_1   ... done
        Attaching to mysql-sandbox-server_mysql_1, mysql-sandbox-server_api_1
        mysql_1  | 2021-01-03 23:04:34+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 5.7.32-1debian10 started.
        mysql_1  | 2021-01-03 23:04:37+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
        mysql_1  | 2021-01-03 23:04:37+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 5.7.32-1debian10 started.
        mysql_1  | 2021-01-03T23:04:38.543789Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
        mysql_1  | 2021-01-03T23:04:38.571303Z 0 [Note] mysqld (mysqld 5.7.32) starting as process 1 ...
        mysql_1  | 2021-01-03T23:04:38.628169Z 0 [Note] InnoDB: PUNCH HOLE support available
        mysql_1  | 2021-01-03T23:04:38.628218Z 0 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
        mysql_1  | 2021-01-03T23:04:38.628223Z 0 [Note] InnoDB: Uses event mutexes
        mysql_1  | 2021-01-03T23:04:38.628226Z 0 [Note] InnoDB: GCC builtin __atomic_thread_fence() is used for memory barrier
        mysql_1  | 2021-01-03T23:04:38.628228Z 0 [Note] InnoDB: Compressed tables use zlib 1.2.11
        mysql_1  | 2021-01-03T23:04:38.628231Z 0 [Note] InnoDB: Using Linux native AIO
        mysql_1  | 2021-01-03T23:04:38.642928Z 0 [Note] InnoDB: Number of pools: 1
        mysql_1  | 2021-01-03T23:04:38.659349Z 0 [Note] InnoDB: Using CPU crc32 instructions
        mysql_1  | 2021-01-03T23:04:38.676993Z 0 [Note] InnoDB: Initializing buffer pool, total size = 128M, instances = 1, chunk size = 128M
        mysql_1  | 2021-01-03T23:04:38.719152Z 0 [Note] InnoDB: Completed initialization of buffer pool
        mysql_1  | 2021-01-03T23:04:38.725197Z 0 [Note] InnoDB: If the mysqld execution user is authorized, page cleaner thread priority can be changed. See the man page of setpriority().
        mysql_1  | 2021-01-03T23:04:38.872703Z 0 [Note] InnoDB: Highest supported file format is Barracuda.
        mysql_1  | 2021-01-03T23:04:39.059726Z 0 [Note] InnoDB: Log scan progressed past the checkpoint lsn 12799508
        mysql_1  | 2021-01-03T23:04:39.060097Z 0 [Note] InnoDB: Doing recovery: scanned up to log sequence number 12799517
        mysql_1  | 2021-01-03T23:04:39.060292Z 0 [Note] InnoDB: Database was not shutdown normally!
        mysql_1  | 2021-01-03T23:04:39.060323Z 0 [Note] InnoDB: Starting crash recovery.
        api_1    | info: 
        api_1    | 	APP started at port 3001
        mysql_1  | 2021-01-03T23:04:39.856669Z 0 [Note] InnoDB: Removed temporary tablespace data file: "ibtmp1"
        mysql_1  | 2021-01-03T23:04:39.857250Z 0 [Note] InnoDB: Creating shared tablespace for temporary tables
        mysql_1  | 2021-01-03T23:04:39.858738Z 0 [Note] InnoDB: Setting file './ibtmp1' size to 12 MB. Physically writing the file full; Please wait ...
        mysql_1  | 2021-01-03T23:04:40.184159Z 0 [Note] InnoDB: File './ibtmp1' size is now 12 MB.
        mysql_1  | 2021-01-03T23:04:40.192905Z 0 [Note] InnoDB: 96 redo rollback segment(s) found. 96 redo rollback segment(s) are active.
        mysql_1  | 2021-01-03T23:04:40.193564Z 0 [Note] InnoDB: 32 non-redo rollback segment(s) are active.
        mysql_1  | 2021-01-03T23:04:40.195089Z 0 [Note] InnoDB: Waiting for purge to start
        mysql_1  | 2021-01-03T23:04:40.249898Z 0 [Note] InnoDB: 5.7.32 started; log sequence number 12799517
        mysql_1  | 2021-01-03T23:04:40.260222Z 0 [Note] Plugin 'FEDERATED' is disabled.
        mysql_1  | 2021-01-03T23:04:40.280246Z 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
        mysql_1  | 2021-01-03T23:04:40.590977Z 0 [Note] Found ca.pem, server-cert.pem and server-key.pem in data directory. Trying to enable SSL support using them.
        mysql_1  | 2021-01-03T23:04:40.591023Z 0 [Note] Skipping generation of SSL certificates as certificate files are present in data directory.
        mysql_1  | 2021-01-03T23:04:40.616445Z 0 [Warning] CA certificate ca.pem is self signed.
        mysql_1  | 2021-01-03T23:04:40.621020Z 0 [Note] Skipping generation of RSA key pair as key files are present in data directory.
        mysql_1  | 2021-01-03T23:04:40.644231Z 0 [Note] Server hostname (bind-address): '*'; port: 3306
        mysql_1  | 2021-01-03T23:04:40.644303Z 0 [Note] IPv6 is available.
        mysql_1  | 2021-01-03T23:04:40.648169Z 0 [Note]   - '::' resolves to '::';
        mysql_1  | 2021-01-03T23:04:40.648245Z 0 [Note] Server socket created on IP: '::'.
        mysql_1  | 2021-01-03T23:04:40.659280Z 0 [Warning] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
        mysql_1  | 2021-01-03T23:04:41.036258Z 0 [Note] InnoDB: Buffer pool(s) load completed at 210103 23:04:41
        mysql_1  | 2021-01-03T23:04:42.801294Z 0 [Note] Event Scheduler: Loaded 0 events
        mysql_1  | 2021-01-03T23:04:42.802558Z 0 [Note] mysqld: ready for connections.
        mysql_1  | Version: '5.7.32'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)
    </details>

## Acknowledgements
<div>Icon designed by <a href="https://www.flaticon.es/autores/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>
