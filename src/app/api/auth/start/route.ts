import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const response = await fetch(
    "https://ut3g5g-i6.myshopify.com/account/api/account/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        redirectUri: "https://factorymall.pk/account", 
      }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
