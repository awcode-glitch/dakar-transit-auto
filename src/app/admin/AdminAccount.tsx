import { useState } from "react";
import { Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabaseClient";
import { COLORS } from "../../lib/shared";

export function AdminAccount() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError("Impossible de changer le mot de passe. Réessayez.");
      return;
    }

    setPassword("");
    setConfirm("");
    toast.success("Mot de passe mis à jour.");
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
        Mon compte
      </h1>
      <p className="text-sm mb-6" style={{ color: "#5A6B7D" }}>
        Changer le mot de passe utilisé pour te connecter à l'admin.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-sm border bg-white" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
        {error && (
          <div role="alert" className="text-sm px-3 py-2 rounded-sm" style={{ background: "rgba(220,60,60,0.1)", color: "#b23b3b" }}>
            {error}
          </div>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
            <Lock size={14} /> Nouveau mot de passe
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6 caractères minimum"
            className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
            style={{ borderColor: "rgba(27,58,92,0.2)", background: "#fff", color: COLORS.nuit }}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
            <Lock size={14} /> Confirmer le mot de passe
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Retapez le mot de passe"
            className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
            style={{ borderColor: "rgba(27,58,92,0.2)", background: "#fff", color: COLORS.nuit }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-sm font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: COLORS.indigo, fontFamily: "var(--font-heading)" }}
        >
          <KeyRound size={16} />
          {submitting ? "Mise à jour…" : "Changer le mot de passe"}
        </button>
      </form>
    </div>
  );
}
