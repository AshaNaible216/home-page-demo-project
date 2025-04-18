import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  user: {
    id: string;
    isAnonymous: boolean;
  } | null;
  isAuthenticated: boolean;
  createAnonymousUser: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  createAnonymousUser: () => {},
  login: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; isAnonymous: boolean } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('naible_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    } else {
      // Create anonymous user by default
      createAnonymousUser();
    }
  }, []);

  const createAnonymousUser = () => {
    const anonymousUser = {
      id: uuidv4(),
      isAnonymous: true,
    };
    setUser(anonymousUser);
    setIsAuthenticated(true);
    localStorage.setItem('naible_user', JSON.stringify(anonymousUser));
  };

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For the prototype, we'll just create a non-anonymous user
    const authenticatedUser = {
      id: uuidv4(),
      isAnonymous: false,
    };
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('naible_user', JSON.stringify(authenticatedUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('naible_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        createAnonymousUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
