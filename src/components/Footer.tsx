import React from 'react';
import { Pizza, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Pizza className="h-8 w-8 text-red-500" />
              <div>
                <span className="text-xl font-bold">Tony's</span>
                <span className="text-xl font-light text-red-500">Pizzeria</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500" />
                <span className="text-gray-400">(555) 123-PIZZA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500" />
                <span className="text-gray-400">order@tonyspizzeria.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-500" />
                <span className="text-gray-400">123 Pizza Street, City, ST 12345</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.hours')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-gray-400">{t('footer.hours.weekdays')}</div>
                  <div className="text-gray-400">{t('footer.hours.weekend')}</div>
                  <div className="text-gray-400">{t('footer.hours.sunday')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}