// app/api/auth/instagram/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  // Instagram Graph API: code をアクセストークンに交換
  const tokenRes = await fetch(
    `https://graph.facebook.com/v23.0/oauth/access_token` +
      `?client_id=${process.env.FB_APP_ID}` +
      `&redirect_uri=${process.env.REDIRECT_URI}` +
      `&client_secret=${process.env.FB_APP_SECRET}` +
      `&code=${code}`
  );

  const tokenData = await tokenRes.json();

  // 👉 ここで tokenData.access_token をDBやSupabaseに保存すると良い
  console.log("Access Token Response:", tokenData);

  return NextResponse.json({
    message: "Instagram OAuth success",
    tokenData,
  });
}
