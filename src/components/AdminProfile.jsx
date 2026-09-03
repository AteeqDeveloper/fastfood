import { useState } from "react";
import { User, ShieldCheck, Mail, Key, LogOut, ExternalLink, Calendar, Check } from "lucide-react";

export default function AdminProfile({ session, onSignOut, onBackToStorefront }) {
  const [copied, setCopied] = useState(false);
  const email = session?.user?.email || "admin@crispybites.com";
  const userId = session?.user?.id || "usr_session_active";
  const lastSignIn = session?.user?.last_sign_in_at
    ? new Date(session.user.last_sign_in_at).toLocaleString()
    : "Active current session";

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-2xl text-ink">Administrator Profile</h2>
        <p className="text-xs sm:text-sm text-ink/50 mt-0.5">
          Account details, active credentials, security authentication status, and session management.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-ink/5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chili to-turmeric text-white font-black text-2xl flex items-center justify-center shadow-md shadow-chili/25 shrink-0">
            {email[0]?.toUpperCase() || "A"}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-lg text-ink truncate">{email}</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-turmeric/20 text-charcoal font-bold text-[10px] border border-turmeric/30">
                <ShieldCheck className="w-3 h-3 text-turmeric" />
                Super Admin
              </span>
            </div>
            <p className="text-xs text-ink/50 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Verified Supabase Authentication</span>
            </p>
          </div>
        </div>

        {/* Account Metadata Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-cream/60">
            <p className="text-[10px] uppercase font-bold text-ink/40">User ID</p>
            <div className="flex items-center justify-between mt-1">
              <code className="text-xs font-mono font-semibold text-ink truncate max-w-[200px]">
                {userId}
              </code>
              <button
                onClick={handleCopyId}
                className="text-[11px] font-bold text-chili hover:underline flex items-center gap-1 ml-2"
              >
                {copied ? <Check className="w-3 h-3 text-basil" /> : "Copy"}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cream/60">
            <p className="text-[10px] uppercase font-bold text-ink/40">Last Login Timestamp</p>
            <p className="text-xs font-semibold text-ink mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-ink/40" />
              <span>{lastSignIn}</span>
            </p>
          </div>
        </div>

        {/* Security & Quick Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBackToStorefront}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cream hover:bg-cream/80 text-ink font-bold text-xs border border-ink/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-ink/60" />
            <span>Open Customer Storefront</span>
          </button>

          <button
            onClick={onSignOut}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Admin Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
