# Task-NodeJs-MongoDB

This project is a robust and scalable Node.js backend designed for secure user authentication using JWT, MongoDB integration for efficient data storage with Mongoose, and RESTful API development. 
The backend includes features for user profile management, post creation and retrieval, a commenting system, comprehensive error handling, and sanitized code.

## Features
- Basic Authentication (Register/Login with hashed password).
- JWT Tokens, make requests with a token after login with `Authorization` header with value `Bearer yourToken` where `yourToken` will be returned in Login response.
- Validations and sanitisation added.
- Custom error handler.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setting up environment](#environment)
  - [Installation](#installation)
- [Usage](#usage)
- [Application Structure](#structure)
- [License](#license)

## Getting Started
To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed
- #### MongoDB Installation Guide
  1. Download MongoDB - Visit the MongoDB download page at https://www.mongodb.com/try/download/shell to download the MongoDB shell.
  2. Open Command Prompt - Open your command prompt and type the following command to access the MongoDB shell
     
     ```sh
     mongosh
     ```
  3. Create a New Database
     
     ```sh
     use mydatabase
     ```
     Use the database name of your choice.

### Installation

1. Clone the repository:
   
   ```sh
   git clone https://github.com/ankitrekha01/Task-NodeJs-MongoDB
   ```
2. Install dependencies:
   
     ```sh
    npm install
    ```
## Environment
- Create a new file named .env and add the following details
  ```sh
  PORT=3000
  CONNECTION_STRING=mongodb://127.0.0.1:27017/mydatabase
  ACCESS_TOKEN_SECRET=mysecretkey
  JWT_EXPIRATION_TIME=3600
  ```

## Usage

- To run the server in dev mode
  ```sh
  npm run dev
  ```
- To run the server in production mode
  ```sh
  npm start
  ```
2.  Note that dev mode uses nodemon so that the server can be changed and restarted easily

## Structure
- `server.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `routes/` - This folder contains the route definitions for our API.
- `controllers/` - This folder contains controller logic for handling the operational logic of the application.
- `models/` - This folder contains the schema definitions for our Mongoose models.
- `helper/` - This folder contains functions used throughout the application
- `config/` - This folder contains the configuration for connecting to MongoDB.
- `middleware/` - This folder contains middleware functions.
- `errorCode.js` - This file contains the error and the message used in error handler middleware.

## License
This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
