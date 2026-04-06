// app/api/auth/instagram/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

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

  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: "Token exchange failed", details: tokenData },
      { status: 400 }
    );
  }

  const accessToken =
    typeof tokenData.access_token === "string" ? tokenData.access_token : undefined;
  if (!accessToken) {
    return NextResponse.json({ error: "Invalid token response" }, { status: 502 });
  }

  // Persist accessToken server-side only (e.g. database). Never log or return it.

  return NextResponse.json({
    message: "Instagram OAuth success",
  });
}
