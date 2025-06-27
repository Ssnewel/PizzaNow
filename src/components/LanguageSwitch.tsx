import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-red-600 transition-colors duration-200">
        <Globe className="h-5 w-5" />
        <span className="text-sm font-medium">
          {languages.find(l => l.code === language)?.flag}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 ${
              language === lang.code ? 'text-red-600 bg-red-50' : 'text-gray-700'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}