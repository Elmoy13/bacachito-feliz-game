import React, { createContext, useContext } from 'react';
import { type User } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface UserContextType {
  user: User | null;
  uid: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  uid: null,
  isAuthenticated: false,
  loading: true,
});

export const useUser = () => useContext(UserContext);

// Legacy context kept for backward compatibility.
// Auth state now lives in AuthContext (must be rendered inside AuthProvider).
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, uid, loading } = useAuth();

  const value: UserContextType = {
    user,
    uid,
    isAuthenticated: !!user,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
