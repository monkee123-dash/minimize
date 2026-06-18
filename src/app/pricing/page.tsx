"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Check, Crown, ArrowLeft, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Pricing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email, priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
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
      features: ["5 redesigns/month", "720p export", "Watermarked", "6 styles", "Community support"],
      cta: "Current Plan",
      disabled: true,
      priceId: null,
      popular: false,
    },
    {
      name: "Starter",
      price: "$4.99",
      period: "/month",
      features: ["20 redesigns/month", "1080p export", "No watermark", "All 6 styles", "Standard speed"],
      cta: "Upgrade",
      disabled: false,
      priceId: process.env.STRIPE_PRICE_ID_STARTER,
      popular: false,
    },
    {
      name: "Pro",
      price: "$12.99",
      period: "/month",
      features: ["Unlimited redesigns", "4K export", "No watermark", "All 6 styles", "Priority speed", "Email support"],
      cta: "Go Pro",
      disabled: false,
      priceId: process.env.STRIPE_PRICE_ID_PRO,
      popular: true,
    },
    {
      name: "Pay-Per-Use",
      price: "$0.05",
      period: "/redesign",
      features: ["No subscription", "Credits never expire", "1080p export", "No watermark", "All 6 styles"],
      cta: "Buy Credits",
      disabled: false,
      priceId: null,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-light">
      <nav className="bg-dark text-light px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tighter gradient-text">MINIMIZE</Link>
        <Link href="/" className="text-sm font-bold uppercase hover:text-primary transition-colors flex items-center gap-1"><ArrowLeft size={16} /> Back</Link>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Simple Pricing</h1>
          <p className="text-lg text-gray">Start free. Upgrade when you need more. No surprises.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className={`relative p-6 border-2 ${plan.popular ? "border-primary bg-primary/5" : "border-dark"}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black uppercase tracking-wider px-4 py-1">Most Popular</div>}
              <h3 className="text-xl font-black mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black">{plan.price}</span>
                <span className="text-gray text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm"><Check size={14} className="text-primary flex-shrink-0" />{feat}</li>
                ))}
              </ul>
              <button
                onClick={() => plan.priceId && handleCheckout(plan.priceId)}
                disabled={plan.disabled || loading}
                className={`w-full font-black text-xs uppercase tracking-wider py-3 transition-all ${
                  plan.disabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : plan.popular ? "bg-primary text-white hover:bg-secondary" : "border-2 border-dark hover:bg-dark hover:text-light"
                }`}
              >
                {loading && !plan.disabled ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading...</span> : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray">Questions? <a href="mailto:hello@minimize.app" className="text-primary font-bold hover:underline">hello@minimize.app</a></p>
        </div>
      </div>
    </div>
  );
}
