import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login logic
        await login(formData.email, formData.password);
      } else {
        // Registration logic
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        setSuccess('Registered Successfully! Now you can login using these credentials.');
        setIsLogin(true);
        setFormData({
          name: '',
          email: formData.email,
          password: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  // Monument images for sliding background
  const monuments = [
    'https://images.unsplash.com/photo-1549144511-f099e773c147?w=1200&h=800&fit=crop', // Eiffel Tower
    'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&h=800&fit=crop', // Colosseum
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=800&fit=crop', // Sagrada Familia
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&h=800&fit=crop', // Brandenburg Gate
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=800&fit=crop', // Big Ben
    'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&h=800&fit=crop', // Parthenon
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200&h=800&fit=crop', // Statue of Liberty
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop', // Taj Mahal
  ];

  const [currentMonument, setCurrentMonument] = useState(0);

  // Auto-slide monuments
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMonument((prev) => (prev + 1) % monuments.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [monuments.length]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Sliding Monument Background */}
      <div className="absolute inset-0">
        {monuments.map((monument, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentMonument ? 'opacity-30 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <img
              src={monument}
              alt={`Monument ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
          </div>
        ))}
      </div>
      
      {/* Animated overlay patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-purple-400/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-indigo-400/10 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 z-50"
      >
        {isDark ? (
          <Sun className="h-6 w-6 text-yellow-500" />
        ) : (
          <Moon className="h-6 w-6 text-indigo-600" />
        )}
      </button>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Explore
            </span>
            <br />
            <span className="text-white">The World</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Discover amazing destinations, learn about diverse cultures, and plan your next adventure with our comprehensive travel guide.
          </p>
          
          {/* Monument indicator */}
          <div className="flex space-x-2 mb-8">
            {monuments.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMonument ? 'bg-blue-400 w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Live Monument Showcase
            </div>
            <div>•</div>
            <div>{monuments.length} Destinations</div>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 relative z-10">
        <div className="max-w-md w-full space-y-6">
          {/* Mobile logo - only show on small screens */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 lg:hidden"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl shadow-2xl">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Travel Explorer
            </h2>
            <p className="text-gray-300 text-sm">
              {isLogin ? 'Welcome back!' : 'Join the adventure'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-t-3xl"></div>
            
            {/* Form header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-gray-600 text-sm">
                {isLogin ? 'Sign in to continue your journey' : 'Start exploring the world today'}
              </p>
            </div>
          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  className="input-field"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={!isLogin}
                  className="input-field"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Demo mode: account data stays in this browser and is not synced to a server.
            </p>
          </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
