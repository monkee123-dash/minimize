import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export const getOrCreateCustomer = async (email: string, userId: string) => {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (profiles?.stripe_customer_id) {
    return profiles.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  return customer.id;
};

import { supabase } from "./supabase";
