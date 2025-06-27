-- Pizzeria Database Schema
-- Run this in phpMyAdmin or MySQL command line

CREATE DATABASE IF NOT EXISTS pizzeria_db;
USE pizzeria_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pizzas table
CREATE TABLE pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    category_id INT,
    price_small DECIMAL(10,2) NOT NULL,
    price_medium DECIMAL(10,2) NOT NULL,
    price_large DECIMAL(10,2) NOT NULL,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Pizza ingredients table
CREATE TABLE pizza_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pizza_id INT NOT NULL,
    ingredient VARCHAR(100) NOT NULL,
    FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- NULL for guest orders
    order_number VARCHAR(20) UNIQUE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'baking', 'out-for-delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    special_instructions TEXT,
    estimated_delivery DATETIME,
    
    -- Contact information
    contact_first_name VARCHAR(50) NOT NULL,
    contact_last_name VARCHAR(50) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    
    -- Delivery address
    delivery_street VARCHAR(255) NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_state VARCHAR(50) NOT NULL,
    delivery_zip_code VARCHAR(10) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    pizza_id INT NOT NULL,
    size ENUM('small', 'medium', 'large') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (pizza_id) REFERENCES pizzas(id)
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Classic', 'Traditional Italian pizzas with timeless flavors'),
('Gourmet', 'Premium pizzas with sophisticated ingredients'),
('Vegetarian', 'Delicious plant-based options'),
('Specialty', 'Unique Tony\'s signature creations');

-- Insert sample pizzas
INSERT INTO pizzas (name, description, image_url, category_id, price_small, price_medium, price_large, is_vegetarian, is_gluten_free) VALUES
('Margherita Classic', 'Fresh mozzarella, San Marzano tomatoes, fresh basil, extra virgin olive oil', 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg', 1, 12.99, 16.99, 20.99, TRUE, FALSE),
('Pepperoni Supreme', 'Premium pepperoni, mozzarella cheese, tangy tomato sauce', 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg', 1, 14.99, 18.99, 22.99, FALSE, FALSE),
('Quattro Stagioni', 'Four seasons pizza with mushrooms, artichokes, ham, and olives', 'https://images.pexels.com/photos/3915857/pexels-photo-3915857.jpeg', 2, 17.99, 22.99, 26.99, FALSE, FALSE),
('Prosciutto & Arugula', 'Thinly sliced prosciutto, fresh arugula, cherry tomatoes, parmesan', 'https://images.pexels.com/photos/4394612/pexels-photo-4394612.jpeg', 2, 19.99, 24.99, 28.99, FALSE, FALSE),
('Vegetarian Garden', 'Bell peppers, mushrooms, red onions, black olives, fresh tomatoes', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 3, 15.99, 19.99, 23.99, TRUE, FALSE),
('BBQ Chicken Ranch', 'Grilled chicken, BBQ sauce, red onions, cilantro, ranch drizzle', 'https://images.pexels.com/photos/2909822/pexels-photo-2909822.jpeg', 4, 16.99, 21.99, 25.99, FALSE, FALSE),
('Mediterranean Delight', 'Feta cheese, kalamata olives, sun-dried tomatoes, spinach, olive oil', 'https://images.pexels.com/photos/2909822/pexels-photo-2909822.jpeg', 3, 17.99, 22.99, 26.99, TRUE, FALSE),
('Meat Lovers', 'Pepperoni, Italian sausage, bacon, ham, mozzarella cheese', 'https://images.pexels.com/photos/3682837/pexels-photo-3682837.jpeg', 4, 18.99, 23.99, 27.99, FALSE, FALSE);

-- Insert pizza ingredients
INSERT INTO pizza_ingredients (pizza_id, ingredient) VALUES
(1, 'Mozzarella'), (1, 'San Marzano Tomatoes'), (1, 'Fresh Basil'), (1, 'Olive Oil'),
(2, 'Pepperoni'), (2, 'Mozzarella'), (2, 'Tomato Sauce'),
(3, 'Mushrooms'), (3, 'Artichokes'), (3, 'Ham'), (3, 'Olives'), (3, 'Mozzarella'),
(4, 'Prosciutto'), (4, 'Arugula'), (4, 'Cherry Tomatoes'), (4, 'Parmesan'),
(5, 'Bell Peppers'), (5, 'Mushrooms'), (5, 'Red Onions'), (5, 'Black Olives'), (5, 'Tomatoes'),
(6, 'Grilled Chicken'), (6, 'BBQ Sauce'), (6, 'Red Onions'), (6, 'Cilantro'), (6, 'Ranch'),
(7, 'Feta Cheese'), (7, 'Kalamata Olives'), (7, 'Sun-dried Tomatoes'), (7, 'Spinach'),
(8, 'Pepperoni'), (8, 'Italian Sausage'), (8, 'Bacon'), (8, 'Ham'), (8, 'Mozzarella');