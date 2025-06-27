import { Pizza } from '../types';

export const pizzas: Pizza[] = [
  {
    id: 1,
    name: "Margherita Classic",
    description: "Fresh mozzarella, San Marzano tomatoes, fresh basil, extra virgin olive oil",
    image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg",
    category: "Classic",
    prices: { small: 259, medium: 339, large: 419 }, // Converted to MDL
    ingredients: ["Mozzarella", "San Marzano Tomatoes", "Fresh Basil", "Olive Oil"],
    isVegetarian: true
  },
  {
    id: 2,
    name: "Pepperoni Supreme",
    description: "Premium pepperoni, mozzarella cheese, tangy tomato sauce",
    image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg",
    category: "Classic",
    prices: { small: 299, medium: 379, large: 459 },
    ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce"]
  },
  {
    id: 3,
    name: "Quattro Stagioni",
    description: "Four seasons pizza with mushrooms, artichokes, ham, and olives",
    image: "https://images.pexels.com/photos/3915857/pexels-photo-3915857.jpeg",
    category: "Gourmet",
    prices: { small: 359, medium: 459, large: 539 },
    ingredients: ["Mushrooms", "Artichokes", "Ham", "Olives", "Mozzarella"]
  },
  {
    id: 4,
    name: "Prosciutto & Arugula",
    description: "Thinly sliced prosciutto, fresh arugula, cherry tomatoes, parmesan",
    image: "https://images.pexels.com/photos/4394612/pexels-photo-4394612.jpeg",
    category: "Gourmet",
    prices: { small: 399, medium: 499, large: 579 },
    ingredients: ["Prosciutto", "Arugula", "Cherry Tomatoes", "Parmesan"]
  },
  {
    id: 5,
    name: "Vegetarian Garden",
    description: "Bell peppers, mushrooms, red onions, black olives, fresh tomatoes",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    category: "Vegetarian",
    prices: { small: 319, medium: 399, large: 479 },
    ingredients: ["Bell Peppers", "Mushrooms", "Red Onions", "Black Olives", "Tomatoes"],
    isVegetarian: true
  },
  {
    id: 6,
    name: "BBQ Chicken Ranch",
    description: "Grilled chicken, BBQ sauce, red onions, cilantro, ranch drizzle",
    image: "https://images.pexels.com/photos/2909822/pexels-photo-2909822.jpeg",
    category: "Specialty",
    prices: { small: 339, medium: 439, large: 519 },
    ingredients: ["Grilled Chicken", "BBQ Sauce", "Red Onions", "Cilantro", "Ranch"]
  },
  {
    id: 7,
    name: "Mediterranean Delight",
    description: "Feta cheese, kalamata olives, sun-dried tomatoes, spinach, olive oil",
    image: "https://images.pexels.com/photos/2909822/pexels-photo-2909822.jpeg",
    category: "Vegetarian",
    prices: { small: 359, medium: 459, large: 539 },
    ingredients: ["Feta Cheese", "Kalamata Olives", "Sun-dried Tomatoes", "Spinach"],
    isVegetarian: true
  },
  {
    id: 8,
    name: "Meat Lovers",
    description: "Pepperoni, Italian sausage, bacon, ham, mozzarella cheese",
    image: "https://images.pexels.com/photos/3682837/pexels-photo-3682837.jpeg",
    category: "Specialty",
    prices: { small: 379, medium: 479, large: 559 },
    ingredients: ["Pepperoni", "Italian Sausage", "Bacon", "Ham", "Mozzarella"]
  }
];

export const categories = [
  { id: 'all', name: 'All Pizzas', count: pizzas.length },
  { id: 'classic', name: 'Classic', count: pizzas.filter(p => p.category === 'Classic').length },
  { id: 'gourmet', name: 'Gourmet', count: pizzas.filter(p => p.category === 'Gourmet').length },
  { id: 'vegetarian', name: 'Vegetarian', count: pizzas.filter(p => p.category === 'Vegetarian').length },
  { id: 'specialty', name: 'Specialty', count: pizzas.filter(p => p.category === 'Specialty').length },
];