import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, SkinAnalysisResult, JournalEntry, TrackedWeeklySkincareRoutine } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateSkinProfile: (analysis: SkinAnalysisResult) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateTrackedRoutine: (routine: TrackedWeeklySkincareRoutine | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ecoskin_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('ecoskin_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (name: string, email: string) => {
    const userData = { name, email, skinJournal: [] };
    localStorage.setItem('ecoskin_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ecoskin_user');
    setUser(null);
  };
  
  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('ecoskin_user', JSON.stringify(newUser));
    }
  };

  const updateSkinProfile = (analysis: SkinAnalysisResult) => {
    if (user) {
        updateUser({ skinProfile: analysis });
    }
  };
  
  const addJournalEntry = (entry: JournalEntry) => {
    if (user) {
        const updatedJournal = [entry, ...(user.skinJournal || [])];
        updateUser({ skinJournal: updatedJournal });
    }
  };
  
  const updateTrackedRoutine = (routine: TrackedWeeklySkincareRoutine | null) => {
    if (user) {
        updateUser({ trackedRoutine: routine });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUser, updateSkinProfile, addJournalEntry, updateTrackedRoutine }}>
      {children}
    </AuthContext.Provider>
  );
};