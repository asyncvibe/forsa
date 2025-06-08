# Forsa - Online Marketplace

## Description

Forsa is an online marketplace application designed to facilitate buying and selling of various products. It features a comprehensive backend built with Node.js and Express, connected to a MongoDB database, and likely a frontend (based on the presence of `client/` and `angular-app/` directories).

## Features

- User authentication and authorization.
- Product listing and management.
- Category management for products.
- Keyword search for products.
- Notification system.
- Bug reporting.
- Advertisement management.
- Image uploads for products.

## Technologies Used

**Backend:**

- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT for authentication
- bcrypt-nodejs for password hashing
- SendGrid for email services
- Multer for handling multipart/form-data (file uploads)
- FCM Node for push notifications

**Frontend (inferred):**

- Angular (based on `angular-app` directory)

## Installation

To set up the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd forsa
    ```

2.  **Install backend dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following:

    ```
    SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
    // Other environment variables like MongoDB URI if not hardcoded in app.js
    ```

    _Note: The MongoDB connection string is currently hardcoded in `app.js`. Consider externalizing it for production environments._

4.  **Run the application:**

    ```bash
    npm start
    ```

    The backend server should now be running, typically on `http://localhost:3000` (or the port defined in `bin/www`).

5.  **Frontend Setup (if applicable):**
    Navigate to the `angular-app` directory and follow its specific installation instructions, usually:
    ```bash
    cd angular-app
    npm install
    ng serve
    ```

## Usage

Once the application is running, you can access the API endpoints or the frontend application (if available) to interact with the marketplace.

## API Endpoints (Inferred from routes)

- `/api/users` - User management (registration, login, profile, etc.)
- `/api/category` - Product category management
- `/api/property` - Product listing and details
- `/api/keyword` - Keyword search functionality
- `/api/notification` - User notifications
- `/api/list` - General listing functionalities
- `/api/faq` - Frequently Asked Questions
- `/api/bug` - Bug reporting
- `/api/ad` - Advertisement management

_(Note: Specific HTTP methods and payload details for each endpoint would require further API documentation.)_

## Project Structure

- `app.js`: Main application entry point, sets up Express, middleware, and routes.
- `bin/www`: Server startup script.
- `controllers/`: Contains logic for handling requests and responses.
- `models/`: Defines Mongoose schemas for MongoDB collections.
- `routes/`: Defines API routes and links them to controller functions.
- `public/`: Static assets.
- `uploads/`: Directory for uploaded files (e.g., product images).
- `views/`: EJS/Pug templates (if used for server-side rendering).
- `client/`: Likely contains the compiled frontend application.
- `angular-app/`: Source code for the Angular frontend application.
- `helper/`: Utility functions.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
