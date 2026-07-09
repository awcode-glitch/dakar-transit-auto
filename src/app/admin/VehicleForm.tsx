import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, ImagePlus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getVehicle, createVehicle, updateVehicle, type VehicleInput } from "../../lib/vehicles";
import { resizeImageFile } from "../../lib/image";
import { COLORS } from "../../lib/shared";

const CURRENT_YEAR = new Date().getFullYear();
const MAX_PHOTO_MB = 15;

interface SpecRow {
  key: string;
  value: string;
}

interface FormState {
  marque: string;
  modele: string;
  annee: string;
  statut: "neuf" | "occasion";
  neuf0km: boolean;
  kilometrage: string;
  prixSurDemande: boolean;
  prix: string;
  enPromo: boolean;
  prixBarre: string;
  provenance: string;
  description: string;
  specs: SpecRow[];
}

const emptyForm: FormState = {
  marque: "",
  modele: "",
  annee: String(CURRENT_YEAR),
  statut: "neuf",
  neuf0km: true,
  kilometrage: "",
  prixSurDemande: false,
  prix: "",
  enPromo: false,
  prixBarre: "",
  provenance: "",
  description: "",
  specs: [{ key: "", value: "" }],
};

function inputStyle() {
  return {
    borderColor: "rgba(27,58,92,0.2)",
    background: "#fff",
    color: COLORS.nuit,
  };
}

