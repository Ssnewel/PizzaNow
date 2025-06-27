# Tony's Pizzeria Backend API

This is the PHP backend for Tony's Pizzeria ordering system, designed to work with XAMPP.

## Setup Instructions

### 1. XAMPP Installation
1. Download and install XAMPP from https://www.apachefriends.org/
2. Start Apache and MySQL services from XAMPP Control Panel

### 2. Database Setup
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Import the database schema from `database/schema.sql`
3. This will create the `pizzeria_db` database with all necessary tables and sample data

### 3. File Placement
1. Copy the entire `backend` folder to your XAMPP `htdocs` directory
2. The API endpoints will be available at:
   - http://localhost/backend/api/pizzas.php
   - http://localhost/backend/api/auth.php
   - http://localhost/backend/api/orders.php

### 4. Frontend Configuration
Update your React frontend to use these API endpoints:
```javascript
const API_BASE_URL = 'http://localhost/backend/api';
```

## API Endpoints

### Pizzas API (`/api/pizzas.php`)
- `GET /api/pizzas.php` - Get all pizzas
- `GET /api/pizzas.php?action=categories` - Get pizza categories

### Authentication API (`/api/auth.php`)
- `POST /api/auth.php?action=register` - Register new user
- `POST /api/auth.php?action=login` - User login

### Orders API (`/api/orders.php`)
- `GET /api/orders.php` - Get all orders
- `GET /api/orders.php?user_id=1` - Get orders for specific user
- `POST /api/orders.php` - Create new order
- `PUT /api/orders.php?id=1` - Update order status

## Database Schema

The database includes the following main tables:
- `users` - Customer accounts
- `addresses` - Delivery addresses
- `categories` - Pizza categories
- `pizzas` - Pizza menu items
- `pizza_ingredients` - Pizza ingredients
- `orders` - Customer orders
- `order_items` - Individual items in orders

## Features

- User authentication (register/login)
- Pizza menu management
- Order processing
- Guest checkout support
- Order status tracking
- Delivery address management

## Security

- Password hashing using PHP's `password_hash()`
- SQL injection prevention with prepared statements
- CORS headers for frontend integration
- Input validation and sanitization

## Sample Data

The schema includes sample pizzas and categories to get you started. You can modify these through phpMyAdmin or add your own management interface.