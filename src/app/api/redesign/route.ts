import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Style prompt mappings
const stylePrompts: Record<string, string> = {
  minimalist: "minimalist interior design, clean lines, neutral colors, white and beige tones, uncluttered, modern furniture, natural light, spacious, serene",
  scandinavian: "scandinavian interior design, warm wood tones, cozy textiles, hygge aesthetic, light colors, functional furniture, plants, natural materials",
  modern: "modern interior design, sleek contemporary furniture, bold accents, geometric shapes, polished surfaces, statement lighting, luxury feel",
  bohemian: "bohemian interior design, eclectic decor, layered textiles, warm earthy colors, vintage furniture, plants, artistic touches, cozy atmosphere",
  industrial: "industrial interior design, exposed brick, metal fixtures, raw concrete, Edison bulbs, leather furniture, urban loft aesthetic, masculine",
  japandi: "japandi interior design, Japanese minimalism meets Scandinavian warmth, natural wood, neutral palette, clean lines, zen atmosphere, wabi-sabi",
};

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, style, userId } = await req.json();

    if (!imageUrl || !userId) {
      return NextResponse.json(
        { error: "Missing imageUrl or userId" },
        { status: 400 }
      );
    }

    // Check credits
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("credits, plan")
      .eq("id", userId)
      .single();

    if (!profile || (profile.credits <= 0 && profile.plan === "free")) {
      return NextResponse.json(
        { error: "No credits remaining. Upgrade to Pro for unlimited redesigns." },
        { status: 403 }
      );
    }

    // Deduct credit for free users
    if (profile.plan === "free") {
      await supabaseAdmin
        .from("profiles")
        .update({ credits: profile.credits - 1 })
        .eq("id", userId);
    }

    // Create redesign record
    const { data: redesign } = await supabaseAdmin
      .from("redesigns")
      .insert({
        user_id: userId,
        original_url: imageUrl,
        status: "processing",
        style: style || "minimalist",
      })
      .select()
      .single();

    // Use google/nano-banana for image editing
    // This model takes an existing image and transforms it based on a prompt
    const output = await replicate.run(
      "google/nano-banana",
      {
        input: {
          prompt: `Redesign this room into a ${stylePrompts[style || "minimalist"]}. Remove all clutter, organize furniture, professional interior photography, high quality, photorealistic.`,
          image_input: imageUrl,
        },
      }
    );

    // Handle output format
    let resultUrl: string;
    if (Array.isArray(output)) {
      resultUrl = output[0] as string;
    } else if (typeof output === "string") {
      resultUrl = output;
    } else if (output && typeof output === "object") {
      resultUrl = (output as any).url || (output as any)[0];
    } else {
      throw new Error("Unexpected output format from AI model");
    }

    // Update record with result
    await supabaseAdmin
      .from("redesigns")
      .update({
        result_url: resultUrl,
        status: "completed",
      })
      .eq("id", redesign.id);

    return NextResponse.json({
      success: true,
      redesignId: redesign.id,
      resultUrl,
    });
  } catch (error: any) {
    console.error("Redesign error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to process redesign. Please try again." },
      { status: 500 }
    );
  }
}
