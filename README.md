
## Getting started 
1) install dependencies (Built with Node.js)

```sh
npm install
```

2) run migrations and seeders

```sh
node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed:all
```

4) run unit tests

```sh
npm test
```

4) start express server

```
npm start
```

## Endpoints description

samples of API's requests via Postman is attached.

###Task 1:
POST new person [http://localhost:3000/persons](http://localhost:3000/persons).
it will validate the request and add the person to database. Avatar is attached as base64 string.

###Task 2:
POST generate token [http://localhost:3000/oauth/token](http://localhost:3000/oauth/token).
generate token based on phone and password saved in person record in db.

###Task 3: 
POST verify token [http://localhost:3000/oauth/verify](http://localhost:3000/oauth/verify).		
verifying the passed token and phone against the data in the AuthToken table and return the status as following:
	- if the phone or the token are not exists in the table, I return status = not exists.
	- if the phone and the token are exists in the table, I check the Expiry date assigned to it and I return status = expired if it's less than Now.
	- els I return status = valid.

## DDD and Clean Architecture

The application follows the Uncle Bob "[Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html)" principles and project structure :

### Clean Architecture layers

![Schema of flow of Clean Architecture](/doc/Uncle_Bob_Clean_Architecture.jpg)


### Flow of Control

![Schema of flow of Control](/doc/Hapijs_Clean_Architecture.svg)
