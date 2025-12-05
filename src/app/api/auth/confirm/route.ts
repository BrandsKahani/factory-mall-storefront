import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const response = await fetch(
    "https://ut3g5g-i6.myshopify.com/account/api/account/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    }
  );

  const data = await response.json();

  // If login success, store token
  if (data?.token) {
    cookies().set("shopify_customer_token", data.token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return NextResponse.json(data);
}
