import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Where booking inquiries land. Change this (and redeploy) to redirect
// future submissions elsewhere.
const TO_EMAIL = "tylerbond.projects@gmail.com";

// Resend's shared sandbox sender -- works with zero setup, but can only
// deliver to the Resend account's own verified owner email. Once a real
// domain is verified in Resend, swap this for e.g.
// "Kylie's Camera <hello@kyliephotography.com>" to send from a branded
// address and lift that restriction.
const FROM_EMAIL = "Kylie's Camera Contact Form <onboarding@resend.dev>";

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  interest_level: z.string().trim().min(1),
  heard_about: z.string().trim().optional(),
  desired_month: z.string().trim().min(1),
  shoot_type: z.string().trim().min(1),
  preferred_contact: z.string().trim().min(1),
  socials: z.string().trim().optional(),
  vision: z.string().trim().optional(),
});

const FIELD_LABELS: [key: keyof z.infer<typeof contactSchema>, label: string][] = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone number"],
  ["interest_level", "Interest in booking"],
  ["heard_about", "How they heard about me"],
  ["desired_month", "Desired month"],
  ["shoot_type", "Shoot type"],
  ["preferred_contact", "Preferred contact"],
  ["socials", "Socials"],
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Sends a booking inquiry straight to TO_EMAIL via Resend's API, instead of
// relying on the visitor's own email client (the old `mailto:` approach).
export const sendContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      throw new Error("Email sending isn't configured yet -- RESEND_API_KEY is missing.");
    }

    const rows = FIELD_LABELS.map(([key, label]) => [label, data[key] || "—"] as const);
    const vision = data.vision || "—";

    const text = [
      ...rows.map(([label, value]) => `${label}: ${value}`),
      "",
      "Vision for the shoot:",
      vision,
    ].join("\n");

    const html = `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">
      <h2 style="margin:0 0 16px;">New booking inquiry from ${escapeHtml(data.name)}</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:2px 16px 2px 0;color:#777;white-space:nowrap;">${escapeHtml(
                label,
              )}</td><td>${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 4px;color:#777;">Vision for the shoot:</p>
      <p style="white-space:pre-wrap;margin:0;">${escapeHtml(vision)}</p>
    </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: data.email,
        subject: `New booking inquiry from ${data.name}`,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Resend API error (${res.status}): ${body}`);
    }

    return { ok: true as const };
  });
