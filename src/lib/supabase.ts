import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type UserProfile = {
  id: string;
  email: string;
  credits: number;
  plan: "free" | "pro" | "business";
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
};

export type Redesign = {
  id: string;
  user_id: string;
  original_url: string;
  result_url: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  style: string;
  created_at: string;
};
