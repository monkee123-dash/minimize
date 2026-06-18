import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const priceId = session.line_items?.data[0]?.price?.id;

    if (userId) {
      // Determine plan based on price ID
      let plan = "pro";
      let credits = 999999;

      if (priceId === process.env.STRIPE_PRICE_ID_STARTER) {
        plan = "starter";
        credits = 20;
      }

      await supabaseAdmin.from("profiles").update({
        plan,
        stripe_subscription_id: session.subscription as string,
        credits,
      }).eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const { data: profile } = await supabaseAdmin.from("profiles").select("id").eq("stripe_subscription_id", subscription.id).single();

    if (profile) {
      await supabaseAdmin.from("profiles").update({ plan: "free", credits: 5, stripe_subscription_id: null }).eq("id", profile.id);
    }
  }

  return NextResponse.json({ received: true });
}
