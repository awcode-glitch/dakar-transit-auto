import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Plus, Search, ChevronDown, Pencil, RotateCcw, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { listVehicles, setVehicleSold, deleteVehicle } from "../../lib/vehicles";
import { COLORS, fmtPrice, fmtKm, type Vehicle } from "../../lib/shared";

type SortKey = "recent" | "prix-asc" | "prix-desc" | "marque";

export function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setVehicles(await listVehicles());
    } catch {
      setLoadError("Impossible de charger les véhicules. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = vehicles.filter(
      (v) => !q || `${v.marque} ${v.modele} ${v.provenance}`.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => {
      if (sort === "prix-asc") return (a.prix ?? Infinity) - (b.prix ?? Infinity);
      if (sort === "prix-desc") return (b.prix ?? 0) - (a.prix ?? 0);
      if (sort === "marque") return a.marque.localeCompare(b.marque);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [vehicles, query, sort]);

  const toggleSold = async (v: Vehicle) => {
    setPendingId(v.id);
    try {
      const updated = await setVehicleSold(v.id, !v.vendu);
      setVehicles((prev) => prev.map((x) => (x.id === v.id ? updated : x)));
      toast.success(
        updated.vendu
          ? `${updated.marque} ${updated.modele} marqué vendu.`
          : `${updated.marque} ${updated.modele} remis en vente.`
      );
    } catch {
      toast.error("Action impossible. Réessayez.");
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (v: Vehicle) => {
    if (!window.confirm(`Supprimer définitivement ${v.marque} ${v.modele} ? Cette action est irréversible.`)) {
      return;
    }
    setPendingId(v.id);
    try {
      await deleteVehicle(v.id);
      setVehicles((prev) => prev.filter((x) => x.id !== v.id));
      toast.success(`${v.marque} ${v.modele} supprimé.`);
    } catch {
      toast.error("Suppression impossible. Réessayez.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
            Véhicules
          </h1>
          <p className="text-sm" style={{ color: "#5A6B7D" }}>
            {vehicles.length} véhicule{vehicles.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link
          to="/admin/vehicules/nouveau"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm font-semibold text-sm text-white transition-opacity hover:opacity-90"
          style={{ background: COLORS.indigo, fontFamily: "var(--font-heading)" }}
        >
          <Plus size={16} /> Ajouter un véhicule
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#5A6B7D" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par marque, modèle, provenance…"
            className="w-full pl-9 pr-3 py-2.5 rounded-sm text-sm border outline-none"
            style={{ borderColor: "rgba(27,58,92,0.15)", background: "#fff", color: COLORS.nuit }}
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="pl-3 pr-8 py-2.5 rounded-sm border text-sm appearance-none w-full sm:w-auto"
            style={{ borderColor: "rgba(27,58,92,0.15)", background: "#fff", color: COLORS.nuit }}
          >
            <option value="recent">Plus récents</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="marque">Marque (A-Z)</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5A6B7D" }} />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center gap-2 text-sm" style={{ color: "#5A6B7D" }}>
          <Loader2 size={18} className="animate-spin" /> Chargement des véhicules…
        </div>
      ) : loadError ? (
        <div className="py-16 text-center rounded-sm border" style={{ borderColor: "rgba(220,60,60,0.3)", background: "#fff5f5" }}>
          <p className="text-sm mb-3" style={{ color: "#b23b3b" }}>{loadError}</p>
          <button onClick={load} className="text-sm underline" style={{ color: COLORS.indigo }}>
            Réessayer
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-sm border border-dashed" style={{ borderColor: "rgba(27,58,92,0.2)" }}>
          <p className="text-sm" style={{ color: "#5A6B7D" }}>Aucun véhicule ne correspond à cette recherche.</p>
        </div>
      ) : (
        <div className="rounded-sm border overflow-hidden bg-white" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
          {filtered.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-4 p-4 border-b last:border-b-0"
              style={{ borderColor: "rgba(27,58,92,0.08)" }}
            >
              <img
                src={v.photo}
                alt={`${v.marque} ${v.modele}`}
                loading="lazy"
                className="w-20 h-14 object-cover rounded-sm flex-shrink-0 bg-secondary"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm truncate" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
                    {v.marque} {v.modele}
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm font-semibold"
                    style={{ background: v.statut === "neuf" ? COLORS.vert : COLORS.indigo, color: "#fff" }}
                  >
                    {v.statut === "neuf" ? "Neuf" : "Occasion"}
                  </span>
                  {v.vendu && (
                    <span className="text-xs px-2 py-0.5 rounded-sm font-semibold" style={{ background: "#5A6B7D", color: "#fff" }}>
                      Vendu
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>
                  {v.annee} · {fmtKm(v.kilometrage)} · {v.provenance}
                </p>
              </div>
              <div
                className="text-sm font-bold flex-shrink-0 hidden sm:block"
                style={{ fontFamily: "var(--font-mono)", color: COLORS.indigo }}
              >
                {fmtPrice(v.prix)}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/admin/vehicules/${v.id}`}
                  className="p-2 rounded-sm border transition-colors hover:bg-secondary"
                  style={{ borderColor: "rgba(27,58,92,0.15)", color: COLORS.indigo }}
                  aria-label="Modifier"
                  title="Modifier"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => toggleSold(v)}
                  disabled={pendingId === v.id}
                  className="p-2 rounded-sm border transition-colors hover:bg-secondary disabled:opacity-50"
                  style={{ borderColor: "rgba(27,58,92,0.15)", color: v.vendu ? COLORS.vert : COLORS.ocre }}
                  aria-label={v.vendu ? "Remettre en vente" : "Marquer vendu"}
                  title={v.vendu ? "Remettre en vente" : "Marquer vendu"}
                >
                  {v.vendu ? <RotateCcw size={15} /> : <CheckCircle2 size={15} />}
                </button>
                <button
                  onClick={() => handleDelete(v)}
                  disabled={pendingId === v.id}
                  className="p-2 rounded-sm border transition-colors hover:bg-red-50 disabled:opacity-50"
                  style={{ borderColor: "rgba(220,60,60,0.3)", color: "#b23b3b" }}
                  aria-label="Supprimer"
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
