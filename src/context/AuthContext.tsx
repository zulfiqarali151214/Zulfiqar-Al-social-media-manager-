import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
  getFriendlyAuthErrorMessage,
} from '../services/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // onAuthStateChanged automatically restores session or notifies null
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      return { success: true };
    } catch (err: any) {
      console.error('Email sign in error:', err);
      const friendly = getFriendlyAuthErrorMessage(err?.code || '');
      return { success: false, error: friendly };
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName && userCredential.user) {
        try {
          await updateProfile(userCredential.user, { displayName });
        } catch (e) {
          // non-critical
        }
      }
      return { success: true };
    } catch (err: any) {
      console.error('Sign up error:', err);
      const friendly = getFriendlyAuthErrorMessage(err?.code || '');
      return { success: false, error: friendly };
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (err: any) {
      console.error('Google sign in error:', err);
      const friendly = getFriendlyAuthErrorMessage(err?.code || '');
      return { success: false, error: friendly };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (err: any) {
      console.error('Password reset error:', err);
      const friendly = getFriendlyAuthErrorMessage(err?.code || '');
      return { success: false, error: friendly };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
