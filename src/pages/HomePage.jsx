import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Globe, LogOut, Moon, Sun, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import countriesData from '../data/countries.json';
import Pagination from '../components/Pagination';
import { searchCountries } from '../utils/countryUtils';

const FALLBACK_COUNTRY_IMAGE = '/images/travel-fallback.png';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const isSearching = Boolean(searchTerm);
  
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const COUNTRIES_PER_PAGE = 10;
  const TOTAL_PAGES = 4; // Fixed 4 pages as requested

  // Get unique continents
  const continents = ['All', ...new Set(countriesData.countries.map(country => country.continent))];

  // Get paginated countries for homepage display
  const paginatedCountries = useMemo(() => {
    try {
      if (searchTerm) {
        // First, search in comprehensive UN countries list for ALL matching countries
        const allSearchResults = searchCountries(searchTerm) || [];
        
        // Apply continent filter to search results
        const filteredSearchResults = allSearchResults.filter(country => {
          if (!country || !country.name || !country.continent) return false;
          const matchesContinent = selectedContinent === 'All' || country.continent === selectedContinent;
          return matchesContinent;
        });

        // Convert all search results to display format
        const searchCountriesForDisplay = filteredSearchResults.map(country => {
          try {
            // Check if this country exists in detailed list
            const detailedCountry = countriesData.countries.find(c => c.id === country.id);
            
            if (detailedCountry) {
              // Use detailed country data if available
              return detailedCountry;
            } else {
              // Create display data for UN countries not in detailed list
              return {
                id: country.id || 'unknown',
                name: country.name || 'Unknown Country',
                continent: country.continent || 'Unknown',
                flagUrl: `https://flagcdn.com/w320/${getCountryCode(country.name || '')}.png`,
                monumentImage: getCountryImage(country.name || ''),
                shortDescription: `Discover the beauty and culture of ${country.name || 'this country'}, located in ${country.continent || 'the world'}.`,
                details: {
                  capital: country.capital || 'Unknown',
                  currency: "Local Currency",
                  keyDestinations: [
                    `${country.capital || 'Capital'} - Capital City`,
                    "Historic Sites - Cultural Heritage",
                    "Natural Wonders - Scenic Beauty",
                    "Local Markets - Traditional Culture",
                    "Museums - Art and History"
                  ],
                  popularMovies: [
                    "Local Cinema - Cultural Stories",
                    "International Films - Global Recognition",
                    "Documentaries - Natural Beauty",
                    "Travel Shows - Destination Features",
                    "Cultural Programs - Traditional Arts"
                  ],
                  famousPersons: [
                    "Historical Leaders - National Heroes",
                    "Artists - Cultural Icons",
                    "Writers - Literary Figures",
                    "Athletes - Sports Champions",
                    "Scientists - Innovation Leaders"
                  ]
                }
              };
            }
          } catch (mapError) {
            console.error('Error mapping country:', country, mapError);
            return null;
          }
        }).filter(Boolean); // Remove any null entries

        let filtered = searchCountriesForDisplay;

        // Sort countries with safety checks
        filtered.sort((a, b) => {
          try {
            if (sortBy === 'name-asc') {
              return (a.name || '').localeCompare(b.name || '');
            } else if (sortBy === 'name-desc') {
              return (b.name || '').localeCompare(a.name || '');
            } else if (sortBy === 'continent') {
              return (a.continent || '').localeCompare(b.continent || '');
            } else if (sortBy === 'capital') {
              return (a.details?.capital || '').localeCompare(b.details?.capital || '');
            }
            return 0;
          } catch (sortError) {
            console.error('Error sorting countries:', sortError);
            return 0;
          }
        });

        return filtered;
      } else {
        // Show paginated homepage countries
        const startIndex = (currentPage - 1) * COUNTRIES_PER_PAGE;
        const endIndex = startIndex + COUNTRIES_PER_PAGE;
        
        let allCountries = [...(countriesData.countries || [])];
        
        // Filter by continent with safety checks
        if (selectedContinent !== 'All') {
          allCountries = allCountries.filter(country => 
            country && country.continent === selectedContinent
          );
        }
        
        // Sort countries with safety checks
        allCountries.sort((a, b) => {
          try {
            if (sortBy === 'name-asc') {
              return (a.name || '').localeCompare(b.name || '');
            } else if (sortBy === 'name-desc') {
              return (b.name || '').localeCompare(a.name || '');
            } else if (sortBy === 'continent') {
              return (a.continent || '').localeCompare(b.continent || '');
            } else if (sortBy === 'capital') {
              return (a.details?.capital || '').localeCompare(b.details?.capital || '');
            }
            return 0;
          } catch (sortError) {
            console.error('Error sorting homepage countries:', sortError);
            return 0;
          }
        });
        
        return allCountries.slice(startIndex, endIndex);
      }
    } catch (error) {
      console.error('Error in paginatedCountries:', {
        error: error.message || error,
        stack: error.stack,
        searchTerm,
        selectedContinent,
        sortBy,
        currentPage
      });
      return []; // Return empty array on error to prevent white screen
    }
  }, [searchTerm, selectedContinent, sortBy, currentPage]);

  // Helper function to get country image
  const getCountryImage = (countryName) => {
    const imageMap = {
      // European Countries
      "Iceland": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
      "Ireland": "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&q=80",
      "Finland": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      "Denmark": "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80",
      "Belgium": "https://images.unsplash.com/photo-1559113202-c916b8e44373?w=800&q=80",
      "France": "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&q=80",
      "Italy": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
      
      // Asian Countries
      "China": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
      "Japan": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
      "India": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
      
      // American Countries
      "Chile": "https://images.unsplash.com/photo-1601224335112-e2fc528261ae?w=800&q=80",
      "Brazil": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
      "United States": "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80",
      
      // Additional Countries
      "Australia": "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
      "Egypt": "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80",
      "South Africa": "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&q=80"
    };
    
    // If we don't have a specific image, generate a search query for landmarks
    return imageMap[countryName] || FALLBACK_COUNTRY_IMAGE;
  };

  // Helper function to get country code for flags
  const getCountryCode = (countryName) => {
    const codes = {
      "Afghanistan": "af", "Albania": "al", "Algeria": "dz", "Andorra": "ad", "Angola": "ao",
      "Argentina": "ar", "Armenia": "am", "Australia": "au", "Austria": "at", "Azerbaijan": "az",
      "Bahamas": "bs", "Bahrain": "bh", "Bangladesh": "bd", "Barbados": "bb", "Belarus": "by",
      "Belgium": "be", "Belize": "bz", "Benin": "bj", "Bhutan": "bt", "Bolivia": "bo",
      "Brazil": "br", "Brunei": "bn", "Bulgaria": "bg", "Canada": "ca", "Chile": "cl",
      "China": "cn", "Colombia": "co", "France": "fr", "Germany": "de", "India": "in",
      "Italy": "it", "Spain": "es", "United Kingdom": "gb", "United States": "us",
      "Russia": "ru", "Greece": "gr", "Japan": "jp", "South Korea": "kr", "Thailand": "th",
      "Vietnam": "vn", "Singapore": "sg", "Malaysia": "my", "Indonesia": "id", "Philippines": "ph",
      "New Zealand": "nz", "Mexico": "mx", "Egypt": "eg", "South Africa": "za", "Nigeria": "ng",
      "Kenya": "ke", "Morocco": "ma", "Turkey": "tr", "Iran": "ir", "Iraq": "iq",
      "Israel": "il", "Jordan": "jo", "Lebanon": "lb", "Syria": "sy", "Saudi Arabia": "sa",
      "United Arab Emirates": "ae", "Qatar": "qa", "Kuwait": "kw", "Oman": "om", "Yemen": "ye",
      "Pakistan": "pk", "Nepal": "np", "Sri Lanka": "lk", "Myanmar": "mm",
      "Cambodia": "kh", "Laos": "la", "Mongolia": "mn", "Kazakhstan": "kz", "Uzbekistan": "uz",
      "Kyrgyzstan": "kg", "Tajikistan": "tj", "Turkmenistan": "tm", "Georgia": "ge",
      "Ukraine": "ua", "Moldova": "md", "Romania": "ro",
      "Serbia": "rs", "Montenegro": "me", "Bosnia and Herzegovina": "ba",
      "Croatia": "hr", "Slovenia": "si", "Slovakia": "sk", "Czech Republic": "cz", "Poland": "pl",
      "Hungary": "hu", "Lithuania": "lt", "Latvia": "lv", "Estonia": "ee", "Finland": "fi",
      "Sweden": "se", "Norway": "no", "Denmark": "dk", "Iceland": "is", "Ireland": "ie",
      "Netherlands": "nl", "Luxembourg": "lu", "Switzerland": "ch",
      "Portugal": "pt", "Malta": "mt", "Cyprus": "cy", "Monaco": "mc",
      "Vatican City": "va", "San Marino": "sm", "Liechtenstein": "li"
    };
    return codes[countryName] || "un";
  };

  const handleCountryClick = (countryId) => {
    navigate(`/country/${countryId}`);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Reset to first page when searching
    if (value) {
      setCurrentPage(1);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Travel Explorer</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Discover the World</p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user?.name}!
              </span>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 hover:from-blue-200 hover:to-purple-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-600" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-12 py-16"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-300/30 dark:bg-blue-800 rounded-full opacity-40 animate-pulse"></div>
            <div className="absolute top-32 right-16 w-16 h-16 bg-purple-300/30 dark:bg-purple-800 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-300/30 dark:bg-indigo-800 rounded-full opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-sky-300/20 dark:bg-sky-800 rounded-full opacity-30 animate-pulse" style={{animationDelay: '3s'}}></div>
          </div>
          
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Discover Amazing
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Destinations
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Embark on a journey around the world. Explore diverse cultures, iconic landmarks, 
              and hidden gems that make each destination truly unique and unforgettable.
            </motion.p>
            
            {/* Floating elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-center mt-8 space-x-4"
            >
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🌍 {countriesData.countries.length} Countries</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">✨ Curated Content</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search any UN-recognized country..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchTerm) {
                      try {
                        // First check if country exists in detailed list
                        const detailedCountry = countriesData.countries.find(country => 
                          country && country.name && country.name.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        
                        if (detailedCountry) {
                          navigate(`/country/${detailedCountry.id}`);
                          return;
                        }
                        
                        // Then check comprehensive UN countries list
                        const searchResults = searchCountries(searchTerm);
                        if (searchResults && searchResults.length > 0) {
                          const country = searchResults[0];
                          if (country && country.id) {
                            navigate(`/country/${country.id}`);
                          } else {
                            alert(`Country "${searchTerm}" data is incomplete. Please try a different search term.`);
                          }
                        } else {
                          alert(`Country "${searchTerm}" not found. Please try a different search term.`);
                        }
                      } catch (error) {
                        console.error('Error in search navigation:', error);
                        alert(`Error searching for "${searchTerm}". Please try again.`);
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Continent Filter */}
            <div className="lg:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                  value={selectedContinent}
                  onChange={(e) => setSelectedContinent(e.target.value)}
                >
                  {continents.map(continent => (
                    <option key={continent} value={continent}>
                      {continent}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="continent">By Continent</option>
                <option value="capital">By Capital</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isSearching ? (
                `Found ${paginatedCountries.length} countries matching "${searchTerm}"`
              ) : (
                `Showing ${COUNTRIES_PER_PAGE} countries (Page ${currentPage} of ${TOTAL_PAGES})`
              )}
            </div>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        </motion.div>

        {/* Countries Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {paginatedCountries && paginatedCountries.length > 0 && paginatedCountries.map((country, index) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card overflow-hidden cursor-pointer group"
              onClick={() => handleCountryClick(country.id)}
            >
              {/* Country Image */}
              <div
                className="relative h-48 overflow-hidden bg-cover bg-center bg-gray-100 dark:bg-gray-800"
                style={{ backgroundImage: `url(${FALLBACK_COUNTRY_IMAGE})` }}
              >
                <img
                  loading="lazy"
                  src={(country.id && {
                    'chile': 'https://images.unsplash.com/photo-1516735746393-747c366c5e7c?w=800&q=80',
                    'colombia': 'https://images.unsplash.com/photo-1519863654396-da816a8a5f68?w=800&q=80',
                    'egypt': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80',
                    'brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
                    'france': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
                    'italy': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'
                  }[country.id.toLowerCase()]) || country.monumentImage || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80&auto=format&fit=crop`}
                  onError={(event) => {
                    const image = event.currentTarget;
                    image.onerror = null;
                    image.src = FALLBACK_COUNTRY_IMAGE;
                  }}
                  alt={`${country.name || 'Country'} landmark`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 group-hover:opacity-0 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{country.name}</h3>
                  <div className="flex items-center text-white/90 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {country.continent}
                  </div>
                </div>
              </div>

              {/* Country Info */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {country.shortDescription || `Discover ${country.name}`}
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-full">
                    {country.details?.capital || 'Capital'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Click to explore →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination - only show when not searching */}
        {!isSearching && (
          <Pagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onPageChange={handlePageChange}
          />
        )}

        {/* No Results */}
        {paginatedCountries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Globe className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No countries found' : 'No countries available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? (
                <>Try searching for any UN-recognized country name</>
              ) : (
                <>Try adjusting your filters</>
              )}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  try {
                    const searchResults = searchCountries(searchTerm);
                    if (searchResults && searchResults.length > 0) {
                      const country = searchResults[0];
                      if (country && country.id) {
                        navigate(`/country/${country.id}`);
                      } else {
                        alert(`Country "${searchTerm}" data is incomplete. Please try a different search term.`);
                      }
                    } else {
                      alert(`Country "${searchTerm}" not found in our database. Please check the spelling or try a different country name.`);
                    }
                  } catch (error) {
                    console.error('Error in search all countries:', error);
                    alert(`Error searching for "${searchTerm}". Please try again.`);
                  }
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search all countries
              </button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
