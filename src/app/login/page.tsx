"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase mb-8 hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="bg-white border-2 border-dark p-8">
          <h1 className="text-3xl font-black tracking-tighter mb-2">
            {mode === "signin" ? "Welcome Back" : "Get Started"}
          </h1>
          <p className="text-gray mb-6">
            {mode === "signin"
              ? "Sign in to access your redesigns."
              : "Create an account and get 3 free redesigns."}
          </p>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2 font-bold text-sm uppercase ${
                mode === "signup" ? "bg-dark text-light" : "border-2 border-dark"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode("signin"); setError(""); }}
              className={`flex-1 py-2 font-bold text-sm uppercase ${
                mode === "signin" ? "bg-dark text-light" : "border-2 border-dark"
              }`}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-dark p-3 bg-transparent focus:border-primary outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border-2 border-dark p-3 bg-transparent focus:border-primary outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 p-3 text-red-600 text-sm font-bold flex items-center gap-2">
                <X size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-black text-sm uppercase tracking-wider py-4 hover:bg-secondary disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Loading...
                </span>
              ) : (
                mode === "signin" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
