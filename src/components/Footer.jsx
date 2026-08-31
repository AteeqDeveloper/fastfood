function Footer({ onNavigate }) {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
          {/* Brand */}
          <div>
            <button
              onClick={() => onNavigate("home")}
              className="font-display font-extrabold text-2xl tracking-tight mb-3 block"
            >
              Crispy<span className="text-chili">Bites</span>
            </button>
            <p className="text-cream/50 text-sm leading-relaxed max-w-xs">
              Karachi's grill-first kitchen. Smash burgers, charcoal shawarma,
              and stone-baked pizza — cooked to order.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-cream/40 mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Home", page: "home" },
                { label: "Menu", page: "collection" },
                { label: "Track Order", page: "track" },
              ].map((link) => (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className="text-cream/60 hover:text-chili text-sm font-medium transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-cream/40 mb-4">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-cream/60">
              <span>📍 Karachi, Pakistan</span>
              <span>📞 0300-1234567</span>
              <span>✉️ hello@crispybites.pk</span>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-cream/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/30 text-xs">
            © {new Date().getFullYear()} CrispyBites. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Instagram", "Facebook", "WhatsApp"].map((social) => (
              <span
                key={social}
                className="text-cream/30 hover:text-chili text-xs font-medium transition-colors cursor-pointer"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
