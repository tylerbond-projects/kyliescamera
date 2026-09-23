import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { adminLogout, getAdminStatus, uploadTestimonialPhoto } from "@/lib/admin.functions";
import { getSiteContentMap, updateSiteContentSection } from "@/lib/content.functions";
import { BIO, FUN_FACTS, FAQS, SHOOT_TYPES, MISC_PRICING, TESTIMONIALS } from "@/lib/site";

export const Route = createFileRoute("/admin/content")({
  beforeLoad: async () => {
    const { isAdmin } = await getAdminStatus();
    if (!isAdmin) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [
      { title: "Edit Site Content — Kylie's Camera Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminContentPage,
});

// -- Editable shapes (mutable versions of the `as const` shapes in site.ts) --
type Bio = { eyebrow: string; header: string; paragraphs: string[] };
type FunFact = { title: string; text: string };
type Faq = { q: string; a: string };
type ShootPackage = { label: string; hours: string; price: string; images: string };
type ShootType = {
  slug: string;
  name: string;
  price: string;
  blurb: string;
  details: string[];
  disclaimer: string;
  packages: ShootPackage[];
};
type MiscItem = { slug: string; name: string; price: string; note: string };
type MiscPricing = { title: string; blurb: string; items: MiscItem[] };
type TestimonialPhoto = { src: string; alt: string };
type Testimonial = {
  name: string;
  session: string;
  quote: string;
  photo?: TestimonialPhoto | undefined;
};

const DEFAULT_SHOOT_TYPES: ShootType[] = SHOOT_TYPES.map((t) => ({
  slug: t.slug,
  name: t.name,
  price: t.price,
  blurb: t.blurb,
  details: [...t.details],
  disclaimer: t.disclaimer,
  packages: t.packages.map((p) => ({ ...p })),
}));
const DEFAULT_MISC_PRICING: MiscPricing = {
  title: MISC_PRICING.title,
  blurb: MISC_PRICING.blurb,
  items: MISC_PRICING.items.map((i) => ({ ...i })),
};
const DEFAULT_TESTIMONIALS: Testimonial[] = TESTIMONIALS.map((t) => ({
  name: t.name,
  session: t.session,
  quote: t.quote,
  photo: t.photo ? { src: t.photo.src, alt: t.photo.alt } : undefined,
}));

function AdminContentPage() {
  const navigate = useNavigate();
  const getContentMap = useServerFn(getSiteContentMap);
  const saveSection = useServerFn(updateSiteContentSection);
  const logout = useServerFn(adminLogout);

  const [loaded, setLoaded] = useState(false);
  const [bio, setBio] = useState<Bio>(BIO);
  const [funFacts, setFunFacts] = useState<FunFact[]>(FUN_FACTS.map((f) => ({ ...f })));
  const [faqs, setFaqs] = useState<Faq[]>(FAQS.map((f) => ({ ...f })));
  const [shootTypes, setShootTypes] = useState<ShootType[]>(DEFAULT_SHOOT_TYPES);
  const [miscPricing, setMiscPricing] = useState<MiscPricing>(DEFAULT_MISC_PRICING);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    (async () => {
      const content = await getContentMap();
      if (content["bio"]) setBio(content["bio"] as Bio);
      if (content["fun_facts"]) setFunFacts(content["fun_facts"] as FunFact[]);
      if (content["faqs"]) setFaqs(content["faqs"] as Faq[]);
      if (content["shoot_types"]) setShootTypes(content["shoot_types"] as ShootType[]);
      if (content["misc_pricing"]) setMiscPricing(content["misc_pricing"] as MiscPricing);
      if (content["testimonials"]) setTestimonials(content["testimonials"] as Testimonial[]);
      setLoaded(true);
    })();
  }, [getContentMap]);

  async function signOut() {
    await logout();
    navigate({ to: "/admin/login" });
  }

  if (!loaded) {
    return (
      <section className="container-site flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading current content…</p>
      </section>
    );
  }

  return (
    <>
      <PageIntro eyebrow="Admin" title="Edit Site Content">
        Changes save per section — text you edit here goes live right away, no deploy needed.
      </PageIntro>

      <div className="container-site flex items-center justify-center gap-6">
        <Link
          to="/admin"
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          ← Back to admin
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          Sign out
        </button>
      </div>

      <div className="container-site max-w-3xl space-y-20 pb-24">
        <SectionEditor title="Bio" section="bio" data={bio} save={saveSection}>
          <Field
            label="Eyebrow"
            value={bio.eyebrow}
            onChange={(v) => setBio({ ...bio, eyebrow: v })}
          />
          <Field
            label="Header"
            value={bio.header}
            onChange={(v) => setBio({ ...bio, header: v })}
          />
          {bio.paragraphs.map((p, i) => (
            <Field
              key={i}
              label={`Paragraph ${i + 1}`}
              value={p}
              multiline
              onChange={(v) => {
                const next = bio.paragraphs.slice();
                next[i] = v;
                setBio({ ...bio, paragraphs: next });
              }}
            />
          ))}
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-outline text-xs"
              onClick={() => setBio({ ...bio, paragraphs: [...bio.paragraphs, ""] })}
            >
              Add paragraph
            </button>
            {bio.paragraphs.length > 1 && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.18em] text-destructive hover:underline"
                onClick={() => setBio({ ...bio, paragraphs: bio.paragraphs.slice(0, -1) })}
              >
                Remove last paragraph
              </button>
            )}
          </div>
        </SectionEditor>

        <SectionEditor title="Fun Facts" section="fun_facts" data={funFacts} save={saveSection}>
          <ObjectListEditor
            items={funFacts}
            onChange={setFunFacts}
            fields={[
              { key: "title", label: "Title" },
              { key: "text", label: "Answer" },
            ]}
            emptyItem={{ title: "", text: "" }}
            addLabel="Add fact"
          />
        </SectionEditor>

        <SectionEditor title="FAQ" section="faqs" data={faqs} save={saveSection}>
          <ObjectListEditor
            items={faqs}
            onChange={setFaqs}
            fields={[
              { key: "q", label: "Question" },
              { key: "a", label: "Answer", multiline: true },
            ]}
            emptyItem={{ q: "", a: "" }}
            addLabel="Add question"
          />
        </SectionEditor>

        <SectionEditor
          title="Testimonials"
          section="testimonials"
          data={testimonials}
          save={saveSection}
        >
          <TestimonialsEditor items={testimonials} onChange={setTestimonials} />
        </SectionEditor>

        <SectionEditor
          title="Session Pricing"
          section="shoot_types"
          data={shootTypes}
          save={saveSection}
        >
          <div className="space-y-10">
            {shootTypes.map((t, i) => (
              <div key={t.slug} className="rounded-lg border border-border p-5">
                <p className="eyebrow mb-4">{t.slug}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Name"
                    value={t.name}
                    onChange={(v) => updateShootType(i, { name: v })}
                  />
                  <Field
                    label="Price"
                    value={t.price}
                    onChange={(v) => updateShootType(i, { price: v })}
                  />
                </div>
                <Field
                  label="Blurb"
                  value={t.blurb}
                  multiline
                  onChange={(v) => updateShootType(i, { blurb: v })}
                />
                <StringListField
                  label="Checklist (one per line)"
                  value={t.details}
                  onChange={(v) => updateShootType(i, { details: v })}
                />
                <Field
                  label="Disclaimer"
                  value={t.disclaimer}
                  onChange={(v) => updateShootType(i, { disclaimer: v })}
                />
                <p className="mb-1.5 mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Packages
                </p>
                <ObjectListEditor
                  items={t.packages}
                  onChange={(packages) => updateShootType(i, { packages })}
                  fields={[
                    { key: "label", label: "Label" },
                    { key: "hours", label: "Hours" },
                    { key: "price", label: "Price" },
                    { key: "images", label: "Edited images" },
                  ]}
                  emptyItem={{ label: "", hours: "", price: "", images: "" }}
                  addLabel="Add package"
                />
              </div>
            ))}
          </div>
        </SectionEditor>

        <SectionEditor
          title="Misc. Pricing"
          section="misc_pricing"
          data={miscPricing}
          save={saveSection}
        >
          <Field
            label="Title"
            value={miscPricing.title}
            onChange={(v) => setMiscPricing({ ...miscPricing, title: v })}
          />
          <Field
            label="Blurb"
            value={miscPricing.blurb}
            onChange={(v) => setMiscPricing({ ...miscPricing, blurb: v })}
          />
          <p className="mb-1.5 mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Items
          </p>
          <ObjectListEditor
            items={miscPricing.items}
            onChange={(items) => setMiscPricing({ ...miscPricing, items })}
            fields={[
              { key: "name", label: "Name" },
              { key: "price", label: "Price" },
              { key: "note", label: "Note" },
            ]}
            emptyItem={{ slug: "", name: "", price: "", note: "" }}
            addLabel="Add item"
          />
        </SectionEditor>
      </div>
    </>
  );

  function updateShootType(index: number, patch: Partial<ShootType>) {
    setShootTypes((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }
}

function SectionEditor<T>({
  title,
  section,
  data,
  save,
  children,
}: {
  title: string;
  section: string;
  data: T;
  save: (opts: { data: { section: string; data: unknown } }) => Promise<{ ok: true }>;
  children: ReactNode;
}) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  async function onSave() {
    setSaving(true);
    setStatus("idle");
    try {
      await save({ data: { section, data } });
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-3xl">{title}</h2>
        <div className="flex items-center gap-3">
          {status === "saved" && <span className="text-xs text-primary">Saved</span>}
          {status === "error" && <span className="text-xs text-destructive">Save failed</span>}
          <button type="button" onClick={onSave} disabled={saving} className="btn-primary text-xs">
            {saving ? "Saving…" : `Save ${title}`}
          </button>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {multiline ? (
        <textarea
          className="field"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className="field" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function StringListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <textarea
        className="field"
        rows={Math.max(3, value.length)}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split("\n").filter((line) => line.trim() !== ""));
        }}
      />
    </label>
  );
}

