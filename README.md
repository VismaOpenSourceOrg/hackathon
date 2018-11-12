# Visma Hackathon Manager

Visma Hackathon is a simple application used to register and manage hackathons.

### Local environment

You need a few things to be able to build and run the application locally:

* `Java 8`
* `Maven`
* `Docker`
* Optional: `docker-compose`

Once everything is installed, you can follow these steps:

#### 1. Create Google OAuth2

Set up a new OAuth2 application screen here:
[https://console.cloud.google.com/apis/credentials/oauthclient/](https://console.cloud.google.com/apis/credentials/oauthclient/)

1. Select "Web Application"
2. **Name**: anything
3. **Authorised JavaScript origins**:
   * `http://localhost:8081`
   * `http://localhost:8080` (if you're using `webpack-dev-server`)
4. **Authorised redirect URIs**:
   * `http://localhost:8081/login/oauth2/code/google`
   * `http://localhost:8080/login/oauth2/code/google` (if you're using `webpack-dev-server`)
5. Save, and take note of the **Client ID** and **Client secret**

#### 2. Set up configuration

Set the following environment variable, using valid credentials for Google OAuth2.

```bash
export SPRING_APPLICATION_JSON='{ 
    "security": {
      "oauth2": {
        "client": {
          "registration": {
            "google": {
              "client-id": GOOGLE_AUTH_ID,
              "client-secret": GOOGLE_AUTH_SECRET
            }
          }
        }
      }
    }
  }
}'
```

#### 3. Start the database

You may either use docker compose:
```bash
$ docker-compose up
```

or use Docker directly:
```bash
$ docker run -p 5432:5432 -e POSTGRES_USER=vismahackathon -e POSTGRES_PASSWORD=hackathonpass -e POSTGRES_DB=hackathon postgres
```

#### 4. Run the application

You may either run the application from your favourite IDE (e.g. IntelliJ or Eclipse), or from the command line using maven:

```bash
$ mvn spring-boot:run -Pnode
```

The application should then be available on [http://localhost:8081](http://localhost:8081) (note port **8081**)

#### (Optional) 5. Start webpack live server

For rapid frontend development, it is recommended to start the `webpack-dev-server` plugin as well. This can be done by running `npm start` from the `client` folder:

```bash
$ cd client
$ npm start
```

This will start up a separate server on [http://localhost:8080](http://localhost:8080) (note port **8080**), proxying API calls to the backend.


### Configuration

The following configuration properties are required to run the application:

* Database:
  * `spring.datasource.url`
  * `spring.datasource.username`
  * `spring.datasource.password`
* Google OAuth2:
  * `spring.security.oauth2.client.registration.google.client-id`
  * `spring.security.oauth2.client.registration.google.client-secret`
* Redis session store:
  * `spring.redis.host`
  * `spring.redis.password`
  * `spring.redis.port`


They may be configured using the environment variable `SPRING_APPLICATION_JSON` as such:
```bash
export SPRING_APPLICATION_JSON='{ 
  "spring": {
    "datasource": {
      "url": DB_URL,
      "username": DB_USERNAME,
      "password": DB_PASSWORD
    },
    "redis": {
      "host": REDIS_HOST,
      "password": REDIS_PASSWORD,
      "port": REDIS_PORT
    },
    "security": {
      "oauth2": {
        "client": {
          "registration": {
            "google": {
              "client-id": GOOGLE_AUTH_ID,
              "client-secret": GOOGLE_AUTH_SECRET
            }
          }
        }
      }
    }
  }
}'
```

