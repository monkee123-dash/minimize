"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Check, Crown, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Pricing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      window.location.href = "/?auth=signup";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["3 redesigns/month", "720p export", "Watermarked images", "6 design styles", "Community support"],
      cta: "Current Plan",
      disabled: user?.plan === "free" || !user,
      action: null,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      features: ["Unlimited redesigns", "4K export", "No watermark", "All 6 styles", "Priority processing", "Email support"],
      cta: user?.plan === "pro" ? "Current Plan" : "Upgrade to Pro",
      disabled: user?.plan === "pro",
      action: handleUpgrade,
      popular: true,
    },
    {
      name: "Business",
      price: "$49.99",
      period: "/month",
      features: ["Everything in Pro", "Batch processing (10)", "API access", "White-label export", "Dedicated support", "Custom integrations"],
      cta: "Contact Sales",
      disabled: false,
      action: () => window.location.href = "mailto:hello@minimize.app",
    },
  ];

  return (
    <div className="min-h-screen bg-light">
      <nav className="bg-dark text-light px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tighter gradient-text">MINIMIZE</Link>
        <Link href="/" className="text-sm font-bold uppercase hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft size={16} /> Back
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Simple Pricing</h1>
          <p className="text-lg text-gray">Start free. Upgrade when you are ready to create without limits.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`relative p-8 border-2 ${
                plan.popular
                  ? "border-primary bg-primary/5"
                  : "border-dark"
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
                <span className="text-gray">{plan.period}</span>
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
                onClick={plan.action || undefined}
                disabled={plan.disabled || loading}
                className={`w-full font-black text-sm uppercase tracking-wider py-3 transition-all ${
                  plan.disabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : plan.popular
                    ? "bg-primary text-white hover:bg-secondary"
                    : "border-2 border-dark hover:bg-dark hover:text-light"
                }`}
              >
                {loading && plan.popular ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Loading...
                  </span>
                ) : (
                  plan.cta
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray">
            Questions? Email us at{" "}
            <a href="mailto:hello@minimize.app" className="text-primary font-bold hover:underline">hello@minimize.app</a>
          </p>
        </div>
      </div>
    </div>
  );
}
