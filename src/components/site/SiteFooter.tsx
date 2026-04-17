import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card/40 mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-sm bg-gradient-gold">
              <span className="font-display text-xl font-bold text-charcoal">S</span>
            </div>
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
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.2em] text-gold">Contact</h4>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> info@sineautos.com</li>
            <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> +1 (212) 555‑0199</li>
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Manhattan, New York</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.2em] text-gold">Follow</h4>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
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
