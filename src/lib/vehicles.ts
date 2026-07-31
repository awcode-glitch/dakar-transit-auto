import { supabase, VEHICLE_PHOTOS_BUCKET } from "./supabaseClient";
import type { Vehicle } from "./shared";

interface VehicleRow {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number | null;
  prix: number | null;
  prix_barre: number | null;
  statut: "neuf" | "occasion";
  vendu: boolean;
  provenance: string;
  photo_url: string;
  photos: string[] | null;
  description: string;
  specs: Record<string, string>;
  created_at: string;
  sold_at: string | null;
}

export interface VehicleInput {
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number | null;
  prix: number | null;
  prixBarre: number | null;
  statut: "neuf" | "occasion";
  provenance: string;
  description: string;
  specs: Record<string, string>;
}

function fromRow(row: VehicleRow): Vehicle {
  const photos = row.photos && row.photos.length ? row.photos : row.photo_url ? [row.photo_url] : [];
  return {
    id: row.id,
    marque: row.marque,
    modele: row.modele,
    annee: row.annee,
    kilometrage: row.kilometrage,
    prix: row.prix,
    prixBarre: row.prix_barre,
    statut: row.statut,
    vendu: row.vendu,
    provenance: row.provenance,
    photo: photos[0] ?? row.photo_url,
    photos,
    description: row.description,
    specs: row.specs ?? {},
    createdAt: row.created_at,
  };
}

export async function listVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as VehicleRow[]).map(fromRow);
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as VehicleRow) : null;
}

export async function uploadVehiclePhoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(VEHICLE_PHOTOS_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(VEHICLE_PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createVehicle(
  input: VehicleInput,
  photoUrls: string[]
): Promise<Vehicle> {
  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      marque: input.marque,
      modele: input.modele,
      annee: input.annee,
      kilometrage: input.kilometrage,
      prix: input.prix,
      prix_barre: input.prixBarre,
      statut: input.statut,
      provenance: input.provenance,
      description: input.description,
      specs: input.specs,
      photo_url: photoUrls[0],
      photos: photoUrls,
      vendu: false,
    })
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data as VehicleRow);
}

export async function updateVehicle(
  id: string,
  input: VehicleInput,
  photoUrls?: string[]
): Promise<Vehicle> {
  const { data, error } = await supabase
    .from("vehicles")
    .update({
      marque: input.marque,
      modele: input.modele,
      annee: input.annee,
      kilometrage: input.kilometrage,
      prix: input.prix,
      prix_barre: input.prixBarre,
      statut: input.statut,
      provenance: input.provenance,
      description: input.description,
      specs: input.specs,
      ...(photoUrls ? { photo_url: photoUrls[0], photos: photoUrls } : {}),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data as VehicleRow);
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;
}

export async function setVehicleSold(id: string, vendu: boolean): Promise<Vehicle> {
  const { data, error } = await supabase
    .from("vehicles")
    .update({ vendu, sold_at: vendu ? new Date().toISOString() : null })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data as VehicleRow);
}
