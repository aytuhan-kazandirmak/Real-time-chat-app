import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [session, setSession] = useState<Session | null>(null);

  const signUpNewUser = useCallback(
    async (fullName: string, email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) {
        console.log("error:", error);
        return { success: false, error };
      }
      return { success: true };
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
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
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    }
    setSession(null);
  }, []);

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

  const values = useMemo(
    () => ({
      session,
      signUpNewUser,
      login,
      logout,
    }),
    [session, signUpNewUser, login, logout]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
