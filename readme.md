# Base Project with KOA Swagger and JWT

This repository contains a base project with the aim of creating a backend application using KOA, Swagger and JWT technologies for authentication. In addition, the project also includes a frontend with a layout integrated with KOA Swagger, using technologies such as Nodemon, TypeScript and following a separate architecture in *controller* and *service*. The database used is PostgreSQL, with Prisma being used as the ORM.

## Features

- Configuration of the KOA server to handle HTTP requests.
- Swagger integration to document the API in an automatic and user-friendly way.
- Implementation of JWT authentication to protect sensitive routes.
- Use of Nodemon to facilitate development by automatically restarting the server in the event of changes.
- Use of TypeScript to add typing and improve code maintenance.
- Clear separation of responsibilities with *controllers* handling requests and *services* handling business logic.
- Connection to the PostgreSQL database via Prisma, facilitating communication and data manipulation.

## Project structure

The project is structured as follows:

- `backend/`: Contains all the code related to the application's backend.
  - `prisma/`: Database structure.
  - `src/`: Contains the application's source code.
    - `controllers/`: Responsible for handling requests from routes.
    - `decorators/`: Middleware and configurations.
    - `utils/`: Shared functions.
    - `services/`: Contains the application's business logic.
    - `routes/`: Defines the API routes and uses the appropriate controllers.
    - `middlewares/`: Middleware for JWT authentication and other intermediate functionalities.
    - `index.ts`: Main file that configures the KOA server and defines the routes.
  - `swagger/`: Automatic configuration and management of Swagger.
- `frontend/`: Contains the code for the frontend integrated with KOA Swagger.

## Configuration

1. Clone this repository.
2. Configure the connection to the PostgreSQL database in the `.env` file.
  * DATABASE_URL="postgresql://postgres:admin@localhost:5432/basebackend", PORT=8080
3. Install the dependencies using `npm install` or `yarn install`.
3. Install docker `docker-compose up -d`.
3. Start the `npx prisma db push` database.
4. Start the backend server using `npm run start` or `yarn start`.
5. Access the frontend integrated with KOA Swagger to view the API documentation `http://localhost:3005/swagger`.

## Contribution

Contributions are welcome! Feel free to open issues and send pull requests and to send any kind of comments.