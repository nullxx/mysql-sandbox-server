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

# Getting started
This is the backend for mysql-sandbox. This is a online real database program to test your mysql queries.

You can see a demo [here](https://mysql-sandbox.nullx.me/)
# Develop
## Requirements
* Docker
## Building
This repo has two containers:
* MySQL container
  * Port exposed: [6603](https://github.com/nullxx/mysql-sandbox-server/blob/f4a2241f4075c50d4b57b49ac165dcf438956ecc/docker-compose.yml#L6)
* api container
  * Port exposed: [3001](https://github.com/nullxx/mysql-sandbox-server/blob/f4a2241f4075c50d4b57b49ac165dcf438956ecc/docker-compose.yml#L12)
* Place environment variables
```bash
cp ./nodejs-microservice/.env.example .env
```
* Edit ```.env```variable with your favourite text editor
```bash
nano .env
```
* Run it
```bash
docker-compose up --build
```


## Attribution
<div>Icon designed by <a href="https://www.flaticon.es/autores/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>
