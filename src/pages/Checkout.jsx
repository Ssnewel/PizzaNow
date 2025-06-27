import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, User, MapPin, ShoppingBag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

export function Checkout() {
  const { state, dispatch } = useApp();
  const { t, translateProduct } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    // Contact Info
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    
    // Delivery Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Payment
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    
    // Special Instructions
    specialInstructions: '',
  });

  const subtotal = state.cart.reduce((total, item) => 
    total + (item.pizza.prices[item.size] * item.quantity), 0
  );
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = subtotal > 500 ? 0 : 79; // Free delivery over 500 MDL
  const total = subtotal + tax + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Prepare order data for API
    const orderData = {
      userId: state.user?.id || null,
      items: state.cart.map(item => ({
        pizza: item.pizza,
        size: item.size,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || ''
      })),
      subtotal,
      tax,
      deliveryFee,
      total,
      contactInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      deliveryAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      specialInstructions: formData.specialInstructions,
      paymentMethod: formData.paymentMethod
    };

    try {
      const response = await fetch('http://localhost/backend/api/orders.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Clear cart and redirect to success page
        dispatch({ type: 'CLEAR_CART' });
        navigate('/order-success', { 
          state: { 
            orderNumber: result.orderNumber,
            estimatedDelivery: result.estimatedDelivery 
          }
        });
      } else {
        alert('Order failed: ' + result.message);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, name: t('checkout.contact'), icon: User },
    { id: 2, name: t('checkout.delivery'), icon: MapPin },
    { id: 3, name: t('checkout.payment'), icon: CreditCard },
    { id: 4, name: t('checkout.review'), icon: ShoppingBag },
  ];

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h2>
            <p className="text-lg text-gray-600 mb-8">{t('cart.empty.desc')}</p>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-red-600 hover:text-red-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t('checkout.title')}</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              {currentStep >= 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-red-600" />
                    {t('checkout.contact')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.firstname')}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.lastname')}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                  {currentStep === 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Continue
                    </button>
                  )}
                </div>
              )}

              {/* Delivery Address */}
              {currentStep >= 2 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-red-600" />
                    {t('checkout.delivery')}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkout.street')}
                      </label>
                      <input
                        type="text"
                        name="street"
                        required
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.city')}
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.state')}
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('checkout.zip')}
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          required
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                  {currentStep === 2 && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Method */}
              {currentStep >= 3 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-red-600" />
                    {t('checkout.payment')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {t('checkout.card')}
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {t('checkout.cash')}
                        </span>
                      </label>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('checkout.cardnumber')}
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            required={formData.paymentMethod === 'card'}
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('checkout.expiry')}
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              required={formData.paymentMethod === 'card'}
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('checkout.cvv')}
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              required={formData.paymentMethod === 'card'}
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('checkout.cardholder')}
                            </label>
                            <input
                              type="text"
                              name="cardholderName"
                              required={formData.paymentMethod === 'card'}
                              value={formData.cardholderName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {currentStep === 3 && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Special Instructions */}
              {currentStep >= 4 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('checkout.instructions')}
                  </h2>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder={t('checkout.instructions.placeholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  
                  <div className="mt-6 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="bg-red-600 text-white px-8 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? t('checkout.processing') : t('checkout.placeorder')}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('cart.summary')}</h2>
              
              <div className="space-y-3 mb-4">
                {state.cart.map((item, index) => {
                  const translatedName = translateProduct(item.pizza, 'name');
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {translatedName} ({t(`pizza.${item.size}`)}) x{item.quantity}
                      </span>
                      <span className="font-medium">
                        {(item.pizza.prices[item.size] * item.quantity).toFixed(2)} {t('currency')}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t pt-4 space-y-3 mb-4">
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
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">{t('cart.total')}</span>
                  <span className="text-lg font-bold text-red-600">
                    {total.toFixed(2)} {t('currency')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}