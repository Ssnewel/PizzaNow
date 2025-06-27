import React, { useState } from 'react';
import { ShoppingCart, Leaf, Wheat } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

export function PizzaCard({ pizza }) {
  const { dispatch } = useApp();
  const { t, translateProduct } = useLanguage();
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        pizza,
        size: selectedSize,
        quantity,
      }
    });

    // Reset form
    setQuantity(1);
    setSelectedSize('medium');
  };

  // Get translated product data
  const translatedName = translateProduct(pizza, 'name');
  const translatedDescription = translateProduct(pizza, 'description');
  const translatedCategory = translateProduct(pizza, 'category');
  const translatedIngredients = translateProduct(pizza, 'ingredients');

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={pizza.image}
          alt={translatedName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          {pizza.isVegetarian && (
            <span className="bg-green-500 text-white p-1 rounded-full">
              <Leaf className="h-4 w-4" />
            </span>
          )}
          {pizza.isGlutenFree && (
            <span className="bg-amber-500 text-white p-1 rounded-full">
              <Wheat className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{translatedName}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{translatedDescription}</p>
        
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">{t('pizza.ingredients')}</p>
          <p className="text-sm text-gray-700">
            {Array.isArray(translatedIngredients) 
              ? translatedIngredients.join(', ') 
              : translatedIngredients
            }
          </p>
        </div>

        <div className="space-y-4">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('pizza.size')}</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(pizza.prices).map(([size, price]) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`p-2 text-center rounded-lg border transition-colors duration-200 ${
                    selectedSize === size
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  <div className="text-xs font-medium capitalize">{t(`pizza.${size}`)}</div>
                  <div className="text-sm font-bold">{price} {t('currency')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">{t('pizza.qty')}</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{t('pizza.addtocart')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}