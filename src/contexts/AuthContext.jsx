import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
const PASSWORD_ITERATIONS = 210000;

const bytesToBase64 = (bytes) => btoa(String.fromCharCode(...bytes));

const base64ToBytes = (value) =>
  Uint8Array.from(atob(value), character => character.charCodeAt(0));

const createPasswordDigest = async (password, salt) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const digest = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: base64ToBytes(salt),
      iterations: PASSWORD_ITERATIONS,
    },
    keyMaterial,
    256
  );

  return bytesToBase64(new Uint8Array(digest));
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('travel-explorer-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Unable to restore the saved user session:', error);
      localStorage.removeItem('travel-explorer-user');
      return null;
    }
  });
  const loading = false;

  const register = async (userData) => {
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('travel-explorer-users') || '[]');
    
    // Check if user already exists
    const userExists = existingUsers.find(u => u.email === userData.email);
    if (userExists) {
      throw new Error('User already exists with this email');
    }

    // Add new user
    const salt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
    const passwordDigest = await createPasswordDigest(userData.password, salt);
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      passwordDigest,
      passwordSalt: salt,
      createdAt: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('travel-explorer-users', JSON.stringify(existingUsers));
    
    return { success: true, message: 'Registration successful!' };
  };

  const login = async (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('travel-explorer-users') || '[]');
    const user = existingUsers.find(u => u.email === email);
    let passwordMatches = false;

    if (user?.passwordDigest && user?.passwordSalt) {
      const candidateDigest = await createPasswordDigest(password, user.passwordSalt);
      passwordMatches = candidateDigest === user.passwordDigest;
    } else if (user?.password) {
      // Migrate accounts created by older versions away from plaintext storage.
      passwordMatches = user.password === password;
      if (passwordMatches) {
        user.passwordSalt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
        user.passwordDigest = await createPasswordDigest(password, user.passwordSalt);
        delete user.password;
        localStorage.setItem('travel-explorer-users', JSON.stringify(existingUsers));
      }
    }
    
    if (!user || !passwordMatches) {
      throw new Error('Invalid email or password');
    }

    // Save user session
    const userSession = { ...user };
    delete userSession.password;
    delete userSession.passwordDigest;
    delete userSession.passwordSalt;
    
    localStorage.setItem('travel-explorer-user', JSON.stringify(userSession));
    setUser(userSession);
    
    return { success: true, user: userSession };
  };

  const logout = () => {
    localStorage.removeItem('travel-explorer-user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
