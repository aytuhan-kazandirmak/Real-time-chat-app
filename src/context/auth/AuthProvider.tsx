import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [session, setSession] = useState<Session | null>(null);

  async function signUpNewUser(
    fullName: string,
    email: string,
    password: string
  ) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName: fullName,
        },
      },
    });
    if (error) {
      console.log("error:", error);
      return { success: false, error };
    }
    return { success: true };
  }
  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log("error:", error);
      return {
        success: false,
        error,
      };
    }
    return { success: true };
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    }
    setSession(null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        signUpNewUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