export function VehicleForm({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const vehicle = await getVehicle(id);
        if (!vehicle) {
          setLoadError("Ce véhicule est introuvable.");
          return;
        }
        setForm({
          marque: vehicle.marque,
          modele: vehicle.modele,
          annee: String(vehicle.annee),
          statut: vehicle.statut,
          neuf0km: vehicle.kilometrage == null,
          kilometrage: vehicle.kilometrage != null ? String(vehicle.kilometrage) : "",
          prixSurDemande: vehicle.prix == null,
          prix: vehicle.prix != null ? String(vehicle.prix) : "",
          enPromo: vehicle.prixBarre != null,
          prixBarre: vehicle.prixBarre != null ? String(vehicle.prixBarre) : "",
          provenance: vehicle.provenance,
          description: vehicle.description,
          specs: Object.entries(vehicle.specs).length
            ? Object.entries(vehicle.specs).map(([key, value]) => ({ key, value }))
            : [{ key: "", value: "" }],
        });
        setExistingPhoto(vehicle.photo);
      } catch {
        setLoadError("Impossible de charger ce véhicule. Vérifiez votre connexion et réessayez.");
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, photo: "Le fichier doit être une image (JPG, PNG, WebP…)." }));
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: `L'image dépasse ${MAX_PHOTO_MB } Mo. Choisissez une photo plus légère.` }));
      return;
    }

    setErrors((prev) => ({ ...prev, photo: "" }));
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    setForm((f) => ({
      ...f,
      specs: f.specs.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  const addSpecRow = () => setForm((f) => ({ ...f, specs: [...f.specs, { key: "", value: "" }] }));
  const removeSpecRow = (index: number) =>
    setForm((f) => ({ ...f, specs: f.specs.filter((_, i) => i !== index) }));

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!form.marque.trim()) errs.marque = "La marque est obligatoire.";
    if (!form.modele.trim()) errs.modele = "Le modèle est obligatoire.";

    const annee = Number(form.annee);
    if (!form.annee.trim() || Number.isNaN(annee)) {
      errs.annee = "L'année est obligatoire.";
    } else if (annee < 1990 || annee > CURRENT_YEAR + 1) {
      errs.annee = `L'année doit être comprise entre 1990 et ${CURRENT_YEAR + 1}.`;
    }

    if (!form.neuf0km) {
      const km = Number(form.kilometrage);
      if (!form.kilometrage.trim() || Number.isNaN(km) || km < 0) {
        errs.kilometrage = "Indiquez un kilométrage valide, ou cochez « Neuf — 0 km ».";
      }
    }

    if (!form.prixSurDemande) {
      const prix = Number(form.prix);
      if (!form.prix.trim() || Number.isNaN(prix) || prix <= 0) {
        errs.prix = "Indiquez un prix valide, ou cochez « Prix sur demande ».";
      }

      if (form.enPromo) {
        const prixBarre = Number(form.prixBarre);
        if (!form.prixBarre.trim() || Number.isNaN(prixBarre) || prixBarre <= 0) {
          errs.prixBarre = "Indiquez l'ancien prix.";
        } else if (!Number.isNaN(prix) && prixBarre <= prix) {
          errs.prixBarre = "L'ancien prix doit être supérieur au prix promo.";
        }
      }
    }

    if (!form.provenance.trim()) errs.provenance = "La provenance est obligatoire.";
    if (!form.description.trim()) errs.description = "La description est obligatoire.";
    else if (form.description.trim().length < 20)
      errs.description = "Ajoutez une description plus complète (20 caractères minimum).";

    if (mode === "create" && !photoFile) errs.photo = "Une photo est obligatoire pour un nouveau véhicule.";

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) {
      toast.error("Merci de corriger les champs en erreur avant d'enregistrer.");
      return;
    }

    setSubmitting(true);
    try {
      const specs: Record<string, string> = {};
      for (const row of form.specs) {
        if (row.key.trim() && row.value.trim()) specs[row.key.trim()] = row.value.trim();
      }

      const input: VehicleInput = {
        marque: form.marque.trim(),
        modele: form.modele.trim(),
        annee: Number(form.annee),
        kilometrage: form.neuf0km ? null : Number(form.kilometrage),
        prix: form.prixSurDemande ? null : Number(form.prix),
        prixBarre: form.prixSurDemande || !form.enPromo ? null : Number(form.prixBarre),
        statut: form.statut,
        provenance: form.provenance.trim(),
        description: form.description.trim(),
        specs,
      };

      const finalPhoto = photoFile ? await resizeImageFile(photoFile) : undefined;

      if (mode === "create") {
        if (!finalPhoto) throw new Error("Photo manquante");
        await createVehicle(input, finalPhoto);
        toast.success("Véhicule ajouté au catalogue.");
      } else if (id) {
        await updateVehicle(id, input, finalPhoto);
        toast.success("Véhicule mis à jour.");
      }

      navigate("/admin/vehicules");
    } catch {
      toast.error("Une erreur est survenue lors de l'enregistrement. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center gap-2 text-sm" style={{ color: "#5A6B7D" }}>
        <Loader2 size={18} className="animate-spin" /> Chargement…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-16 text-center rounded-sm border" style={{ borderColor: "rgba(220,60,60,0.3)", background: "#fff5f5" }}>
        <p className="text-sm mb-3" style={{ color: "#b23b3b" }}>{loadError}</p>
        <button onClick={() => navigate("/admin/vehicules")} className="text-sm underline" style={{ color: COLORS.indigo }}>
          Retour à la liste
        </button>
      </div>
    );
  }

  const displayedPhoto = photoPreview ?? existingPhoto;

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate("/admin/vehicules")}
        className="flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: COLORS.indigo, fontFamily: "var(--font-heading)" }}
      >
        <ChevronLeft size={16} /> Retour à la liste
      </button>

      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
        {mode === "create" ? "Ajouter un véhicule" : "Modifier le véhicule"}
      </h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Photo */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
            Photo du véhicule
          </label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-24 rounded-sm overflow-hidden bg-secondary border flex items-center justify-center flex-shrink-0" style={{ borderColor: "rgba(27,58,92,0.15)" }}>
              {displayedPhoto ? (
                <img src={displayedPhoto} alt="Aperçu" className="w-full h-full object-cover" />
              ) : (
                <ImagePlus size={24} style={{ color: "#A0AEC0" }} />
              )}
            </div>
            <div>
              <label
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-semibold cursor-pointer border transition-colors hover:bg-secondary"
                style={{ borderColor: "rgba(27,58,92,0.2)", color: COLORS.indigo }}
              >
                <ImagePlus size={15} />
                {existingPhoto || photoFile ? "Changer la photo" : "Choisir une photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
              <p className="text-xs mt-2" style={{ color: "#A0AEC0" }}>JPG, PNG ou WebP — redimensionnée automatiquement.</p>
            </div>
          </div>
          {errors.photo && <p className="text-xs mt-1.5" style={{ color: "#b23b3b" }}>{errors.photo}</p>}
        </div>

        {/* Marque / Modèle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Marque</label>
            <input
              type="text"
              value={form.marque}
              onChange={(e) => setForm((f) => ({ ...f, marque: e.target.value }))}
              placeholder="Ex : Toyota"
              className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
              style={inputStyle()}
            />
            {errors.marque && <p className="text-xs mt-1.5" style={{ color: "#b23b3b" }}>{errors.marque}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Modèle</label>
            <input
              type="text"
              value={form.modele}
              onChange={(e) => setForm((f) => ({ ...f, modele: e.target.value }))}
              placeholder="Ex : Land Cruiser 300"
              className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
              style={inputStyle()}
            />
            {errors.modele && <p className="text-xs mt-1.5" style={{ color: "#b23b3b" }}>{errors.modele}</p>}
          </div>
        </div>

        {/* Année / Statut */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Année</label>
            <input
              type="number"
              value={form.annee}
              onChange={(e) => setForm((f) => ({ ...f, annee: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
              style={inputStyle()}
            />
            {errors.annee && <p className="text-xs mt-1.5" style={{ color: "#b23b3b" }}>{errors.annee}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Statut</label>
            <select
              value={form.statut}
              onChange={(e) => setForm((f) => ({ ...f, statut: e.target.value as "neuf" | "occasion" }))}
              className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
              style={inputStyle()}
            >
              <option value="neuf">Neuf</option>
              <option value="occasion">Occasion</option>
            </select>
          </div>
        </div>

        {/* Kilométrage */}
        <div>
          <label className="flex items-center gap-2 text-sm mb-2" style={{ color: COLORS.nuit }}>
            <input
              type="checkbox"
              checked={form.neuf0km}
              onChange={(e) => setForm((f) => ({ ...f, neuf0km: e.target.checked }))}
            />
            Véhicule neuf — 0 km
          </label>
          {!form.neuf0km && (
            <>
              <input
                type="number"
                min={0}
                value={form.kilometrage}
                onChange={(e) => setForm((f) => ({ ...f, kilometrage: e.target.value }))}
                placeholder="Ex : 28000"
                className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
                style={inputStyle()}
              />
              {errors.kilometrage && <p className="text-xs mt-1.5" style={{ color: "#b23b3b" }}>{errors.kilometrage}</p>}
            </>
          )}
        </div>

        {/* Prix */}
        <div>
          <label className="flex items-center gap-2 text-sm mb-2" style={{ color: COLORS.nuit }}>
            <input
              type="checkbox"
              checked={form.prixSurDemande}
              onChange={(e) => setForm((f) => ({ ...f, prixSurDemande: e.target.checked }))}
            />
            Prix sur demande
          </label>
          {!form.prixSurDemande && (
            <>
              <input
                type="number"
                min={0}
                value={form.prix}
                onChange={(e) => setForm((f) => ({ ...f, prix: e.target.value }))}
                placeholder="Ex : 25000000"
                className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
                style={inputStyle()}
              />
              {errors.prix && <p className="text-xs mt-1.5" style={{ color: "#b23b3b" }}>{errors.prix}</p>}

              <label className="flex items-center gap-2 text-sm mt-4 mb-2" style={{ color: COLORS.nuit }}>
                <input
                  type="checkbox"
                  checked={form.enPromo}
                  onChange={(e) => setForm((f) => ({ ...f, enPromo: e.target.checked }))}
                />
                En promotion (afficher un ancien prix barré)
              </label>
              {form.enPromo && (
                <>
                  <input
                    type="number"
                    min={0}
                    value={form.prixBarre}
                    onChange={(e) => setForm((f) => ({ ...f, prixBarre: e.target.value }))}
                    placeholder="Ancien prix, ex : 30000000"
                    className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
                    style={inputStyle()}
                  />
                  {errors.prixBarre && <p className="text-xs mt-1.5" style={{ color: "#b23b3b" }}>{errors.prixBarre}</p>}
                </>
              )}
            </>
          )}
        </div>

        {/* Provenance */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Provenance</label>
          <input
            type="text"
            value={form.provenance}
            onChange={(e) => setForm((f) => ({ ...f, provenance: e.target.value }))}
            placeholder="Ex : Émirats arabes unis"
            className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none"
            style={inputStyle()}
          />
          {errors.provenance && <p className="text-xs mt-1.5" style={{ color: "#b23b3b" }}>{errors.provenance}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Décrivez le véhicule : équipements, état, historique…"
            className="w-full px-3 py-2.5 rounded-sm text-sm border outline-none resize-none"
            style={inputStyle()}
          />
          {errors.description && <p className="text-xs mt-1.5" style={{ color: "#b23b3b" }}>{errors.description}</p>}
        </div>

        {/* Specs */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
            Fiche technique (optionnel)
          </label>
          <div className="space-y-2">
            {form.specs.map((row, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2">
                <div className="flex gap-2 flex-1">
                  <input
                    type="text"
                    value={row.key}
                    onChange={(e) => updateSpec(i, "key", e.target.value)}
                    placeholder="Ex : Moteur"
                    className="flex-1 min-w-0 px-3 py-2 rounded-sm text-sm border outline-none"
                    style={inputStyle()}
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                    placeholder="Ex : V6 3.5L Twin-Turbo"
                    className="flex-1 min-w-0 px-3 py-2 rounded-sm text-sm border outline-none"
                    style={inputStyle()}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSpecRow(i)}
                  className="p-2 rounded-sm border transition-colors hover:bg-secondary flex-shrink-0 self-start"
                  style={{ borderColor: "rgba(27,58,92,0.15)", color: "#b23b3b" }}
                  aria-label="Supprimer cette ligne"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSpecRow}
            className="mt-2 flex items-center gap-1.5 text-sm font-medium"
            style={{ color: COLORS.indigo }}
          >
            <Plus size={14} /> Ajouter une caractéristique
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: COLORS.indigo, fontFamily: "var(--font-heading)" }}
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {mode === "create" ? "Ajouter le véhicule" : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
