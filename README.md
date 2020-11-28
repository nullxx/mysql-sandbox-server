<h1 align="center">
<img src="logo.svg" width="120">
    <p>
    MYSQL Sandbox
    </p>
</h1>

# Getting started
This is the backend for mysql-sandbox. This is a online real database program to test your mysql queries.
# Develop
## Requirements
* Docker
## Building
This repo has two containers:
* MySQL container
  * Port exposed: [6603](https://github.com/nullxx/mysql-sandbox-server/blob/f4a2241f4075c50d4b57b49ac165dcf438956ecc/docker-compose.yml#L6)
* api container
  * Port exposed: [3001](https://github.com/nullxx/mysql-sandbox-server/blob/f4a2241f4075c50d4b57b49ac165dcf438956ecc/docker-compose.yml#L12)

* ```cp .env.example .env``` inside ```./nodejs-microservice``` and place there your environment variables.
* ```docker-compose up --build```


## Attribution
<div>Icon designed by <a href="https://www.flaticon.es/autores/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>
