"use client";

import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      console.log("User signed out");
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      setError(err.message);
      console.log("Logout error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return { logout, error, loading };
};
