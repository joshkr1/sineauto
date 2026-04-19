import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";
import logoUrl from "@/assets/logo.jpeg";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.5a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.05Z" />
  </svg>
);

const socials = [
  { Icon: Instagram, href: "https://www.instagram.com/sine_autos", label: "Instagram" },
  { Icon: Facebook, href: "https://www.facebook.com/share/1C7ZhHkNbp/", label: "Facebook" },
  { Icon: Linkedin, href: "https://linkedin.com/in/sine-autos-70a0a73aa", label: "LinkedIn" },
  { Icon: TikTokIcon, href: "https://www.tiktok.com/@sine_autos", label: "TikTok" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card/40 mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Sine Autos logo" className="h-11 w-11 rounded-sm object-cover" />
            <div>
              <div className="font-display text-xl font-semibold text-foreground">SINE AUTOS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Drive Excellence</div>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            One brand. Every automotive solution. Worldwide. Connecting you to exceptional vehicles from timeless classics to modern luxury.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.2em] text-gold">Explore</h4>
          <ul className="mt-6 space-y-3 text-sm">
            <li><Link to="/inventory" className="text-muted-foreground hover:text-foreground">Inventory</Link></li>
            <li><Link to="/services" className="text-muted-foreground hover:text-foreground">Services</Link></li>
            <li><Link to="/auctions" className="text-muted-foreground hover:text-foreground">Auctions</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.2em] text-gold">Contact</h4>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href="mailto:info@sineautos.com" className="hover:text-foreground">info@sineautos.com</a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href="tel:+18629104389" className="hover:text-foreground">+1 (862) 910‑4389</a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href="https://wa.me/18629104389" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">WhatsApp us</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=95+Freeway+Drive+West+Orange+NJ+07050"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                95 Freeway Drive West,<br />Orange, NJ 07050
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.2em] text-gold">Follow</h4>
          <div className="mt-6 flex gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-sm border border-border text-muted-foreground transition-all hover:border-gold hover:text-gold"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div>© {year} Sine Autos. All rights reserved.</div>
          <div className="font-display tracking-widest">DRIVE EXCELLENCE — ANYWHERE IN THE WORLD</div>
        </div>
      </div>
    </footer>
  );
}
