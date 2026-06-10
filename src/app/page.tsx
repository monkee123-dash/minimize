"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Sparkles,
  Zap,
  Palette,
  Download,
  Check,
  X,
  ArrowRight,
  Loader2,
  Crown,
  LogIn,
  User,
  Menu,
  XIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const styles = [
  { id: "minimalist", name: "Minimalist", desc: "Clean lines, neutral tones" },
  { id: "scandinavian", name: "Scandinavian", desc: "Warm woods, cozy light" },
  { id: "modern", name: "Modern", desc: "Sleek, bold, contemporary" },
  { id: "bohemian", name: "Bohemian", desc: "Eclectic, layered, artistic" },
  { id: "industrial", name: "Industrial", desc: "Raw, urban, exposed" },
  { id: "japandi", name: "Japandi", desc: "Japanese + Scandinavian fusion" },
];

export default function Home() {
  const { user, signIn, signUp, signOut, useCredit, loading: authLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("minimalist");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  });

  const handleRedesign = async () => {
    if (!file || !user) return;
    setIsProcessing(true);
    setError(null);

    try {
      // Check credits
      const canProceed = await useCredit();
      if (!canProceed) {
        setError("No credits remaining. Upgrade to Pro for unlimited redesigns!");
        setIsProcessing(false);
        return;
      }

      // Upload image
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      // Process redesign
      const redesignRes = await fetch("/api/redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          style: selectedStyle,
          userId: user.id,
        }),
      });
      const redesignData = await redesignRes.json();

      if (!redesignRes.ok) {
        throw new Error(redesignData.error || "Redesign failed");
      }

      setResult(redesignData.resultUrl);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = authMode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password);
    if (error) {
      setError(error.message);
    } else {
      setShowAuth(false);
    }
  };

  const scrollToApp = () => {
    document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-light">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-light/95 backdrop-blur-md border-b-2 border-dark px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter gradient-text">
          MINIMIZE
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">Features</a>
          <a href="#how" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">How It Works</a>
          <a href="#pricing" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">Pricing</a>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold">{user.credits} credits</span>
              <Link href="/dashboard" className="text-sm font-bold uppercase tracking-wider hover:text-primary">Dashboard</Link>
              <button onClick={signOut} className="text-sm font-bold uppercase tracking-wider text-primary hover:text-dark">Logout</button>
            </div>
          ) : (
            <button onClick={() => { setShowAuth(true); setAuthMode("signin"); }} className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider bg-dark text-light px-4 py-2 hover:bg-primary transition-colors">
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 bg-light border-b-2 border-dark z-40 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold uppercase">Features</a>
              <a href="#how" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold uppercase">How It Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold uppercase">Pricing</a>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-lg font-bold uppercase">Dashboard</Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-lg font-bold uppercase text-primary text-left">Logout</button>
                </>
              ) : (
                <button onClick={() => { setShowAuth(true); setAuthMode("signin"); setMobileMenuOpen(false); }} className="text-lg font-bold uppercase text-primary text-left">Sign In</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="pt-24 md:pt-0 min-h-screen grid md:grid-cols-2 gap-8 md:gap-16 items-center px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-[-200px] right-[-300px] w-[600px] h-[600px] bg-primary/5 animate-[spin_20s_linear_infinite] z-0" />
        <div className="absolute bottom-[100px] left-[-150px] w-[400px] h-[400px] bg-secondary/5 rounded-full animate-float z-0" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 pt-12 md:pt-0"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter mb-6">
            Transform Chaos
            <span className="block gradient-text">Into Calm</span>
          </h1>
          <p className="text-lg md:text-xl text-gray leading-relaxed mb-8 max-w-lg">
            Your cluttered home deserves a stunning photo. Let AI reimagine your spaces into minimalist masterpieces—ready for Instagram, instantly.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={scrollToApp}
              className="relative overflow-hidden bg-primary text-white font-black text-sm uppercase tracking-wider px-8 py-4 hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A0A0A] transition-all"
            >
              Start Creating
            </button>
            <a href="#how" className="border-2 border-dark font-black text-sm uppercase tracking-wider px-8 py-4 hover:bg-dark hover:text-light transition-all">
              How It Works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex justify-center"
        >
          <div className="geometric-shape w-full max-w-md aspect-square flex items-center justify-center animate-pulse-slow">
            <Sparkles size={80} className="text-white" />
          </div>
        </motion.div>
      </section>

      {/* APP SECTION */}
      <section id="app" className="py-20 px-6 md:px-12 bg-dark text-light">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              Upload. Redesign. <span className="gradient-text">Amaze.</span>
            </h2>
            <p className="text-gray-400 text-lg">
              {user
                ? `You have ${user.credits} free ${user.credits === 1 ? "redesign" : "redesigns"} remaining. ${user.plan === "free" ? "Upgrade to Pro for unlimited." : ""}`
                : "Sign up to get 3 free redesigns. No credit card required."}
            </p>
          </motion.div>

          {!user ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <button
                onClick={() => { setShowAuth(true); setAuthMode("signup"); }}
                className="bg-primary text-white font-black text-lg uppercase tracking-wider px-12 py-6 hover:shadow-[4px_4px_0px_#FFD700] transition-all"
              >
                Get 3 Free Redesigns →
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Upload Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-none p-12 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-600 hover:border-primary hover:bg-primary/5"
                }`}
              >
                <input {...getInputProps()} />
                <Upload size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-lg font-bold mb-2">
                  {isDragActive ? "Drop your photo here" : "Drag & drop a room photo, or click to browse"}
                </p>
                <p className="text-sm text-gray-400">PNG, JPG, WEBP up to 10MB</p>
              </div>

              {/* Preview */}
              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid md:grid-cols-2 gap-8"
                  >
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-400">Original</p>
                      <img src={preview} alt="Original" className="w-full border-2 border-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-400">
                        {result ? "AI Redesign" : "Result"}
                      </p>
                      {result ? (
                        <div className="relative">
                          <img src={result} alt="Redesigned" className="w-full border-2 border-primary" />
                          <a
                            href={result}
                            download
                            className="absolute bottom-4 right-4 bg-primary text-white p-3 hover:bg-secondary transition-colors"
                          >
                            <Download size={20} />
                          </a>
                        </div>
                      ) : (
                        <div className="w-full aspect-square border-2 border-dashed border-gray-700 flex items-center justify-center">
                          {isProcessing ? (
                            <div className="text-center">
                              <Loader2 size={40} className="animate-spin mx-auto mb-2 text-primary" />
                              <p className="text-sm text-gray-400">AI is redesigning your space...</p>
                            </div>
                          ) : (
                            <p className="text-gray-500">Your redesign will appear here</p>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Style Selector */}
              {preview && !result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <p className="text-sm font-bold uppercase tracking-wider">Choose Your Style</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-4 border-2 text-left transition-all ${
                          selectedStyle === style.id
                            ? "border-primary bg-primary/20"
                            : "border-gray-700 hover:border-gray-500"
                        }`}
                      >
                        <p className="font-black text-sm">{style.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{style.desc}</p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleRedesign}
                    disabled={isProcessing}
                    className="w-full bg-primary text-white font-black text-lg uppercase tracking-wider py-4 hover:bg-secondary disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} /> Redesign My Room
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/20 border-2 border-red-500 p-4 text-red-400 font-bold flex items-center gap-2"
                >
                  <X size={20} /> {error}
                  {error.includes("credits") && (
                    <Link href="/pricing" className="ml-auto underline hover:text-white">Upgrade →</Link>
                  )}
                </motion.div>
              )}

              {/* Reset */}
              {result && (
                <button
                  onClick={() => { setFile(null); setPreview(null); setResult(null); setError(null); }}
                  className="w-full border-2 border-gray-600 font-bold uppercase tracking-wider py-3 hover:border-light transition-colors"
                >
                  Redesign Another Room
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 md:px-12 bg-light">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Powerful Intelligence</h2>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Built for creators who refuse to compromise between reality and aesthetics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={32} className="text-accent" />,
                title: "Instant Redesign",
                desc: "Upload a photo and watch AI strip away clutter while preserving the soul of your space",
              },
              {
                icon: <Palette size={32} className="text-accent" />,
                title: "Custom Palettes",
                desc: "Choose from 6 curated styles — Minimalist, Scandinavian, Modern, Bohemian, Industrial, Japandi",
              },
              {
                icon: <Download size={32} className="text-accent" />,
                title: "One-Click Export",
                desc: "Download publication-ready images at high resolution for all your social platforms",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 border-2 border-primary hover:border-secondary hover:shadow-[8px_8px_0px_#0052FF] transition-all group"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-black mb-3">{feature.title}</h3>
                <p className="text-gray leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 px-6 md:px-12 bg-light">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-16"
          >
            Three Steps to Perfect
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Upload", desc: "Drop your messiest room photo. No special angles needed—we handle everything." },
              { num: "02", title: "Refine", desc: "Our AI removes clutter and suggests minimal décor. Pick your style and mood." },
              { num: "03", title: "Share", desc: "Download and post. Your feed just got a serious upgrade." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 border-l-4 border-secondary"
              >
                <div className="text-5xl font-black text-primary mb-4 leading-none">{step.num}</div>
                <h3 className="text-xl font-black mb-3">{step.title}</h3>
                <p className="text-gray leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 md:px-12 bg-dark text-light">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Simple Pricing</h2>
            <p className="text-lg text-gray-400">Start free. Upgrade when you are ready.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: ["3 redesigns/month", "720p export", "Watermarked images", "6 design styles"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$9.99",
                period: "/month",
                features: ["Unlimited redesigns", "4K export", "No watermark", "All 6 styles", "Priority processing"],
                cta: "Upgrade to Pro",
                popular: true,
              },
              {
                name: "Business",
                price: "$49.99",
                period: "/month",
                features: ["Everything in Pro", "Batch processing (10)", "API access", "White-label export", "Dedicated support"],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`relative p-8 border-2 ${
                  plan.popular
                    ? "border-primary bg-primary/10"
                    : "border-gray-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black uppercase tracking-wider px-4 py-1">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-primary flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    if (plan.name === "Free") {
                      setShowAuth(true);
                      setAuthMode("signup");
                    } else if (plan.name === "Pro") {
                      if (!user) {
                        setShowAuth(true);
                        setAuthMode("signup");
                      } else {
                        window.location.href = "/pricing";
                      }
                    } else {
                      window.location.href = "mailto:hello@minimize.app";
                    }
                  }}
                  className={`w-full font-black text-sm uppercase tracking-wider py-3 transition-all ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-secondary"
                      : "border-2 border-light hover:bg-light hover:text-dark"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-light py-12 px-6 border-t-2 border-primary text-center">
        <div className="text-2xl font-black tracking-tighter gradient-text mb-4">MINIMIZE</div>
        <p className="text-sm text-gray-400 mb-2">&copy; 2024 Minimize. Designed to simplify.</p>
        <a href="mailto:hello@minimize.app" className="text-accent font-bold hover:underline">hello@minimize.app</a>
      </footer>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-light w-full max-w-md p-8 border-2 border-dark"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">
                  {authMode === "signin" ? "Welcome Back" : "Get Started"}
                </h2>
                <button onClick={() => setShowAuth(false)} className="hover:text-primary">
                  <X size={24} />
                </button>
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => { setAuthMode("signup"); setError(null); }}
                  className={`flex-1 py-2 font-bold text-sm uppercase ${
                    authMode === "signup" ? "bg-dark text-light" : "border-2 border-dark"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => { setAuthMode("signin"); setError(null); }}
                  className={`flex-1 py-2 font-bold text-sm uppercase ${
                    authMode === "signin" ? "bg-dark text-light" : "border-2 border-dark"
                  }`}
                >
                  Sign In
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
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
                  <div className="text-primary text-sm font-bold">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-primary text-white font-black text-sm uppercase tracking-wider py-4 hover:bg-secondary disabled:opacity-50 transition-all"
                >
                  {authLoading ? "Loading..." : authMode === "signup" ? "Create Account" : "Sign In"}
                </button>
              </form>

              <p className="text-xs text-gray-400 mt-4 text-center">
                {authMode === "signup"
                  ? "Get 3 free redesigns. No credit card required."
                  : "Welcome back to your redesigned spaces."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
