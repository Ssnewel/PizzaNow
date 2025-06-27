import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

export function Cart() {
  const { state, dispatch } = useApp();
  const { t, translateProduct } = useLanguage();

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: index });
    } else {
      const updatedItem = { ...state.cart[index], quantity: newQuantity };
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { index, item: updatedItem } });
    }
  };

  const removeItem = (index: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const subtotal = state.cart.reduce((total, item) => 
    total + (item.pizza.prices[item.size] * item.quantity), 0
  );
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = subtotal > 500 ? 0 : 79; // Free delivery over 500 MDL
  const total = subtotal + tax + deliveryFee;

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('cart.empty.desc')}
            </p>
            <Link
              to="/menu"
              className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              {t('cart.browse')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('cart.items')}</h2>
                <div className="space-y-4">
                  {state.cart.map((item, index) => {
                    const translatedName = translateProduct(item.pizza, 'name');
                    
                    return (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.pizza.image}
                          alt={translatedName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{translatedName}</h3>
                          <p className="text-sm text-gray-600">{t('cart.size')} {t(`pizza.${item.size}`)}</p>
                          <p className="text-sm text-gray-600">{item.pizza.prices[item.size]} {t('currency')} {t('cart.each')}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {(item.pizza.prices[item.size] * item.quantity).toFixed(2)} {t('currency')}
                          </p>
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700 mt-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('cart.summary')}</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('cart.subtotal')}</span>
                  <span className="font-medium">{subtotal.toFixed(2)} {t('currency')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('cart.tax')}</span>
                  <span className="font-medium">{tax.toFixed(2)} {t('currency')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('cart.delivery')}</span>
                  <span className="font-medium">
                    {deliveryFee > 0 ? `${deliveryFee.toFixed(2)} ${t('currency')}` : t('cart.free')}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-500">{t('cart.freedelivery')}</p>
                )}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">{t('cart.total')}</span>
                  <span className="text-lg font-bold text-red-600">{total.toFixed(2)} {t('currency')}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-red-700 transition-colors duration-200 block"
              >
                {t('cart.checkout')}
              </Link>

              <Link
                to="/menu"
                className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors duration-200 block"
              >
                {t('cart.continue')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}