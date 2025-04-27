import React, { useState, useEffect, createContext, useContext } from 'react';

// Define type for context value
interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

// Create AuthContext
const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => {}, // Empty function that will be overwritten by provider
});

// Create Provider component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLoginState = localStorage.getItem('isLoggedIn');
            if (storedLoginState) {
                setIsLoggedIn(storedLoginState === 'true');
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined'){
            localStorage.setItem('isLoggedIn', String(isLoggedIn));
       }
    }, [isLoggedIn])

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use the context
const useAuth = () => {
    const context = useContext(AuthContext); // Retrieves value of AuthContext
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
  
  export { AuthContext, AuthProvider, useAuth };