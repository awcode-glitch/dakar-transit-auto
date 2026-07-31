import type { Lang } from "./i18n";

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
  photos: string[];
  description: string;
  specs: Record<string, string>;
  createdAt: string;
}

export const WA_NUMBER = "221775208635";

export const wa = (msg: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

export const COLORS = {
  indigo: "#1B3A5C",
  nuit: "#101B2D",
  ocre: "#C97F2E",
  vert: "#3E7C6F",
  brume: "#EDF0F2",
  blanc: "#FAFAF8",
};

export const fmtPrice = (prix: number | null, lang: Lang = "fr") =>
  prix == null
    ? lang === "en" ? "Price on request" : "Prix sur demande"
    : prix.toLocaleString(lang === "en" ? "en-US" : "fr-FR") + " FCFA";

export const fmtKm = (km: number | null, lang: Lang = "fr") =>
  km == null
    ? lang === "en" ? "New — 0 km" : "Neuf — 0 km"
    : km.toLocaleString(lang === "en" ? "en-US" : "fr-FR") + " km";

export const hasPromo = (vehicle: Vehicle) =>
  vehicle.prix != null && vehicle.prixBarre != null && vehicle.prixBarre > vehicle.prix;
