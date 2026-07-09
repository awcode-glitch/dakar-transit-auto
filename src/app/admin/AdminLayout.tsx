import { Outlet, useNavigate, Link } from "react-router";
import { LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { COLORS } from "../../lib/shared";
import { Toaster } from "../components/ui/sonner";

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLORS.brume }}>
      <Toaster position="top-right" />
      <header className="sticky top-0 z-40" style={{ background: COLORS.indigo }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/admin/vehicules" className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
              style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-mono)" }}
            >
              DTA
            </div>
            <span className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Espace admin — Véhicules
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
