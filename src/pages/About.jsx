import React from 'react';
import { Award, Heart, Users, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Award,
      title: t('about.values.quality'),
      description: t('about.values.quality.desc')
    },
    {
      icon: Heart,
      title: t('about.values.tradition'),
      description: t('about.values.tradition.desc')
    },
    {
      icon: Users,
      title: t('about.values.community'),
      description: t('about.values.community.desc')
    },
    {
      icon: Lightbulb,
      title: t('about.values.innovation'),
      description: t('about.values.innovation.desc')
    }
  ];

  const team = [
    {
      name: t('about.team.marco.name'),
      title: t('about.team.marco.title'),
      description: t('about.team.marco.desc'),
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
    },
    {
      name: t('about.team.sofia.name'),
      title: t('about.team.sofia.title'),
      description: t('about.team.sofia.desc'),
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
    },
    {
      name: t('about.team.luigi.name'),
      title: t('about.team.luigi.title'),
      description: t('about.team.luigi.desc'),
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 font-medium">
              {t('about.hero.subtitle')}
            </p>
            <p className="text-lg text-amber-50 max-w-3xl mx-auto leading-relaxed">
              {t('about.hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.story.title')}</h2>
          </div>
          
          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
            <p className="mb-6 text-lg">
              {t('about.story.p1')}
            </p>
            <p className="mb-6 text-lg">
              {t('about.story.p2')}
            </p>
            <p className="text-lg">
              {t('about.story.p3')}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.values.title')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.team.title')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-3">{member.title}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Image Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Authentic Italian Heritage</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Every pizza we create is a testament to the rich culinary traditions of Italy. From our wood-fired ovens imported directly from Naples to our carefully sourced San Marzano tomatoes, we ensure authenticity in every bite.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our commitment to tradition doesn't mean we're stuck in the past. We continuously innovate our processes and expand our menu while maintaining the core values that have made us a beloved part of this community for nearly four decades.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4394612/pexels-photo-4394612.jpeg"
                alt="Wood-fired pizza oven"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}