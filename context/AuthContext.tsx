import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  // FIX: The login function's return type was 'void', but the implementation returns a boolean to indicate success. This was changed to 'boolean' to fix the type error in LoginPage.
  login: (user: User) => boolean;
  logout: () => void;
  register: (user: User) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = (credentials: User) => {
     const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
     const foundUser = storedUsers.find(u => u.email === credentials.email && u.password === credentials.password);
     if (foundUser) {
        const { password, ...userToStore } = foundUser;
        setUser(userToStore);
        return true;
     }
     return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (newUser: User) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    if (storedUsers.some(u => u.email === newUser.email)) {
        return false; // User already exists
    }
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    const { password, ...userToStore } = newUser;
    setUser(userToStore);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
