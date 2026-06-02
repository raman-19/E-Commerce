# E-Commerce Backend API

## Overview

A scalable RESTful E-Commerce Backend built using Node.js, Express.js, MongoDB, and JWT Authentication.

This project implements the core backend functionality required for a modern e-commerce platform, including:

* User Authentication & Authorization
* Product Management
* Shopping Cart System
* Order Management
* Payment Management
* Secure JWT Authentication
* Cloudinary Image Uploads
* MongoDB Data Persistence

The application follows a modular architecture with separate controllers, routes, models, middleware, and utility functions for maintainability and scalability.

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (Access Token & Refresh Token)

### File Upload

* Multer
* Cloudinary

### Security

* HTTP Only Cookies
* JWT Verification Middleware
* Protected Routes

### Development Tools

* Postman
* Nodemon
* Git & GitHub

---

## Project Structure

```bash
src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── db/
├── app.js
└── index.js
```

---

## Features

### User Management

* User Registration
* User Login
* User Logout
* Refresh Access Token
* Get Current User
* Update Account Details
* Change Password

---

### Product Management

* Create Product
* Get All Products
* Get Single Product
* Update Product
* Delete Product
* Upload Product Images

---

### Cart Management

* Add Product to Cart
* View Cart
* Update Quantity
* Remove Product from Cart
* Clear Cart

---

### Order Management

* Create Order From Cart
* Get User Orders
* Get Single Order
* Cancel Order
* Update Order Status
* Admin Order Management

---

### Payment Management

* Create Payment
* Get Payment Details
* Get User Payments
* Update Payment Status
* Payment Tracking

---

## Authentication Flow

1. User Registers
2. User Logs In
3. Access Token Generated
4. Protected Routes Use JWT Middleware
5. Authorized User Can Access Secure APIs

---

## API Endpoints

### User Routes

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| POST   | /api/v1/users/register       | Register User        |
| POST   | /api/v1/users/login          | Login User           |
| POST   | /api/v1/users/logout         | Logout User          |
| GET    | /api/v1/users/current-user   | Get Current User     |
| PATCH  | /api/v1/users/update-account | Update Account       |
| POST   | /api/v1/users/refresh-token  | Refresh Access Token |

---

### Product Routes

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | /api/v1/products     | Create Product     |
| GET    | /api/v1/products     | Get All Products   |
| GET    | /api/v1/products/:id | Get Single Product |
| PATCH  | /api/v1/products/:id | Update Product     |
| DELETE | /api/v1/products/:id | Delete Product     |

---

### Cart Routes

| Method | Endpoint                        | Description     |
| ------ | ------------------------------- | --------------- |
| POST   | /api/v1/carts/add               | Add To Cart     |
| GET    | /api/v1/carts                   | Get Cart        |
| PATCH  | /api/v1/carts/update            | Update Quantity |
| DELETE | /api/v1/carts/remove/:productId | Remove Product  |

---

### Order Routes

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| POST   | /api/v1/orders            | Create Order        |
| GET    | /api/v1/orders/my-order   | Get User Orders     |
| GET    | /api/v1/orders/:id        | Get Single Order    |
| PATCH  | /api/v1/orders/:id/cancel | Cancel Order        |
| PATCH  | /api/v1/orders/:id/status | Update Order Status |
| GET    | /api/v1/orders/admin/all  | Get All Orders      |

---

### Payment Routes

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| POST   | /api/v1/payments             | Create Payment        |
| GET    | /api/v1/payments/my-payments | Get User Payments     |
| GET    | /api/v1/payments/:id         | Get Single Payment    |
| PATCH  | /api/v1/payments/:id/status  | Update Payment Status |

---

## Order Processing Workflow

```text
User
 ↓
Browse Products
 ↓
Add Product To Cart
 ↓
Update Cart Quantity
 ↓
Create Order
 ↓
Calculate Total Price
 ↓
Create Payment
 ↓
Payment Success
 ↓
Order Processing
```

---

## Database Models

### User

* Name
* Email
* Password
* Avatar
* Refresh Token

### Product

* Name
* Description
* Price
* Stock
* Category
* Images

### Cart

* User
* Products
* Quantity

### Order

* User
* Order Items
* Shipping Address
* Total Price
* Order Status

### Payment

* User
* Order
* Amount
* Payment Method
* Payment Status
* Transaction ID

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_URI

ACCESS_TOKEN_SECRET=YOUR_ACCESS_SECRET

REFRESH_TOKEN_SECRET=YOUR_REFRESH_SECRET

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME

CLOUDINARY_API_KEY=YOUR_API_KEY

CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

---

## Installation

### Clone Repository

```bash
git clone <https://github.com/raman-19/E-Commerce>
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

---

## Testing

All APIs have been tested using Postman.

The project includes:

* Authentication Testing
* Product CRUD Testing
* Cart Operations Testing
* Order Workflow Testing
* Payment Workflow Testing

---

## Future Improvements

* Razorpay Integration
* Stripe Integration
* Product Search & Filtering
* Product Reviews & Ratings
* Wishlist System
* Admin Dashboard
* Email Notifications
* Inventory Analytics
* Coupon & Discount System

---

## Author

Raman Tiwary

Backend Developer | MERN Stack Enthusiast

This project was built as a complete backend implementation of an E-Commerce platform to strengthen backend development skills and understand real-world API architecture.
