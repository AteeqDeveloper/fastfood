import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Share2,
} from "lucide-react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-[#FFF3DC] text-[#3A2418] bg-rustic-pattern pb-20">
      {/* 1. Hero Header */}
      <section className="bg-[#3A2418] text-[#FFF3DC] pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-2 border-[#C65D21]/30">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#C65D21]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-screen-2xl mx-auto relative z-10 text-center max-w-2xl">
          <span className="text-xs font-black uppercase tracking-widest text-[#E6A93A] bg-[#FFF3DC]/10 px-4 py-1.5 rounded-full inline-block mb-3 border border-[#FFF3DC]/15">
            We'd Love To Hear From You
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-[#FFFAF0] tracking-tight leading-tight mb-4">
            Contact CrispyBites
          </h1>
          <p className="text-[#FFF3DC]/80 text-base sm:text-lg font-medium leading-relaxed">
            Have a question, feedback about your order, catering inquiry, or just want to say hi?
            Reach out to our kitchen crew anytime!
          </p>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-[#FFFAF0] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#3A2418]/10">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#3A2418] mb-2">
              Send Us a Message
            </h2>
            <p className="text-[#3A2418]/70 text-sm mb-8 font-medium">
              Fill out the form below and our manager will reply within 24 hours.
            </p>

            {submitted ? (
              <div className="bg-[#66734A]/15 border border-[#66734A]/30 p-8 rounded-2xl text-center">
                <div className="w-14 h-14 bg-[#66734A] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="font-display font-black text-xl text-[#3A2418]">
                  Thank you for reaching out!
                </h3>
                <p className="text-[#3A2418]/70 text-sm mt-1">
                  Your message has landed in our inbox. We'll be in touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3A2418] uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Zeeshan Ahmed"
                      className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-2xl px-4 py-3 text-sm font-semibold text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3A2418] uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0300-1234567"
                      className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-2xl px-4 py-3 text-sm font-semibold text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3A2418] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-2xl px-4 py-3 text-sm font-semibold text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3A2418] uppercase tracking-wider mb-1.5">
                      Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-2xl px-4 py-3 text-sm font-semibold text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
                    >
                      <option>General Inquiry</option>
                      <option>Order Feedback</option>
                      <option>Catering & Bulk Orders</option>
                      <option>Careers & Joining Us</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-2xl p-4 text-sm font-semibold text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#C65D21] hover:bg-[#A94B16] text-white font-extrabold px-8 py-4 rounded-2xl text-sm sm:text-base shadow-lg shadow-[#C65D21]/25 hover:shadow-[#C65D21]/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Restaurant Info & Map Preview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Info Cards */}
            <div className="bg-[#FFFAF0] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#3A2418]/10 space-y-6">
              <h3 className="font-display font-black text-xl text-[#3A2418] pb-4 border-b border-[#3A2418]/10">
                Direct Kitchen Contact
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C65D21]/15 text-[#C65D21] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3A2418]/60 uppercase tracking-wider">
                    Customer Helpline
                  </p>
                  <a
                    href="tel:03001234567"
                    className="font-display font-bold text-base text-[#3A2418] hover:text-[#C65D21] block mt-0.5"
                  >
                    0300-1234567 / 021-3589000
                  </a>
                  <p className="text-xs text-[#3A2418]/60 mt-0.5">Lines open 11 AM - 1 AM daily</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#66734A]/15 text-[#66734A] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3A2418]/60 uppercase tracking-wider">
                    Email Inquiries
                  </p>
                  <a
                    href="mailto:hello@crispybites.pk"
                    className="font-display font-bold text-base text-[#3A2418] hover:text-[#C65D21] block mt-0.5"
                  >
                    hello@crispybites.pk
                  </a>
                  <p className="text-xs text-[#3A2418]/60 mt-0.5">Response within 24 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E6A93A]/20 text-[#3A2418] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C65D21]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3A2418]/60 uppercase tracking-wider">
                    Main Kitchen & Dine-In
                  </p>
                  <p className="font-display font-bold text-sm sm:text-base text-[#3A2418] mt-0.5">
                    Plot 14-C, Food Street, Block 4 Clifton, Karachi
                  </p>
                  <p className="text-xs text-[#3A2418]/60 mt-0.5">Opposite Ocean Mall entrance</p>
                </div>
              </div>
            </div>

            {/* Opening Hours Schedule Card */}
            <div className="bg-[#3A2418] text-[#FFF3DC] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#FFF3DC]/15">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#E6A93A]" />
                <h3 className="font-display font-black text-xl text-[#FFFAF0]">Opening Hours</h3>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between pb-2 border-b border-[#FFF3DC]/10">
                  <span className="text-[#FFF3DC]/70">Monday – Thursday</span>
                  <span className="font-bold text-[#FFFAF0]">11:00 AM – 12:00 AM</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#FFF3DC]/10">
                  <span className="text-[#FFF3DC]/70">Friday – Saturday</span>
                  <span className="font-bold text-[#E6A93A]">11:00 AM – 02:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FFF3DC]/70">Sunday</span>
                  <span className="font-bold text-[#FFFAF0]">12:00 PM – 12:00 AM</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Chat CTA */}
            <a
              href="https://wa.me/923001234567?text=Hi%20CrispyBites!%20I%20have%20an%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white p-4 rounded-3xl shadow-lg flex items-center justify-between transition-all duration-300 font-bold text-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 fill-white text-transparent" />
                <span>Instant WhatsApp Kitchen Chat</span>
              </div>
              <span>Open →</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
