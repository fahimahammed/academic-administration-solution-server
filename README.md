<p align="center">
  <img src="https://i.ibb.co/VSMGVXd/logo-secondary.png" width="200" alt="AAS Logo">
</p>

<div align="center">
  <h1>Academic Administration Solution</h1>
</div>

[![Server](https://img.shields.io/badge/Server-Yes-brightgreen)](https://github.com/fahimahammed/academic-administration-solution-server) [![Version](https://img.shields.io/badge/Version-1.0-blue)](https://github.com/fahimahammed/academic-administration-solution-server) [![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/fahimahammed/academic-administration-solution-server) [![PostMan Documentation](https://img.shields.io/badge/Documentation-Link-blue)](https://documenter.getpostman.com/view/3910568/2s93ecvq6w) [![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

<!-- [![Release](https://img.shields.io/github/v/release/fahimahammed/academic-administration-solution-server)](https://github.com/fahimahammed/academic-administration-solution-server)

[![Issues](https://img.shields.io/github/issues/fahimahammed/academic-administration-solution-server)](https://github.com/fahimahammed/academic-administration-solution-server/issues) -->



#

Welcome to the Academic Administration Solution server repository! This server is an integral part of our university management system designed to streamline administrative processes, enhance communication, and facilitate academic operations for students, faculty, and administrators.


## Getting Started

To set up the server locally, follow these steps:

1. **Clone the Repository:** 
   ```bash
   git clone https://github.com/fahimahammed/academic-administration-solution-server.git
   ```
   
2. **Install Dependencies:** 
   ```
   cd academic-administration-server
   yarn install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the root directory.
   - Define the following environment variables:
     ```
     NODE_ENV=development
      PORT=<PORT>
      DATABASE_URL=<DATABASE_URL>
      USER_DEFAULT_PASS = <PASSWORD>
      JWT_SECRET=<SECRET>
      JWT_EXPIRES_IN=<JWT_EXPIRES_IN>
      JWT_REFRESH_SECRET=<JWT_REFRESH_SECRET>
      JWT_REFRESH_EXPIRES_IN=<JWT_REFRESH_EXPIRES_IN>
      PASS_RESET_TOKEN_EXPIRES_IN=<PASS_RESET_TOKEN_EXPIRES_IN>
      CLOUD_NAME=<CLOUD_NAME>
      API_KEY=<API_KEY>
      API_SECRET=<API_SECRET>
      FORGOT_PASS_RESET_LINK=<FORGOT_PASS_RESET_LINK>
      EMAIL=<EMAIL>
      APP_PASS=<APP_PASS>
      STORE_ID=<STORE_ID>
      STORE_PASSWORD=<STORE_PASSWORD>
      PAYMENT_API=<PAYMENT_API>
      VALIDATION_API=<VALIDATION_API>
      SUCCESS_URL=<SUCCESS_URL>
      CANCEL_URL=<CANCEL_URL>
      FAILED_URL=<FAILED_URL>
     ```

4. **Database Setup:**
   - Ensure that you have a compatible database system (e.g., PostgreSQL) installed and running.
   - Update the `DATABASE_URL` variable in `.env` with your database connection string.

5. **Run the Server:**
   ```
   yarn dev
   ```

## Technology Stack

- **Prisma ORM:** Modern database toolkit for TypeScript and Node.js.
- **TypeScript:** Typed superset of JavaScript that compiles to plain JavaScript.
- **JWT:** Secure method for authentication and generating access tokens.
- **Node.js:** Server-side JavaScript runtime.
- **Express.js:** Web application framework for Node.js.
- **Node Mailer:** Module for sending emails from Node.js applications.
- **Cloudinary:** Cloud-based image and video management platform.
- **bcrypt:** Password hashing library for securing user credentials.
- **Multer:** Middleware for handling multipart/form-data for file uploads.

## Contributors
- Fahim Ahammed Firoz <https://github.com/fahimahammed>

