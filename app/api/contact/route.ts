import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = str(body.name, 200);
  const email = str(body.email, 320);
  const message = str(body.message, 5000);
  // Optional extra fields from the existing form
  const business = str(body.business, 200);
  const phone = str(body.phone, 60);
  const type = str(body.type, 100);

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Name, email and message are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !to || !from) {
    return NextResponse.json({ ok: false, error: "Email service is not configured (RESEND_API_KEY, CONTACT_EMAIL, CONTACT_FROM)." }, { status: 500 });
  }

  const rows: [string, string][] = [["Name", name], ["Email", email]];
  if (business) rows.push(["Business / Organization", business]);
  if (phone) rows.push(["Phone / WhatsApp", phone]);
  if (type) rows.push(["Website type", type]);
  rows.push(["Message", message]);

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n\n");
  const html = rows.map(([k, v]) => `<p><strong>${esc(k)}:</strong><br>${esc(v).replace(/\n/g, "<br>")}</p>`).join("");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New Portfolio Contact — ${name.replace(/[\r\n]+/g, " ")}`,
      text,
      html,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: "Failed to send message." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ ok: false, error: "Failed to send message." }, { status: 500 });
  }
}
