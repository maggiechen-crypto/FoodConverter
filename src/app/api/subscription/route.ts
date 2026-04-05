import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, tier, action } = body;

    if (action === "check") {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (error || !data) {
        return NextResponse.json({ tier: "free", status: "inactive" });
      }

      return NextResponse.json({ tier: data.tier, status: data.status });
    }

    if (action === "upgrade") {
      const { error } = await supabase
        .from("subscriptions")
        .upsert({
          user_id,
          tier,
          status: "active",
          started_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: "user_id" });

      if (error) throw error;

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Subscription API error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
