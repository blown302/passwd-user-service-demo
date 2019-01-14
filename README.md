# PASSWD User Service Demo

An example of a service layer that exposes user information that is stored in /etc/passwd and /etc/groups files.

## Installation

### Docker

For convenience a docker image has been provided as well as a docker compose file.

To run with docker compose make user you have `docker-compose.yml` in your working
directory and run:

```bash
docker-compose up
```

This will pull the image and launch the service with port 3000 published.

Alternatively if you don't want to use docker-compose run with docker run:

```bash
docker run -p 3000:3000 blown302/passwd-user-service-demo
```

To run unit tests:

```bash
docker run blown302/passwd-user-service-demo npm test
```


### Install locally

Once the this repo is cloned to your machine, make sure you have nodejs installed. 
The service is tested with `node 11` but other previous versions that support `async/await`
may work as well.

Install dependencies with command below:

```bash
npm i
``` 

To run:

```bash
npm start
```

To run unit tests:

```bash
npm test
```

## Users resource:

### Get all users

`/users`

Gets all of the users in the passwd file.

Example result:
```json
[
    {
        "name": "root",
        "uid": 0,
        "gid": 0,
        "comment": "root",
        "home": "/root",
        "shell": "/bin/bash"
    },
    {
        "name": "daemon",
        "uid": 1,
        "gid": 1,
        "comment": "daemon",
        "home": "/usr/sbin",
        "shell": "/usr/sbin/nologin"
    }
]
```

### Get users By id

`/user/:uid`

Gets user by it's uid.

Will return a `404 NOT FOUND` if user does not exist.

Example result:

```json
{
    "name": "games",
    "uid": 5,
    "gid": 60,
    "comment": "games",
    "home": "/usr/games",
    "shell": "/usr/sbin/nologin"
}
```

### Query users

`/users/query`

Queries for users from exact match query parameters.

Supported query parameters:

- name
- uid
- gid
- comment
- home
- shell -- must be url encoded i.e. `/users/query?shell=%2Fbin%2Fbash`

Example query:

`/users/query?uid=5&shell=%2Fbin%2Fbash`

Example result:

```json
[
    {
        "name": "games",
        "uid": 5,
        "gid": 60,
        "comment": "games",
        "home": "/usr/games",
        "shell": "/usr/sbin/nologin"
    }
]
```

### Get User Groups

`/users/:uid/groups`

Gets all of the groups which the user is a member of.

Will return a `404 NOT FOUND` if the user does not exist.

Example result:

```json
[
    {
        "name": "demo",
        "gid": 1001,
        "members": [
            "node",
            "video",
            "games"
        ]
    }
]
```

### Get all groups

`/groups`

Gets all groups from the groups file.

Example result:

```json
[
    {
        "name": "ssh",
        "gid": 101,
        "members": []
    },
    {
        "name": "node",
        "gid": 1000,
        "members": []
    },
    {
        "name": "demo",
        "gid": 1001,
        "members": [
            "node",
            "video",
            "games"
        ]
    }
]
```

### Get group by id

`/groups/:gid`

Gets a group by it's provided gid.

Will return a `404 NOT FOUND` if the group does not exist.

Example result:

```json
{
    "name": "man",
    "gid": 12,
    "members": []
}
```

### Query groups

`/groups/query`

Queries for users from exact match query parameters.

Supported query parameters:

- name
- gid
- member -- can be repeated for a subset match i.e. `/groups/query?member=root&member=games`

Example query:

`/groups/query?member=node&member=games&gid=28`

Example result:

```json
[
    {
        "name": "demo",
        "gid": 1001,
        "members": [
            "node",
            "video",
            "games"
        ]
    }
]
```

## Postman collection 

A Postman collection has been provided as a guide and some light end-to-end testing.
These tests could be added to a continuous integration pipeline to provide automated 
end-to-end tests.

The collection is located:

`e2e-tests/passwd-user-service.postman_collection.json`
