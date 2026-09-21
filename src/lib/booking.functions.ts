import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(40),
  interest_level: z.string().min(1).max(80),
  heard_about: z.string().max(120).optional().default(""),
  desired_month: z.string().max(40).optional().default(""),
  shoot_type: z.string().min(1).max(80),
  vision: z.string().max(3000).optional().default(""),
  socials: z.string().max(200).optional().default(""),
  preferred_contact: z.enum(["Email", "Text"]),
});

export type ContactInput = z.input<typeof contactSchema>;

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert(data);
    if (error) {
      console.error("contact insert failed", error);
      throw new Error("Could not save your message. Please try again.");
    }
    return { ok: true as const };
  });

export type GalleryPhoto = { url: string; caption?: string };

export const getClientGallery = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("client_galleries")
      .select("slug, client_name, title, message, photos, created_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    return { ...row, photos: (row.photos as GalleryPhoto[]) ?? [] };
  });

export const getContract = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("contracts")
      .select("slug, client_name, title, body, signed_name, agreed, signed_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const signContract = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        slug: z.string().min(1).max(120),
        signed_name: z.string().trim().min(2).max(120),
        agreed: z.literal(true),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("contracts")
      .select("signed_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!existing) throw new Error("Contract not found.");
    if (existing.signed_at) throw new Error("This contract has already been signed.");

    const signed_at = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("contracts")
      .update({ signed_name: data.signed_name, agreed: true, signed_at })
      .eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { signed_at, signed_name: data.signed_name };
  });
