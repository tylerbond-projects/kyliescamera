import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-sand/60">
      <div className="container-site grid gap-10 py-14 md:grid-cols-3 md:items-start">
        <div>
          <p className="font-serif text-3xl">{SITE.name}</p>
          <p className="font-script mt-1 text-2xl text-primary">{SITE.motto}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {SITE.tagline} · {SITE.location}
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm md:items-center">
          <Link to="/gallery" className="hover:text-primary">Gallery</Link>
          <Link to="/pricing" className="hover:text-primary">Info & Pricing</Link>
          <Link to="/faq" className="hover:text-primary">FAQ</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
        </nav>
        <div className="md:justify-self-end">
          <p className="eyebrow mb-3">Follow along</p>
          <SocialLinks />
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
