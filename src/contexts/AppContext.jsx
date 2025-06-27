import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  cart: [],
  user: null,
  isAuthenticated: false,
};

const AppContext = createContext(null);

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingIndex = state.cart.findIndex(
        item => item.pizza.id === action.payload.pizza.id && item.size === action.payload.size
      );
      
      if (existingIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity += action.payload.quantity;
        return { ...state, cart: updatedCart };
      }
      
      return { ...state, cart: [...state.cart, action.payload] };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((_, index) => index !== action.payload)
      };
    
    case 'UPDATE_CART_ITEM':
      const updatedCart = [...state.cart];
      updatedCart[action.payload.index] = action.payload.item;
      return { ...state, cart: updatedCart };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}