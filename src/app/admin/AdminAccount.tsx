import { useEffect, useState } from "react";
import { Lock, KeyRound, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabaseClient";
import { COLORS } from "../../lib/shared";

export function AdminAccount() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentEmail(data.user?.email ?? null);
    });
  }, []);

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    const trimmed = newEmail.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setEmailError("Indiquez une adresse email valide.");
      return;
    }
    if (trimmed === currentEmail) {
      setEmailError("Cette adresse est déjà celle utilisée.");
      return;
    }

    setEmailSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ email: trimmed });
    setEmailSubmitting(false);

    if (updateError) {
      setEmailError(`Impossible de changer l'email : ${updateError.message}`);
      return;
    }

    setNewEmail("");
    toast.success("Vérifie ta boîte mail : un lien de confirmation a été envoyé à la nouvelle adresse.");
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
        Mon compte
      </h1>
      <p className="text-sm mb-6" style={{ color: "#5A6B7D" }}>
        Gérer l'email et le mot de passe utilisés pour te connecter à l'admin.
      </p>

      <form onSubmit={handleEmailSubmit} className="space-y-4 p-6 rounded-sm border bg-white mb-6" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
        {emailError && (
          <div role="alert" className="text-sm px-3 py-2 rounded-sm" style={{ background: "rgba(220,60,60,0.1)", color: "#b23b3b" }}>
            {emailError}
          </div>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
            <Mail size={14} /> Email actuel
          </label>
          <input
            type="email"
            value={currentEmail ?? "…"}
            disabled
            className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none opacity-60"
            style={{ borderColor: "rgba(27,58,92,0.2)", background: "#fff", color: COLORS.nuit }}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
            <Mail size={14} /> Nouvel email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="nouvelle.adresse@exemple.sn"
            className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
            style={{ borderColor: "rgba(27,58,92,0.2)", background: "#fff", color: COLORS.nuit }}
          />
        </div>

        <button
          type="submit"
          disabled={emailSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-sm font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: COLORS.indigo, fontFamily: "var(--font-heading)" }}
        >
          <Mail size={16} />
          {emailSubmitting ? "Envoi…" : "Changer l'email"}
        </button>
      </form>

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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              className="w-full px-3 py-2.5 pr-10 rounded-sm text-sm border outline-none"
              style={{ borderColor: "rgba(27,58,92,0.2)", background: "#fff", color: COLORS.nuit }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#5A6B7D" }}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
            <Lock size={14} /> Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Retapez le mot de passe"
              className="w-full px-3 py-2.5 pr-10 rounded-sm text-sm border outline-none"
              style={{ borderColor: "rgba(27,58,92,0.2)", background: "#fff", color: COLORS.nuit }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#5A6B7D" }}
              aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
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
