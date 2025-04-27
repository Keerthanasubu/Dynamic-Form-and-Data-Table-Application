
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { AuthState, User, LoginCredentials, demoUsers } from '@/types/authTypes';

interface AuthContextProps {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  hasPermission: (resource: 'records' | 'users' | 'settings', action: 'create' | 'read' | 'update' | 'delete') => boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('medicalRecordsUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        toast.success(`Welcome back, ${user.name}`);
      } catch (error) {
        localStorage.removeItem('medicalRecordsUser');
        setAuthState({
          ...initialState,
          isLoading: false
        });
      }
    } else {
      setAuthState({
        ...initialState,
        isLoading: false
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 600));

    const userEntry = demoUsers[credentials.username];
    
    if (userEntry && userEntry.password === credentials.password) {
      const user = userEntry.user;
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      localStorage.setItem('medicalRecordsUser', JSON.stringify(user));
      toast.success(`Welcome, ${user.name}`);
      return true;
    } else {
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Invalid credentials'
      });
      toast.error('Invalid username or password');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('medicalRecordsUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    toast.info('You have been logged out');
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (!authState.user) {
      throw new Error('No user logged in');
    }

    const updatedUser = {
      ...authState.user,
      ...updates,
    };

    localStorage.setItem('medicalRecordsUser', JSON.stringify(updatedUser));
    
    setAuthState({
      ...authState,
      user: updatedUser,
    });
  };

  const hasPermission = (resource: 'records' | 'users' | 'settings', action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }
    
    return authState.user.permissions[resource][action];
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, updateUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
