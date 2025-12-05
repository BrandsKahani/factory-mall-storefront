import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const res = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/customers/authenticate.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN!,
        },
        body: JSON.stringify({
          customer: { email, password }
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.errors || "Login failed" }, { status: 400 });
    }

    // Shopify returns customer + access token
    return NextResponse.json({ success: true, customer: data.customer });

  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
