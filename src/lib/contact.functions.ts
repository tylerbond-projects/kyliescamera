import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SITE } from "@/lib/site";

// Where booking inquiries land. Change this (and redeploy) to redirect
// future submissions elsewhere.
const TO_EMAIL = "tylerbond.projects@gmail.com";

// Resend's shared sandbox sender -- works with zero setup, but can only
// deliver to the Resend account's own verified owner email. Once a real
// domain is verified in Resend, swap this for e.g.
// "Kylie's Camera <hello@kyliephotography.com>" to send from a branded
// address and lift that restriction.
const FROM_EMAIL = "Kylie's Camera Contact Form <onboarding@resend.dev>";

// Kylie's business number, shown in the email when a visitor prefers to be
// texted back. Digits only; formatted for display where it's shown.
const BUSINESS_PHONE = "6263199787";

function formatPhoneDisplay(digits: string): string {
  const match = /^1?(\d{3})(\d{3})(\d{4})$/.exec(digits.replace(/\D/g, ""));
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : digits;
}

// Brand colors, matched to the monochrome/blush palette in src/styles.css
// (email clients can't read CSS custom properties, so these are the same
// tones spelled out as plain hex).
const BRAND = {
  ink: "#2c2c2c",
  inkSoft: "#54504d",
  muted: "#9a938d",
  blush: "#f7f2ef",
  card: "#fbf9f7",
  border: "#ece6e1",
  background: "#f1ede9",
  white: "#ffffff",
};

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
  ["shoot_type", "Shoot type"],
  ["desired_month", "Desired month"],
  ["interest_level", "Interest in booking"],
  ["email", "Email"],
  ["phone", "Phone number"],
  ["preferred_contact", "Preferred contact"],
  ["socials", "Socials"],
  ["heard_about", "How they heard about me"],
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Escapes for HTML, then turns line breaks into <br> -- table-cell
// `white-space` CSS isn't reliable across email clients (Outlook especially),
// so real <br> tags are the safe way to preserve multi-line text.
function escapeHtmlMultiline(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function buildEmailHtml(data: z.infer<typeof contactSchema>): string {
  const vision = data.vision || "She didn't share any details yet.";
  const firstName = data.name.split(/\s+/)[0] || data.name;
  const prefersText = data.preferred_contact === "Text";
  const visitorPhoneDigits = data.phone.replace(/[^0-9+]/g, "");
  const cta = prefersText
    ? {
        href: `sms:${visitorPhoneDigits}`,
        label: `Text ${firstName}`,
        note: `Opens a text to ${escapeHtml(
          data.phone,
        )} -- that's how they'd like to hear back. Kylie's business number: ${formatPhoneDisplay(
          BUSINESS_PHONE,
        )}.`,
      }
    : {
        href: `mailto:${escapeHtml(data.email)}`,
        label: `Reply to ${firstName}`,
        note: `Or just hit reply on this email -- it goes straight to ${escapeHtml(data.email)}.`,
      };
  const rowsHtml = FIELD_LABELS.map(([key, label]) => {
    const value = data[key] || "—";
    return `
      <tr>
        <td style="padding:10px 0;border-top:1px solid ${BRAND.border};font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.muted};white-space:nowrap;vertical-align:top;width:160px;">
          ${escapeHtml(label)}
        </td>
        <td style="padding:10px 0;border-top:1px solid ${BRAND.border};font-family:Helvetica,Arial,sans-serif;font-size:15px;color:${BRAND.ink};">
          ${escapeHtml(value)}
        </td>
      </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <title>New booking inquiry</title>
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND.background};-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${BRAND.background};">
      New ${escapeHtml(data.shoot_type)} inquiry from ${escapeHtml(data.name)} -- ${escapeHtml(
        vision.slice(0, 90),
      )}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.background};padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:18px;overflow:hidden;">
            <tr>
              <td style="background-color:${BRAND.ink};padding:44px 40px 36px;text-align:center;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;letter-spacing:0.02em;color:${BRAND.white};">
                  ${escapeHtml(SITE.name)}
                </p>
                <p style="margin:10px 0 0;font-family:Georgia,serif;font-style:italic;font-size:15px;color:#cfc9c3;">
                  ${escapeHtml(SITE.motto)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 4px;text-align:center;">
                <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.muted};">
                  New Booking Inquiry
                </p>
                <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:32px;color:${BRAND.ink};">
                  ${escapeHtml(data.name)}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 40px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.card};border:1px solid ${BRAND.border};border-radius:14px;">
                  <tr>
                    <td style="padding:8px 26px 22px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${rowsHtml}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 40px 0;">
                <p style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.muted};">
                  Vision for the shoot
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.blush};border-radius:14px;">
                  <tr>
                    <td style="padding:20px 24px;border-left:3px solid ${BRAND.ink};font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:17px;line-height:1.65;color:${BRAND.inkSoft};">
                      ${escapeHtmlMultiline(vision)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px 4px;text-align:center;">
                <a
                  href="${cta.href}"
                  style="display:inline-block;background-color:${BRAND.ink};color:${BRAND.white};font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:15px 36px;border-radius:999px;"
                >
                  ${escapeHtml(cta.label)}
                </a>
                <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${BRAND.muted};">
                  ${cta.note}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND.border};">
                  <tr>
                    <td style="padding:24px 0 0;text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${BRAND.muted};">
                      Sent from the contact form on the ${escapeHtml(SITE.name)} website
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildEmailText(data: z.infer<typeof contactSchema>): string {
  const rows = FIELD_LABELS.map(([key, label]) => `${label}: ${data[key] || "—"}`);
  return [
    `New booking inquiry from ${data.name}`,
    "",
    ...rows,
    "",
    "Vision for the shoot:",
    data.vision || "—",
  ].join("\n");
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
        subject: `New ${data.shoot_type} inquiry from ${data.name}`,
        text: buildEmailText(data),
        html: buildEmailHtml(data),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Resend API error (${res.status}): ${body}`);
    }

    return { ok: true as const };
  });
