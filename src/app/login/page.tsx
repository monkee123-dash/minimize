"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, X, Phone, Mail, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const { signIn, signUp, signInWithPhone, verifyPhoneOTP, resetPassword } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "phone" | "phoneVerify" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      setError(error.message);
    } else {
      if (mode === "signup") {
        setSuccess("Account created! Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        router.push("/dashboard");
      }
    }
    setLoading(false);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await signInWithPhone(phone);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("OTP sent! Check your phone.");
      setMode("phoneVerify");
    }
    setLoading(false);
  };

  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await verifyPhoneOTP(phone, otp);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset link sent! Check your email.");
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
            {mode === "signin" && "Welcome Back"}
            {mode === "signup" && "Get Started"}
            {mode === "phone" && "Phone Sign In"}
            {mode === "phoneVerify" && "Verify OTP"}
            {mode === "forgot" && "Reset Password"}
          </h1>
          <p className="text-gray mb-6">
            {mode === "signin" && "Sign in to access your redesigns."}
            {mode === "signup" && "Create an account and get 5 free redesigns."}
            {mode === "phone" && "Enter your phone number to receive a code."}
            {mode === "phoneVerify" && "Enter the code sent to your phone."}
            {mode === "forgot" && "We'll send you a link to reset your password."}
          </p>

          {/* Mode Switcher */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 font-bold text-sm uppercase ${mode === "signup" ? "bg-dark text-light" : "border-2 border-dark"}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 font-bold text-sm uppercase ${mode === "signin" ? "bg-dark text-light" : "border-2 border-dark"}`}
            >
              Sign In
            </button>
          </div>

          {/* Alternative Auth Methods */}
          {(mode === "signin" || mode === "signup") && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setMode("phone"); setError(""); setSuccess(""); }}
                className="flex-1 py-2 border-2 border-dark font-bold text-sm uppercase flex items-center justify-center gap-2 hover:bg-dark hover:text-light transition-colors"
              >
                <Phone size={16} /> Phone
              </button>
            </div>
          )}

          {/* Email Auth Form */}
          {(mode === "signin" || mode === "signup") && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
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

              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
                  className="text-sm text-primary font-bold hover:underline"
                >
                  Forgot password?
                </button>
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-200 p-3 text-red-600 text-sm font-bold flex items-center gap-2">
                  <X size={16} /> {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 p-3 text-green-600 text-sm font-bold">
                  {success}
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
          )}

          {/* Phone Sign In Form */}
          {mode === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+1234567890"
                  className="w-full border-2 border-dark p-3 bg-transparent focus:border-primary outline-none transition-colors"
                />
                <p className="text-xs text-gray mt-1">Include country code (e.g., +1 for US)</p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 p-3 text-red-600 text-sm font-bold flex items-center gap-2">
                  <X size={16} /> {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 p-3 text-green-600 text-sm font-bold">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-black text-sm uppercase tracking-wider py-4 hover:bg-secondary disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </span>
                ) : (
                  "Send Code"
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode("signin")}
                className="w-full border-2 border-dark font-bold text-sm uppercase py-3 hover:bg-dark hover:text-light transition-all"
              >
                Back to Email
              </button>
            </form>
          )}

          {/* Phone OTP Verification */}
          {mode === "phoneVerify" && (
            <form onSubmit={handlePhoneVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2">Enter Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  placeholder="123456"
                  className="w-full border-2 border-dark p-3 bg-transparent focus:border-primary outline-none transition-colors text-center text-2xl tracking-widest"
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
                    <Loader2 size={16} className="animate-spin" /> Verifying...
                  </span>
                ) : (
                  "Verify & Sign In"
                )}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
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

              {error && (
                <div className="bg-red-50 border-2 border-red-200 p-3 text-red-600 text-sm font-bold flex items-center gap-2">
                  <X size={16} /> {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 p-3 text-green-600 text-sm font-bold">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-black text-sm uppercase tracking-wider py-4 hover:bg-secondary disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode("signin")}
                className="w-full border-2 border-dark font-bold text-sm uppercase py-3 hover:bg-dark hover:text-light transition-all"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
