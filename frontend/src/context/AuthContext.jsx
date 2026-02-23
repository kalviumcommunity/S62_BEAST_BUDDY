/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/client";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          setLoading(true);
          setError(null);
          const response = await apiClient.get("/auth/me");
          setUser(response.data.data);
        } catch (err) {
          console.error("Auth initialization failed:", err);
          // Token is invalid or expired
          localStorage.removeItem("token");
          setUser(null);
          setError("Session expired. Please log in again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post("/auth/signup", {
        name,
        email,
        password,
      });

      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  const refetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await apiClient.get("/auth/me");
      setUser(response.data.data);
      return response.data.data;
    } catch (err) {
      console.error("Failed to refetch user:", err);
      if (err.response?.status === 401) {
        logout();
      }
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.put("/auth/update-profile", updates);
      setUser(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Update failed. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    try {
      const response = await apiClient.get("/auth/quiz-history");
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch quiz history:", err);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refetchUser,
    updateProfile,
    fetchQuizHistory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
