import { useState } from "react";
import { supabaseClient } from "../lib/supabaseClient";

function AdminLogin({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signInError) setError(signInError.message);
    // On success, the parent listens to onAuthStateChange and re-renders.
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-ink/5 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="font-display font-extrabold text-2xl text-ink">
            Admin <span className="text-chili">Login</span>
          </h1>
          <p className="text-ink/50 text-sm mt-1">
            Sign in to manage CrispyBites
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@crispybites.com"
              required
              className="w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
            />
          </div>

          {error && (
            <p className="text-chili text-xs font-medium -mt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-chili hover:bg-chili-dark disabled:opacity-60 transition-colors text-white font-semibold py-3 rounded-full text-sm mt-1"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full text-center text-sm font-semibold text-ink/50 hover:text-chili transition-colors mt-5"
        >
          ← Back to site
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
