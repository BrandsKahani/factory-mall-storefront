import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const shop = process.env.SHOPIFY_STORE_DOMAIN;  
    const token = process.env.SHOPIFY_ADMIN_API_TOKEN;

    // Shopify new customer auth endpoint
    const url = `https://${shop}/admin/api/2024-01/customers/send_account_invite.json`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: { email },
        custom_message: "Use this link to sign in to Factory Mall",
      }),
    });

    const text = await response.text();
    if (!text) {
      return NextResponse.json(
        { error: "Empty response from Shopify" },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);

    if (data.errors) {
      return NextResponse.json({ error: data.errors }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
