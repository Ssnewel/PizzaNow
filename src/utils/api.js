// API utility functions for handling database operations
const API_BASE_URL = 'http://localhost/backend/api';

// Pizza API functions
export const pizzaApi = {
  // Get all pizzas
  getPizzas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pizzas.php`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching pizzas:', error);
      return { success: false, message: 'Failed to fetch pizzas' };
    }
  },

  // Get pizza categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pizzas.php?action=categories`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, message: 'Failed to fetch categories' };
    }
  }
};

// Auth API functions
export const authApi = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth.php?action=register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth.php?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Login failed' };
    }
  }
};

// Orders API functions
export const ordersApi = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, message: 'Order creation failed' };
    }
  },

  // Get orders for user
  getOrders: async (userId) => {
    try {
      const url = userId 
        ? `${API_BASE_URL}/orders.php?user_id=${userId}`
        : `${API_BASE_URL}/orders.php`;
      
      const response = await fetch(url);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { success: false, message: 'Failed to fetch orders' };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders.php?id=${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, message: 'Failed to update order status' };
    }
  }
};