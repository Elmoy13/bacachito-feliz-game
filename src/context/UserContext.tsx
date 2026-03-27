import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInAnonymously, onAuthStateChanged, type User } from '@/lib/firebase';

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

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
      } else {
        // Sign in anonymously
        try {
          await signInAnonymously(auth);
          // onAuthStateChanged will fire again with the new user
        } catch (error) {
          console.error('Anonymous auth error:', error);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const value: UserContextType = {
    user,
    uid: user?.uid || null,
    isAuthenticated: !!user,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
