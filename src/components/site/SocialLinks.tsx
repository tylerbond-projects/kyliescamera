import { Facebook, Instagram } from "lucide-react";
import { SITE } from "@/lib/site";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.3 2.3 1.7 3.9 4 4.1v3.2c-1.5 0-2.9-.5-4-1.3v6.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.3a2.4 2.4 0 1 0 1.5 2.2V3h3.2Z" />
    </svg>
  );
}

const ICONS = {
  Instagram: Instagram,
  Facebook: Facebook,
  TikTok: TikTokIcon,
} as const;

export function SocialLinks({ size = "sm" }: { size?: "sm" | "lg" }) {
  const large = size === "lg";
  return (
    <ul className={large ? "flex flex-wrap justify-center gap-6" : "flex gap-3"}>
      {SITE.socials.map((s) => {
        const Icon = ICONS[s.label as keyof typeof ICONS];
        return (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className={
                large
                  ? "flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-8 py-6 text-center shadow-card transition-transform hover:-translate-y-1"
                  : "flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
              }
            >
              <Icon className={large ? "size-7 text-primary" : "size-4"} />
              {large && (
                <>
                  <span className="font-serif text-xl">{s.label}</span>
                  <span className="text-xs text-muted-foreground">{s.handle}</span>
                </>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
