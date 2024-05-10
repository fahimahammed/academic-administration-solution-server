<div align="center">
  <h1>Academic Administration Solution</h1>
</div>
<div align="center">
  <strong></strong>
</div>


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
     PORT=<port-number>
     DATABASE_URL=<database-connection-string>
     JWT_SECRET=<jwt-secret-key>
     CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
     CLOUDINARY_API_KEY=<cloudinary-api-key>
     CLOUDINARY_API_SECRET=<cloudinary-api-secret>
     EMAIL_SERVICE=<email-service>
     EMAIL_USER=<email-user>
     EMAIL_PASSWORD=<email-password>
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

## Documentation
- [**Postman Documentation**](https://documenter.getpostman.com/view/3910568/2s93ecvq6w)

## License
[MIT](LICENSE)
