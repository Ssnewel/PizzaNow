export interface Pizza {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  prices: {
    small: number;
    medium: number;
    large: number;
  };
  ingredients: string[];
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
}

export interface CartItem {
  pizza: Pizza;
  size: 'small' | 'medium' | 'large';
  quantity: number;
  specialInstructions?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Order {
  id: number;
  userId?: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: Address;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'baking' | 'out-for-delivery' | 'delivered';
  estimatedDelivery: string;
  createdAt: string;
  specialInstructions?: string;
}