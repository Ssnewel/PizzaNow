import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { PizzaCard } from '../components/PizzaCard';
import { useLanguage } from '../contexts/LanguageContext';

export function Menu() {
  const { t, translateProduct } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pizzas, setPizzas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pizzas from API
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await fetch('http://localhost/backend/api/pizzas.php');
        const data = await response.json();
        setPizzas(data);
      } catch (error) {
        console.error('Error fetching pizzas:', error);
        // Fallback to local data if API fails
        const { pizzas: localPizzas } = await import('../data/pizzas');
        setPizzas(localPizzas);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost/backend/api/pizzas.php?action=categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to local data if API fails
        const { categories: localCategories } = await import('../data/pizzas');
        setCategories(localCategories);
      }
    };

    fetchPizzas();
    fetchCategories();
  }, []);

  const filteredPizzas = pizzas.filter(pizza => {
    const translatedName = translateProduct(pizza, 'name');
    const translatedDescription = translateProduct(pizza, 'description');
    const translatedIngredients = translateProduct(pizza, 'ingredients');
    const translatedCategory = translateProduct(pizza, 'category');
    
    const matchesCategory = selectedCategory === 'all' || 
      translatedCategory.toLowerCase() === t(`category.${selectedCategory}`).toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      translatedName.toLowerCase().includes(searchLower) ||
      translatedDescription.toLowerCase().includes(searchLower) ||
      (Array.isArray(translatedIngredients) 
        ? translatedIngredients.some(ingredient => 
            ingredient.toLowerCase().includes(searchLower)
          )
        : translatedIngredients.toLowerCase().includes(searchLower)
      );
    
    return matchesCategory && matchesSearch;
  });

  const translatedCategories = categories.map(cat => ({
    ...cat,
    name: t(`category.${cat.id}`)
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('menu.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('menu.subtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t('menu.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="text-gray-400 h-5 w-5" />
              <div className="flex flex-wrap gap-2">
                {translatedCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {t('menu.showing')} {filteredPizzas.length} {filteredPizzas.length !== 1 ? t('menu.pizzas') : t('menu.pizza')}
            {searchTerm && ` ${t('menu.for')} "${searchTerm}"`}
            {selectedCategory !== 'all' && ` ${t('menu.in')} ${translatedCategories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Pizza Grid */}
        {filteredPizzas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('menu.noresults')}</h3>
            <p className="text-gray-600 mb-4">
              {t('menu.noresults.desc')}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              {t('menu.clear')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}