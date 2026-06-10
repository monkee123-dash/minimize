"use client";

import { useEffect, useState } from "react";
import { supabase, type UserProfile } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser(profile);
      }
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setUser(profile);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });
    if (!error && data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        credits: 3,
        plan: "free",
      });
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const useCredit = async () => {
    if (!user || user.credits <= 0) return false;
    const { error } = await supabase
      .from("profiles")
      .update({ credits: user.credits - 1 })
      .eq("id", user.id);
    if (!error) {
      setUser({ ...user, credits: user.credits - 1 });
      return true;
    }
    return false;
  };

  return { user, loading, signIn, signUp, signOut, useCredit };
}