function ObjectListEditor<T extends Record<string, string>>({
  items,
  fields,
  onChange,
  emptyItem,
  addLabel,
}: {
  items: T[];
  fields: { key: keyof T; label: string; multiline?: boolean }[];
  onChange: (items: T[]) => void;
  emptyItem: T;
  addLabel: string;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-md border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={String(f.key)} className={f.multiline ? "block sm:col-span-2" : "block"}>
                <span className="mb-1 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {f.label}
                </span>
                {f.multiline ? (
                  <textarea
                    className="field"
                    rows={3}
                    value={item[f.key] as string}
                    onChange={(e) => {
                      const next = items.slice();
                      next[i] = { ...next[i], [f.key]: e.target.value } as T;
                      onChange(next);
                    }}
                  />
                ) : (
                  <input
                    className="field"
                    value={item[f.key] as string}
                    onChange={(e) => {
                      const next = items.slice();
                      next[i] = { ...next[i], [f.key]: e.target.value } as T;
                      onChange(next);
                    }}
                  />
                )}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="mt-3 text-xs uppercase tracking-[0.18em] text-destructive hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { ...emptyItem }])}
        className="btn-outline text-xs"
      >
        {addLabel}
      </button>
    </div>
  );
}

function TestimonialsEditor({
  items,
  onChange,
}: {
  items: Testimonial[];
  onChange: (items: Testimonial[]) => void;
}) {
  const uploadPhoto = useServerFn(uploadTestimonialPhoto);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  function updateItem(i: number, patch: Partial<Testimonial>) {
    onChange(items.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }

  function removePhoto(i: number) {
    updateItem(i, { photo: undefined });
  }

  async function onPhotoChange(i: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingIndex(i);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const { url } = await uploadPhoto({ data: fd });
      updateItem(i, { photo: { src: url, alt: items[i]?.name || "Testimonial photo" } });
    } finally {
      setUploadingIndex(null);
    }
  }

  return (
    <div className="space-y-6">
      {items.map((t, i) => (
        <div key={i} className="space-y-3 rounded-md border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" value={t.name} onChange={(v) => updateItem(i, { name: v })} />
            <Field
              label="Session"
              value={t.session}
              onChange={(v) => updateItem(i, { session: v })}
            />
          </div>
          <Field
            label="Quote"
            value={t.quote}
            multiline
            onChange={(v) => updateItem(i, { quote: v })}
          />
          <div className="flex flex-wrap items-center gap-4">
            {t.photo && (
              <img src={t.photo.src} alt="" className="size-16 rounded-md object-cover" />
            )}
            <label className="btn-outline cursor-pointer text-xs">
              {uploadingIndex === i ? "Uploading…" : t.photo ? "Replace photo" : "Upload photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingIndex !== null}
                onChange={(e) => onPhotoChange(i, e)}
              />
            </label>
            {t.photo && (
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="text-xs uppercase tracking-[0.18em] text-destructive hover:underline"
              >
                Remove photo
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="text-xs uppercase tracking-[0.18em] text-destructive hover:underline"
          >
            Remove testimonial
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { name: "", session: "", quote: "" }])}
        className="btn-outline text-xs"
      >
        Add testimonial
      </button>
    </div>
  );
}
