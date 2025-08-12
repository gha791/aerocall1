
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  type User as FirebaseUser,
  type Auth,
  type UserCredential,
} from 'firebase/auth';
import { auth as firebaseAuth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { SignupFormData } from '@/app/signup/page';
import type { User as AppUser } from '@/types';

type AuthUser = FirebaseUser & AppUser;

interface AuthContextType {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (data: SignupFormData) => Promise<UserCredential>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const authInstance: Auth = firebaseAuth;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
        if (firebaseUser) {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const appUser = userDoc.data() as AppUser;
                setUser({ ...firebaseUser, ...appUser });
            } else {
                setUser(firebaseUser as AuthUser);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [authInstance]);
  
  // Attach bearer token to all fetch requests
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const token = await authInstance.currentUser?.getIdToken();

      const newConfig = {
        ...config,
        headers: {
          ...config?.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };
      
      return originalFetch(resource, newConfig);
    };
    return () => {
      window.fetch = originalFetch;
    }
  }, [authInstance.currentUser])


  const login = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(authInstance, email, password)
      .finally(() => setLoading(false));
  };

  const signup = async (data: SignupFormData): Promise<UserCredential> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(authInstance, data.email, data.password);
      const user = userCredential.user;
      const userName = `${data.firstName} ${data.lastName}`.trim();

      await updateProfile(user, { displayName: userName });
      
      const { password, ...profileData } = data;
      
      await setDoc(doc(db, "users", user.uid), {
        ...profileData,
        uid: user.uid,
        email: user.email,
        name: userName,
        role: 'Admin', // First user of a team is Admin
        teamId: user.uid, // Admin's own UID is their teamId
        createdAt: new Date().toISOString(),
      });

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const appUser = userDoc.data() as AppUser;
        setUser({ ...user, ...appUser });
      }

      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    return signOut(authInstance);
  };
  
  const sendPasswordReset = (email: string) => {
    return sendPasswordResetEmail(authInstance, email);
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    signup,
    logout,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
