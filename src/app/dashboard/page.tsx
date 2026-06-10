"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase, type Redesign } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Download, Loader2, ArrowLeft, Crown, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [redesigns, setRedesigns] = useState<Redesign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchRedesigns();
    }
  }, [user]);

  const fetchRedesigns = async () => {
    const { data } = await supabase
      .from("redesigns")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    setRedesigns(data || []);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-light">
      <nav className="bg-dark text-light px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tighter gradient-text">MINIMIZE</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold flex items-center gap-2">
            {user.plan === "pro" ? <Crown size={16} className="text-accent" /> : <Zap size={16} className="text-primary" />}
            {user.plan === "pro" ? "Pro Plan" : `${user.credits} credits`}
          </span>
          <Link href="/" className="text-sm font-bold uppercase hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">Your Redesigns</h1>
          <p className="text-gray mb-8">All your AI-generated interior transformations in one place.</p>

          {redesigns.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-300">
              <p className="text-xl font-bold text-gray mb-4">No redesigns yet</p>
              <Link href="/" className="bg-primary text-white font-black uppercase tracking-wider px-8 py-3 hover:bg-secondary transition-colors">
                Create Your First Redesign
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redesigns.map((redesign, i) => (
                <motion.div
                  key={redesign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border-2 border-dark overflow-hidden hover:shadow-[4px_4px_0px_#0A0A0A] transition-all"
                >
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <img src={redesign.original_url} alt="Original" className="w-full h-40 object-cover" />
                      <span className="absolute top-2 left-2 bg-dark/80 text-white text-xs font-bold px-2 py-1">Before</span>
                    </div>
                    <div className="relative">
                      {redesign.result_url ? (
                        <>
                          <img src={redesign.result_url} alt="Redesigned" className="w-full h-40 object-cover" />
                          <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1">After</span>
                        </>
                      ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                          <Loader2 size={24} className="animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">{redesign.style}</span>
                      <span className="text-xs text-gray-400">{new Date(redesign.created_at).toLocaleDateString()}</span>
                    </div>
                    {redesign.result_url && (
                      <a
                        href={redesign.result_url}
                        download
                        className="mt-3 flex items-center justify-center gap-2 w-full bg-dark text-light py-2 text-sm font-bold uppercase hover:bg-primary transition-colors"
                      >
                        <Download size={16} /> Download
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
