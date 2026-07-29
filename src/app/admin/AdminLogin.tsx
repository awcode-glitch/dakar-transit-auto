import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Mail, LogIn, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { COLORS } from "../../lib/shared";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : "Connexion impossible. Vérifiez votre connexion et réessayez."
      );
      return;
    }

    navigate("/admin/vehicules", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.nuit }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded flex items-center justify-center text-sm font-bold tracking-widest mx-auto mb-4"
            style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-mono)" }}
          >
            TLI
          </div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Espace administrateur
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            Transit Logistic International
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 p-6 rounded-sm"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {error && (
            <div
              role="alert"
              className="text-sm px-3 py-2 rounded-sm"
              style={{ background: "rgba(220,60,60,0.15)", color: "#ff9b9b" }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-email"
              className="flex items-center gap-2 text-xs font-medium mb-1.5 uppercase tracking-wide"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <Mail size={13} /> Nom d'utilisateur ou email
            </label>
            <input
              id="admin-email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-sm text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              placeholder="ton.email@exemple.sn"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="flex items-center gap-2 text-xs font-medium mb-1.5 uppercase tracking-wide"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <Lock size={13} /> Mot de passe
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 rounded-sm text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(255,255,255,0.6)" }}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-sm font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-heading)" }}
          >
            <LogIn size={16} />
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
