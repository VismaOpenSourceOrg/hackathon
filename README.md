# Teamhacker – Visma Hackathon Manager

Teamhacker is a simple application used to register and manage hackathons.

### Features

* Sign in using Google OAuth2
* Register ideas
* Like/unlike ideas


### Configuration

The following configuration properties are required to run the application:
* 

They may be configured using the environment variable `SPRING_APPLICATION_JSON` as such:
```bash
export SPRING_APPLICATION_JSON='{ 
  "spring": {
    "datasource": {
      "url": DB_URL,
      "username": DB_USERNAME,
      "password": DB_PASSWORD
    },
    "security": {
      "oauth2": {
        "client": {
          "registration": {
            "google": {
              "client-id": GOOGLE_AUTH_ID,
              "client-secret": GOOGLE_AUTH_SECRET_
            }
          }
        }
      }
    }
  }
}'
```

