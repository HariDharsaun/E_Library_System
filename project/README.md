# E-Library Management System

A full-stack library management system built with React, Node.js, Express, and MongoDB.

## Features

- User and admin authentication
- Book browsing and borrowing system
- Due date tracking with automatic 14-day lending period
- Email notifications for upcoming due dates
- Late return fine calculation (₹5 per day)
- Admin dashboard for book and user management
- Responsive design for all devices

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- React Router for navigation
- Axios for API requests
- Lucide React for icons
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB for database
- Mongoose ODM
- JWT for authentication
- Nodemailer for email notifications
- bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or Atlas account)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd e-library-management-system
```

2. Install dependencies for both frontend and backend
```
npm run install:all
```

3. Configure environment variables
- Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Library_DB
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
```

4. Start the application
```
npm run dev:all
```

This will start both the frontend (Vite dev server) and backend (Express server).

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Database Setup

The application will automatically connect to MongoDB using the provided URI and create the necessary collections:

- users: Stores user information
- books: Stores book information
- transactions: Stores borrowing/returning transactions

## Initial Data

You can create an admin user by making a POST request to:
```
POST http://localhost:5000/api/users/create-admin
```
With the following data:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

## Testing the Application

1. Register a new user account
2. Log in with your credentials
3. Browse and borrow books
4. Return books and observe fine calculations
5. Log in as admin to manage books and users

## Email Notifications

The system is configured to send email notifications to users:
- 2 days before the due date
- 1 day before the due date

Make sure to configure valid email credentials in the `.env` file to enable this feature.

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login
- GET /api/auth/profile - Get user profile

### Books
- GET /api/books - Get all books
- GET /api/books/:id - Get book by ID
- POST /api/books - Add new book (admin only)
- PUT /api/books/:id - Update book (admin only)
- DELETE /api/books/:id - Delete book (admin only)
- POST /api/books/purchase - Borrow a book
- POST /api/books/return - Return a book
- GET /api/books/user/books - Get user's current books
- POST /api/books/pay-fine - Pay fine for late return

### Users
- GET /api/users - Get all users (admin only)
- GET /api/users/transactions - Get user transactions
- GET /api/users/pending-returns - Get user's pending returns
- POST /api/users/create-admin - Create admin user