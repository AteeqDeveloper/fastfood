import { Flame, Clock, MapPin, Phone, Mail, Share2 } from "lucide-react";

function Footer({ onNavigate }) {
  const handleNav = (targetPage) => {
    onNavigate(targetPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#3A2418] text-[#FFF3DC] border-t-2 border-[#C65D21]/30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* 1. CrispyBites Brand & Story */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#C65D21] flex items-center justify-center shadow-lg shadow-[#C65D21]/30">
                <Flame className="w-5 h-5 text-[#FFFAF0] fill-[#FFFAF0]" />
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-[#FFFAF0]">
                Crispy<span className="text-[#C65D21]">Bites</span>
              </span>
            </div>
            <p className="text-[#FFF3DC]/70 text-xs sm:text-sm leading-relaxed mb-4 font-medium">
              Karachi's authentic handcrafted street-food brand. Cast-iron smashed beef burgers,
              48-hour fermented sourdough pizzas, and hand-cut rosemary fries cooked fresh to order.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#4A3123] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#E6A93A] border border-[#FFF3DC]/10">
              <span className="w-2 h-2 rounded-full bg-[#E6A93A] animate-pulse" />
              <span>100% Halal & Fresh Daily</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="font-display font-extrabold text-sm uppercase tracking-widest text-[#E6A93A] mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {[
                { label: "Home", page: "home" },
                { label: "Handcrafted Menu", page: "menu" },
                { label: "About Us", page: "about" },
                { label: "Special Offers & Deals", page: "offers" },
                { label: "Track Your Order", page: "track" },
                { label: "Contact Us", page: "contact" },
                { label: "Cart & Checkout", page: "cart" },
              ].map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className="text-[#FFF3DC]/70 hover:text-[#C65D21] transition-colors text-left font-medium cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 3. Opening Hours */}
          <div>
            <h4 className="font-display font-extrabold text-sm uppercase tracking-widest text-[#E6A93A] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C65D21]" />
              <span>Opening Hours</span>
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#FFF3DC]/80 font-medium">
              <div className="flex justify-between pb-2 border-b border-[#FFF3DC]/10">
                <span className="text-[#FFF3DC]/60">Mon – Thu</span>
                <span className="font-bold text-[#FFFAF0]">11:00 AM – 12:00 AM</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#FFF3DC]/10">
                <span className="text-[#FFF3DC]/60">Fri – Sat</span>
                <span className="font-bold text-[#E6A93A]">11:00 AM – 02:00 AM</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#FFF3DC]/10">
                <span className="text-[#FFF3DC]/60">Sunday</span>
                <span className="font-bold text-[#FFFAF0]">12:00 PM – 12:00 AM</span>
              </div>
              <p className="text-[11px] text-[#E6A93A] font-semibold mt-2">
                * Live deliveries active until 30 minutes before closing.
              </p>
            </div>
          </div>

          {/* 4. Contact Information & Socials */}
          <div>
            <h4 className="font-display font-extrabold text-sm uppercase tracking-widest text-[#E6A93A] mb-4">
              Get In Touch
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#FFF3DC]/80 font-medium mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C65D21] shrink-0 mt-0.5" />
                <span>Plot 14-C, Food Street, Block 4 Clifton, Karachi</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C65D21] shrink-0" />
                <a href="tel:03001234567" className="hover:text-[#C65D21] font-bold">
                  0300-1234567 / 021-3589000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C65D21] shrink-0" />
                <a href="mailto:hello@crispybites.pk" className="hover:text-[#C65D21]">
                  hello@crispybites.pk
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <p className="text-[11px] font-bold text-[#FFF3DC]/50 uppercase tracking-wider mb-2.5">
              Connect With CrispyBites
            </p>
            <div className="flex items-center gap-2">
              {["Instagram", "Facebook", "TikTok", "WhatsApp"].map((platform) => (
                <span
                  key={platform}
                  className="bg-[#4A3123] hover:bg-[#C65D21] text-[#FFF3DC] hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#FFF3DC]/10 shadow-sm active:scale-95"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="border-t border-[#FFF3DC]/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF3DC]/40 font-medium">
          <p>© {new Date().getFullYear()} CrispyBites Kitchens. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#FFF3DC] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#FFF3DC] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#FFF3DC] cursor-pointer">Food Hygiene Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
