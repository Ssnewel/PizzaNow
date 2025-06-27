import { useState, useEffect } from 'react';
import { pizzaApi } from '../utils/api';

// Custom hook for fetching pizzas with translation support
export function usePizzas() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPizzas = async () => {
      setLoading(true);
      setError(null);
      
      const result = await pizzaApi.getPizzas();
      
      if (result.success && result.data) {
        setPizzas(result.data);
      } else {
        setError(result.message || 'Failed to fetch pizzas');
        // Fallback to local data
        try {
          const { pizzas: localPizzas } = await import('../data/pizzas');
          setPizzas(localPizzas);
        } catch (fallbackError) {
          console.error('Failed to load fallback data:', fallbackError);
        }
      }
      
      setLoading(false);
    };

    fetchPizzas();
  }, []);

  return { pizzas, loading, error, refetch: fetchPizzas };
}

// Custom hook for fetching categories
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      const result = await pizzaApi.getCategories();
      
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setError(result.message || 'Failed to fetch categories');
        // Fallback to local data
        try {
          const { categories: localCategories } = await import('../data/pizzas');
          setCategories(localCategories);
        } catch (fallbackError) {
          console.error('Failed to load fallback data:', fallbackError);
        }
      }
      
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
}