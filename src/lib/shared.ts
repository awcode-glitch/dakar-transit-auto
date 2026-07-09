export interface Vehicle {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number | null;
  prix: number | null;
  prixBarre: number | null;
  statut: "neuf" | "occasion";
  vendu: boolean;
  provenance: string;
  photo: string;
  description: string;
  specs: Record<string, string>;
  createdAt: string;
}

export const WA_NUMBER = "221775208635";

export const wa = (msg: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

export const waVehicle = (vehicle: Vehicle) =>
  wa(
    `Bonjour, je suis intéressé(e) par le ${vehicle.marque} ${vehicle.modele} ${vehicle.annee}${
      vehicle.prix ? ` à ${vehicle.prix.toLocaleString("fr-FR")} FCFA` : ""
    } vu sur votre site. Pouvez-vous me donner plus d'informations ?`
  );

export const COLORS = {
  indigo: "#1B3A5C",
  nuit: "#101B2D",
  ocre: "#C97F2E",
  vert: "#3E7C6F",
  brume: "#EDF0F2",
  blanc: "#FAFAF8",
};

export const fmtPrice = (prix: number | null) =>
  prix == null ? "Prix sur demande" : prix.toLocaleString("fr-FR") + " FCFA";

export const fmtKm = (km: number | null) =>
  km == null ? "Neuf — 0 km" : km.toLocaleString("fr-FR") + " km";

export const hasPromo = (vehicle: Vehicle) =>
  vehicle.prix != null && vehicle.prixBarre != null && vehicle.prixBarre > vehicle.prix;
