import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Checkout } from './pages/Checkout';

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<div className="p-8 text-center">About page coming soon!</div>} />
                <Route path="/contact" element={<div className="p-8 text-center">Contact page coming soon!</div>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;