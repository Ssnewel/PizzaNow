import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pizza, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';

export function Header() {
  const { state } = useApp();
  const { t } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const navigation = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.menu'), path: '/menu' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Pizza className="h-8 w-8 text-red-600" />
            <div>
              <span className="text-xl font-bold text-gray-900">Tony's</span>
              <span className="text-xl font-light text-red-600">Pizzeria</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Switch */}
            <LanguageSwitch />

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {state.isAuthenticated ? (
              <Link
                to="/profile"
                className="p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
                <User className="h-6 w-6" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                {t('nav.signin')}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-red-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium py-2 px-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}