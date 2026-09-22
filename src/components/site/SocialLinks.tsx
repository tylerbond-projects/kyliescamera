import { Facebook, Instagram } from "lucide-react";
import { SITE } from "@/lib/site";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.3 2.3 1.7 3.9 4 4.1v3.2c-1.5 0-2.9-.5-4-1.3v6.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.3a2.4 2.4 0 1 0 1.5 2.2V3h3.2Z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.63 7.86 6.35 9.32-.09-.79-.17-2.01.03-2.88.19-.79 1.22-5.06 1.22-5.06s-.31-.62-.31-1.55c0-1.45.84-2.53 1.89-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.89 1.54 1.89 1.85 0 3.1-2.38 3.1-5.2 0-2.14-1.44-3.75-4.07-3.75-2.97 0-4.82 2.21-4.82 4.68 0 .85.25 1.45.64 1.91.18.21.21.3.14.55-.05.19-.16.63-.21.8-.07.26-.28.36-.51.26-1.43-.58-2.1-2.14-2.1-3.9 0-2.9 2.44-6.38 7.28-6.38 3.89 0 6.45 2.82 6.45 5.84 0 4-2.22 6.99-5.5 6.99-1.1 0-2.14-.6-2.49-1.28l-.68 2.68c-.21.85-.63 1.7-1.02 2.36.9.27 1.85.42 2.83.42 5.52 0 10-4.48 10-10S17.52 2 12 2Z" />
    </svg>
  );
}

const ICONS = {
  Instagram: Instagram,
  Facebook: Facebook,
  TikTok: TikTokIcon,
  Pinterest: PinterestIcon,
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
