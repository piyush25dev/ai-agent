"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
  getRedirectResult,
} from "firebase/auth";

import { auth } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Handle the result when Google redirects back to the app.
    getRedirectResult(auth).catch((error) => {
      console.error("Google redirect error:", error);
    });

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!active) return;

        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Firebase auth state error:", error);

        if (active) {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}