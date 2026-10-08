import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Star, 
  Film, 
  Users, 
  Globe,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import countriesData from '../data/countries.json';
import { generateCountryData } from '../utils/countryUtils';

const CountryDetailPage = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('destinations');

  const country = useMemo(() => {
    try {
      // First try to find in existing detailed countries
      let foundCountry = countriesData.countries.find(c => c.id === countryId);
      
      // If not found, generate country data dynamically
      if (!foundCountry) {
        foundCountry = generateCountryData(null, countryId);
      }
      
      return foundCountry;
    } catch (error) {
      console.error('Error loading country data:', error);
      return null;
    }
  }, [countryId]);

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Globe className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Country not found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested country could not be found.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'people', label: 'Famous People', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back Button & Logo */}
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </button>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Travel Explorer</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Discover the World</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user?.name}!
              </span>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-96 overflow-hidden"
      >
        <img
          src={country.monumentImage}
          alt={`${country.name} landmark`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold text-white mb-4">{country.name}</h1>
              <p className="text-xl text-white/90 max-w-3xl">{country.shortDescription}</p>
              
              <div className="flex items-center mt-6 space-x-6">
                <div className="flex items-center text-white/90">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="font-medium">{country.details.capital}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span className="font-medium">{country.details.currency}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <Globe className="h-5 w-5 mr-2" />
                  <span className="font-medium">{country.continent}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Destinations Tab */}
            {activeTab === 'destinations' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Key Travel Destinations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {country.details.keyDestinations.map((destination, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <Star className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {destination}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Movies Tab */}
            {activeTab === 'movies' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Popular Movies
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {country.details.popularMovies.map((movie, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <Film className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {movie}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Famous People Tab */}
            {activeTab === 'people' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Famous People
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {country.details.famousPersons.map((person, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <Users className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {person}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Facts Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Facts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <MapPin className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Capital</h4>
              <p className="text-gray-600 dark:text-gray-400">{country.details.capital}</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Currency</h4>
              <p className="text-gray-600 dark:text-gray-400">{country.details.currency}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Continent</h4>
              <p className="text-gray-600 dark:text-gray-400">{country.continent}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CountryDetailPage;
