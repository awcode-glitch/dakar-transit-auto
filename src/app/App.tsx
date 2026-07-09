import { useState, useEffect } from "react";
import {
  Menu, X, MessageCircle, ArrowRight, Anchor,
  Wind, Truck, MapPin, Phone, Mail, ChevronLeft,
  Shield, Globe, CheckCircle, Package, Send,
  Car, Gauge, Calendar, ChevronDown, Loader2,
} from "lucide-react";
import { COLORS, wa, waVehicle, fmtPrice, fmtKm, hasPromo, type Vehicle } from "../lib/shared";
import { listVehicles } from "../lib/vehicles";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = "home" | "transit" | "vehicles" | "vehicle-detail" | "about" | "contact";

// ─── Shared Components ────────────────────────────────────────────────────────

function ProvenanceBadge({ from }: { from: string }) {
  return (
    <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-mono)", color: COLORS.ocre }}>
      <span className="text-muted-foreground">{from}</span>
      <svg width="52" height="12" viewBox="0 0 52 12" aria-hidden="true">
        <line x1="0" y1="6" x2="44" y2="6" stroke={COLORS.ocre} strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points="44,2 52,6 44,10" fill={COLORS.ocre} />
      </svg>
      <span style={{ color: COLORS.indigo, fontWeight: 600 }}>Dakar</span>
    </div>
  );
}

function SectionRouteLine() {
  return (
    <div className="flex items-center gap-3 py-6">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS.indigo }} />
      <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: COLORS.ocre + "60" }} />
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS.ocre }} />
    </div>
  );
}

// ─── Floating WhatsApp ────────────────────────────────────────────────────────

function FloatingWA() {
  return (
    <a
      href={wa("Bonjour, je vous contacte depuis votre site web.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl text-white text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
      style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
      aria-label="Nous contacter sur WhatsApp"
    >
      <MessageCircle size={20} strokeWidth={2.5} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

// ─── Header / Nav ─────────────────────────────────────────────────────────────

function Header({
  current,
  navigate,
}: {
  current: Page;
  navigate: (p: Page) => void;
}) {
  const [open, setOpen] = useState(false);
  const links: { label: string; page: Page }[] = [
    { label: "Accueil", page: "home" },
    { label: "Transit", page: "transit" },
    { label: "Véhicules", page: "vehicles" },
    { label: "À propos", page: "about" },
    { label: "Contact", page: "contact" },
  ];

  const go = (p: Page) => { navigate(p); setOpen(false); };

  return (
    <header className="sticky top-0 z-40 shadow-md" style={{ background: COLORS.indigo }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-3 focus:outline-none"
        >
          <div
            className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold tracking-widest"
            style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-mono)" }}
          >
            DTA
          </div>
          <span
            className="hidden sm:block text-sm font-semibold tracking-wide text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            DAKAR TRANSIT & AUTO
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => go(l.page)}
              className="text-sm font-medium transition-colors"
              style={{
                fontFamily: "var(--font-heading)",
                color: current === l.page ? COLORS.ocre : "rgba(255,255,255,0.8)",
                borderBottom: current === l.page ? `2px solid ${COLORS.ocre}` : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {l.label}
            </button>
          ))}
          <a
            href={wa("Bonjour, je souhaite vous contacter.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t" style={{ background: COLORS.nuit, borderColor: "rgba(255,255,255,0.1)" }}>
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => go(l.page)}
              className="w-full text-left px-6 py-4 text-sm font-medium border-b"
              style={{
                fontFamily: "var(--font-heading)",
                color: current === l.page ? COLORS.ocre : "rgba(255,255,255,0.85)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              {l.label}
            </button>
          ))}
          <a
            href={wa("Bonjour, je vous contacte depuis votre site web.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mx-6 my-4 px-4 py-3 rounded text-sm font-semibold text-white justify-center"
            style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
          >
            <MessageCircle size={16} />
            Écrire sur WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer style={{ background: COLORS.nuit }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold tracking-widest"
              style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-mono)" }}
            >
              DTA
            </div>
            <span className="text-white font-semibold tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
              DAKAR TRANSIT & AUTO
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Déclarante en douane à Dakar. Transit maritime, aérien et terrestre. Import et vente de véhicules. Un seul interlocuteur, de l'origine à votre porte.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Navigation</p>
          {(["home", "transit", "vehicles", "about", "contact"] as Page[]).map((p) => {
            const labels: Record<Page, string> = { home: "Accueil", transit: "Transit & Dédouanement", vehicles: "Vente de Véhicules", "vehicle-detail": "", about: "À propos", contact: "Contact" };
            return (
              <button
                key={p}
                onClick={() => navigate(p)}
                className="block text-sm py-1 text-left transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)" }}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Contact direct</p>
          <div className="space-y-3">
            <a
              href={wa("Bonjour, je vous contacte depuis votre site web.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm"
              style={{ color: "#25D366" }}
            >
              <MessageCircle size={15} />
              WhatsApp (canal principal)
            </a>
            <a href="tel:+221775208635" className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              <Phone size={15} />
              +221 77 520 86 35
            </a>
            <div className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              <MapPin size={15} className="mt-0.5 flex-shrink-0" />
              Rufisque, Dakar — Sénégal
            </div>
          </div>
        </div>
      </div>
      <div className="border-t max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}>
          © {new Date().getFullYear()} Dakar Transit & Auto — Déclarante en douane
        </p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}>
          Dakar · Sénégal · Transit maritime / aérien / terrestre
        </p>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HeroRouteLine() {
  return (
    <div className="relative flex items-center my-8 gap-3">
      <style>{`
        @keyframes expandRoute { from { width: 0; opacity: 0; } to { width: 100%; opacity: 1; } }
        .route-line { animation: expandRoute 2s ease-out 0.5s forwards; width: 0; opacity: 0; }
      `}</style>
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS.vert }} />
      <div className="flex-1 relative h-0.5 overflow-hidden">
        <div
          className="route-line absolute inset-y-0 left-0 border-t-2 border-dashed"
          style={{ borderColor: COLORS.ocre }}
        />
      </div>
      <div className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-semibold" style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-mono)" }}>
        Dakar
      </div>
    </div>
  );
}

function HomePage({
  navigate,
  vehicles,
  vehiclesLoading,
}: {
  navigate: (p: Page, v?: Vehicle, anchor?: string) => void;
  vehicles: Vehicle[];
  vehiclesLoading: boolean;
}) {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden"
        style={{ background: COLORS.nuit }}
      >
        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&h=900&fit=crop&auto=format"
          alt="Port de conteneurs"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <p
            className="inline-block text-xs tracking-widest uppercase mb-6 px-3 py-1.5 rounded-sm"
            style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}
          >
            DÉCLARANTE EN DOUANE · DAKAR, SÉNÉGAL
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4"
            style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}
          >
            De la douane de Dakar<br />jusqu'à votre porte —
          </h1>
          <p className="text-xl sm:text-2xl font-medium mb-2" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-heading)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            marchandises et véhicules, un seul interlocuteur.
          </p>

          <HeroRouteLine />

          {/* Two CTA blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => navigate("transit")}
              className="group relative rounded-sm p-6 text-left border transition-all hover:border-opacity-60"
              style={{ background: "rgba(27,58,92,0.6)", border: `1px solid rgba(255,255,255,0.15)` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Package size={20} style={{ color: COLORS.ocre }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Transit</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Transit & Dédouanement
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                Maritime · Aérien · Terrestre. Entreprises et particuliers.
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold" style={{ color: COLORS.ocre }}>
                Demander un devis <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate("vehicles")}
              className="group relative rounded-sm p-6 text-left border transition-all hover:border-opacity-60"
              style={{ background: "rgba(201,127,46,0.12)", border: `1px solid rgba(201,127,46,0.3)` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Car size={20} style={{ color: COLORS.ocre }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Véhicules</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Vente de Véhicules
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                Neufs & occasion. Import direct, maîtrisé de bout en bout.
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold" style={{ color: COLORS.ocre }}>
                Voir le catalogue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Trust tags */}
          <div className="flex flex-wrap gap-3 mt-8">
            {["Déclarante en douane", "Maritime · Aérien · Terrestre", "Réponse rapide sur WhatsApp"].map((t) => (
              <span key={t} className="text-xs px-3 py-1.5 rounded-sm" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section style={{ background: COLORS.indigo }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Shield size={20} />, label: "Statut professionnel", value: "Déclarante en douane" },
            { icon: <Anchor size={20} />, label: "Maritime", value: "Tous conteneurs" },
            { icon: <Wind size={20} />, label: "Aérien", value: "Fret express" },
            { icon: <Truck size={20} />, label: "Terrestre", value: "Sous-région ouest-africaine" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div style={{ color: COLORS.ocre }}>{item.icon}</div>
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)" }}>{item.label}</p>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services overview */}
      <section style={{ background: COLORS.blanc }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Nos services</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
              Transit & dédouanement, toutes voies
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "maritime",
                icon: <Anchor size={22} />,
                title: "Maritime",
                image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=600&h=400&fit=crop&auto=format",
                items: ["Dédouanement de conteneurs FCL et LCL", "Suivi des manifestes de fret", "Coordination avec le Port Autonome de Dakar", "Import et export toutes marchandises"],
              },
              {
                id: "aerien",
                icon: <Wind size={22} />,
                title: "Aérien",
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&auto=format",
                items: ["Traitement des envois express et cargo", "Formalités douanières à l'AIBD", "Délais courts, suivi en temps réel", "Marchandises fragiles et haute valeur"],
              },
              {
                id: "terrestre",
                icon: <Truck size={22} />,
                title: "Terrestre",
                image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop&auto=format",
                items: ["Transit vers la sous-région (Mali, Burkina, Niger, Guinée)", "Documents de transit communautaire", "Coordination avec les transporteurs agréés", "Dédouanement à destination"],
              },
            ].map((s) => (
              <div key={s.title} className="border rounded-sm overflow-hidden" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                <div className="relative h-40 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  <div
                    className="absolute top-3 left-3 w-10 h-10 rounded-sm flex items-center justify-center"
                    style={{ background: COLORS.indigo, color: "#fff" }}
                  >
                    {s.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>{s.title}</h3>
                  <ul className="space-y-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#4A5A6B" }}>
                        <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: COLORS.vert }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("transit", undefined, s.id)}
                    className="mt-5 text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                    style={{ color: COLORS.indigo, fontFamily: "var(--font-heading)" }}
                  >
                    En savoir plus <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <SectionRouteLine />
        </div>
      </section>

      {/* Vehicle preview */}
      <section style={{ background: COLORS.brume }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Catalogue</p>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
                Véhicules disponibles
              </h2>
            </div>
            <button
              onClick={() => navigate("vehicles")}
              className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: COLORS.indigo, fontFamily: "var(--font-heading)" }}
            >
              Voir tout le catalogue <ArrowRight size={16} />
            </button>
          </div>
          {vehiclesLoading ? (
            <div className="py-16 flex items-center justify-center gap-2 text-sm" style={{ color: "#5A6B7D" }}>
              <Loader2 size={18} className="animate-spin" /> Chargement du catalogue…
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.slice(0, 3).map((v) => (
              <VehicleCard key={v.id} vehicle={v} navigate={navigate} />
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Chiffres de confiance */}
      <section style={{ background: COLORS.blanc }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: "—", unit: "ans", label: "d'expérience" },
              { val: "—", unit: "dossiers", label: "dédouanés" },
              { val: "—", unit: "véhicules", label: "livrés" },
              { val: "4", unit: "pays", label: "de la sous-région" },
            ].map((c) => (
              <div key={c.label}>
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-mono)", color: COLORS.indigo }}>
                  {c.val} <span className="text-base font-medium" style={{ color: COLORS.ocre }}>{c.unit}</span>
                </div>
                <p className="text-sm" style={{ color: "#5A6B7D" }}>{c.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-6" style={{ color: "#A0AEC0", fontFamily: "var(--font-mono)" }}>
            Chiffres à compléter — structure prête
          </p>
        </div>
      </section>

      {/* WhatsApp CTA banner */}
      <section style={{ background: COLORS.indigo }} className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Contact direct</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Une question ? Réponse rapide sur WhatsApp.
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
            Transit, dédouanement, achat de véhicule — notre canal principal, disponible tous les jours.
          </p>
          <a
            href={wa("Bonjour, je vous contacte depuis votre site. Je souhaite plus d'informations.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-sm text-white font-bold text-base transition-opacity hover:opacity-90"
            style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
          >
            <MessageCircle size={22} />
            Écrire maintenant sur WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

// ─── VEHICLE CARD ─────────────────────────────────────────────────────────────

function VehicleCard({
  vehicle,
  navigate,
}: {
  vehicle: Vehicle;
  navigate: (p: Page, v?: Vehicle) => void;
}) {
  return (
    <div
      className="bg-card rounded-sm overflow-hidden border cursor-pointer group transition-shadow hover:shadow-lg"
      style={{ borderColor: "rgba(27,58,92,0.1)" }}
      onClick={() => navigate("vehicle-detail", vehicle)}
    >
      <div className="relative overflow-hidden h-48 bg-secondary">
        <img
          src={vehicle.photo}
          alt={`${vehicle.marque} ${vehicle.modele}`}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <span
          className="absolute top-3 left-3 text-xs px-2 py-1 rounded-sm font-semibold"
          style={{
            background: vehicle.statut === "neuf" ? COLORS.vert : COLORS.indigo,
            color: "#fff",
            fontFamily: "var(--font-mono)",
          }}
        >
          {vehicle.statut === "neuf" ? "Neuf" : "Occasion"}
        </span>
        {hasPromo(vehicle) && (
          <span
            className="absolute top-3 right-3 text-xs px-2 py-1 rounded-sm font-bold"
            style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-mono)" }}
          >
            PROMO
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
            {vehicle.marque} {vehicle.modele}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs mb-3" style={{ fontFamily: "var(--font-mono)", color: "#5A6B7D" }}>
          <span className="flex items-center gap-1"><Calendar size={11} />{vehicle.annee}</span>
          <span className="flex items-center gap-1"><Gauge size={11} />{fmtKm(vehicle.kilometrage)}</span>
        </div>
        <ProvenanceBadge from={vehicle.provenance} />
        <div className="mt-3 pt-3 border-t flex justify-between items-center" style={{ borderColor: "rgba(27,58,92,0.08)" }}>
          <div>
            {hasPromo(vehicle) && (
              <span
                className="block text-xs line-through"
                style={{ fontFamily: "var(--font-mono)", color: "#A0AEC0" }}
              >
                {fmtPrice(vehicle.prixBarre)}
              </span>
            )}
            <span
              className="font-bold text-base"
              style={{ fontFamily: "var(--font-mono)", color: vehicle.prix == null ? "#5A6B7D" : hasPromo(vehicle) ? COLORS.ocre : COLORS.indigo }}
            >
              {fmtPrice(vehicle.prix)}
            </span>
          </div>
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: COLORS.ocre }}>
            Détail <ArrowRight size={12} />
          </span>
        </div>
        <a
          href={waVehicle(vehicle)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#25D366" }}
        >
          <MessageCircle size={15} />
          Contacter
        </a>
      </div>
    </div>
  );
}

// ─── TRANSIT PAGE ─────────────────────────────────────────────────────────────

function TransitPage() {
  const [form, setForm] = useState({ type: "", origine: "", mode: "maritime", nom: "", contact: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Bonjour, je sollicite un devis pour le dédouanement de la marchandise suivante :\n\n• Type de marchandise : ${form.type}\n• Origine : ${form.origine}\n• Mode de transport : ${form.mode}\n• Nom : ${form.nom}\n• Contact : ${form.contact}\n\nMerci de revenir vers moi.`;
    window.open(wa(msg), "_blank");
    setSent(true);
  };

  return (
    <main>
      {/* Page hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: COLORS.indigo }}>
        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1400&h=500&fit=crop&auto=format"
          alt="Port de Dakar"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <p className="inline-block text-xs tracking-widest uppercase mb-4 px-3 py-1.5 rounded-sm" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}>
            SERVICES
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
            Transit &<br />Dédouanement
          </h1>
          <p className="text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            Marchandises importées ou exportées, par voie maritime, aérienne ou terrestre — nous gérons l'ensemble des formalités douanières pour votre compte.
          </p>
        </div>
      </section>

      {/* Statut encadré */}
      <section style={{ background: COLORS.brume }} className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-start gap-4 p-5 rounded-sm border-l-4" style={{ background: "#fff", borderLeftColor: COLORS.vert }}>
            <Shield size={20} className="mt-0.5 flex-shrink-0" style={{ color: COLORS.vert }} />
            <div>
              <p className="font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
                Déclarante en douane — statut professionnel reconnu
              </p>
              <p className="text-sm" style={{ color: "#5A6B7D" }}>
                En qualité de déclarante en douane, nous maîtrisons l'ensemble des procédures douanières sénégalaises et assurons un suivi rigoureux de chaque dossier — de la déclaration en détail jusqu'à la mainlevée. Votre marchandise est entre des mains professionnelles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services trois colonnes */}
      <section style={{ background: COLORS.blanc }} className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-widest uppercase mb-10" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Ce que nous faisons</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "maritime",
                icon: <Anchor size={32} />,
                title: "Maritime",
                detail: [
                  "Dédouanement de conteneurs FCL (plein) et LCL (groupage)",
                  "Traitement des déclarations en détail au Port de Dakar",
                  "Coordination avec les compagnies maritimes et consignataires",
                  "Import de tous types : matériaux, équipements, biens de consommation",
                  "Export marchandises toutes destinations",
                ],
              },
              {
                id: "aerien",
                icon: <Wind size={32} />,
                title: "Aérien",
                detail: [
                  "Prise en charge des formalités à l'AIBD (Aéroport Blaise Diagne)",
                  "Gestion des lettres de transport aérien (LTA)",
                  "Traitement express des envois urgents",
                  "Idéal pour marchandises fragiles, haute valeur ou délais contraints",
                ],
              },
              {
                id: "terrestre",
                icon: <Truck size={32} />,
                title: "Terrestre",
                detail: [
                  "Transit douanier vers Mali, Burkina Faso, Niger, Guinée",
                  "Documents de transit communautaire CEDEAO",
                  "Coordination avec les transporteurs routiers agréés",
                  "Dédouanement de bout en bout jusqu'à destination finale",
                ],
              },
            ].map((s) => (
              <div key={s.title} id={s.id} className="p-6 border rounded-sm scroll-mt-20" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                <div className="mb-4" style={{ color: COLORS.indigo }}>{s.icon}</div>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>{s.title}</h3>
                <ul className="space-y-3">
                  {s.detail.map((d) => (
                    <li key={d} className="text-sm flex items-start gap-2" style={{ color: "#4A5A6B" }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLORS.ocre }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <SectionRouteLine />
        </div>
      </section>

      {/* Zones desservies */}
      <section style={{ background: COLORS.brume }} className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Zones desservies</p>
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
            De Dakar vers toute la sous-région
          </h2>
          <div className="flex flex-wrap gap-3">
            {["Sénégal", "Mali", "Burkina Faso", "Niger", "Guinée", "Guinée-Bissau"].map((pays) => (
              <div key={pays} className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-white border text-sm font-medium" style={{ borderColor: "rgba(27,58,92,0.12)", color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
                <Globe size={14} style={{ color: COLORS.indigo }} />
                {pays}
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "#A0AEC0", fontFamily: "var(--font-mono)" }}>
            * Destinations à confirmer — liste indicative basée sur les flux habituels au départ du Port de Dakar
          </p>
        </div>
      </section>

      {/* Devis form */}
      <section style={{ background: COLORS.blanc }} className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Demande de devis</p>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
            Demandez votre devis transit
          </h2>
          <p className="text-sm mb-8" style={{ color: "#5A6B7D" }}>
            Remplissez ce formulaire — il s'ouvrira directement dans WhatsApp avec votre demande pré-remplie.
          </p>
          {sent ? (
            <div className="p-6 rounded-sm text-center border" style={{ borderColor: COLORS.vert, background: "#f0faf8" }}>
              <CheckCircle size={32} className="mx-auto mb-3" style={{ color: COLORS.vert }} />
              <p className="font-semibold" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Votre demande a été ouverte dans WhatsApp.</p>
              <p className="text-sm mt-1" style={{ color: "#5A6B7D" }}>Envoyez le message pour recevoir votre devis rapidement.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm underline" style={{ color: COLORS.indigo }}>Nouvelle demande</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: "Type de marchandise", key: "type", placeholder: "Ex : équipements électroniques, produits alimentaires…" },
                { label: "Origine (pays / ville)", key: "origine", placeholder: "Ex : Chine — Shanghai, France — Le Havre…" },
                { label: "Votre nom", key: "nom", placeholder: "Prénom et nom" },
                { label: "Téléphone ou email", key: "contact", placeholder: "+221 77 000 00 00" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    required
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-sm text-sm border outline-none focus:ring-2 transition"
                    style={{ borderColor: "rgba(27,58,92,0.2)", background: COLORS.brume, color: COLORS.nuit, fontFamily: "var(--font-body)" }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
                  Mode de transport
                </label>
                <div className="relative">
                  <select
                    value={form.mode}
                    onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}
                    className="w-full px-4 py-3 rounded-sm text-sm border outline-none appearance-none"
                    style={{ borderColor: "rgba(27,58,92,0.2)", background: COLORS.brume, color: COLORS.nuit, fontFamily: "var(--font-body)" }}
                  >
                    <option value="maritime">Maritime (conteneur)</option>
                    <option value="aérien">Aérien (cargo / express)</option>
                    <option value="terrestre">Terrestre (sous-région)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5A6B7D" }} />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
              >
                <MessageCircle size={20} />
                Envoyer via WhatsApp
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

// ─── VEHICLES PAGE ────────────────────────────────────────────────────────────

function VehiclesPage({
  navigate,
  vehicles,
  vehiclesLoading,
  vehiclesError,
  onRetry,
}: {
  navigate: (p: Page, v?: Vehicle) => void;
  vehicles: Vehicle[];
  vehiclesLoading: boolean;
  vehiclesError: string | null;
  onRetry: () => void;
}) {
  const [statut, setStatut] = useState<"tous" | "neuf" | "occasion">("tous");
  const [marque, setMarque] = useState("Toutes");
  const [orderBy, setOrderBy] = useState<"default" | "asc" | "desc">("default");
  const [orderForm, setOrderForm] = useState({ marque: "", modele: "", budget: "", delai: "", contact: "" });
  const [orderSent, setOrderSent] = useState(false);

  const marques = ["Toutes", ...Array.from(new Set(vehicles.map((v) => v.marque)))];

  const filtered = vehicles
    .filter((v) => statut === "tous" || v.statut === statut)
    .filter((v) => marque === "Toutes" || v.marque === marque)
    .sort((a, b) => {
      if (orderBy === "asc") return (a.prix ?? 999999999) - (b.prix ?? 999999999);
      if (orderBy === "desc") return (b.prix ?? 0) - (a.prix ?? 0);
      return 0;
    });

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Bonjour, je souhaite une importation de véhicule sur commande :\n\n• Marque / Modèle souhaité : ${orderForm.marque} ${orderForm.modele}\n• Budget indicatif : ${orderForm.budget}\n• Délai souhaité : ${orderForm.delai}\n• Contact : ${orderForm.contact}\n\nMerci de revenir vers moi.`;
    window.open(wa(msg), "_blank");
    setOrderSent(true);
  };

  return (
    <main>
      {/* Page hero */}
      <section className="relative py-16 overflow-hidden" style={{ background: COLORS.indigo }}>
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&h=500&fit=crop&auto=format"
          alt="Véhicules"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <p className="inline-block text-xs tracking-widest uppercase mb-4 px-3 py-1.5 rounded-sm" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}>CATALOGUE</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
            Vente de Véhicules
          </h1>
          <p className="text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            Véhicules neufs et d'occasion importés directement. Maîtrise de toute la chaîne — de l'origine à Dakar.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ background: COLORS.brume }} className="py-5 sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap gap-3 items-center">
          <div className="flex rounded-sm overflow-hidden border text-sm" style={{ borderColor: "rgba(27,58,92,0.15)" }}>
            {(["tous", "neuf", "occasion"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatut(s)}
                className="px-4 py-2 font-medium capitalize transition-colors"
                style={{
                  background: statut === s ? COLORS.indigo : "#fff",
                  color: statut === s ? "#fff" : COLORS.nuit,
                  fontFamily: "var(--font-heading)",
                }}
              >
                {s === "tous" ? "Tous" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-sm border text-sm appearance-none"
              style={{ borderColor: "rgba(27,58,92,0.15)", background: "#fff", color: COLORS.nuit, fontFamily: "var(--font-body)" }}
            >
              {marques.map((m) => <option key={m}>{m}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5A6B7D" }} />
          </div>

          <div className="relative">
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value as any)}
              className="pl-3 pr-8 py-2 rounded-sm border text-sm appearance-none"
              style={{ borderColor: "rgba(27,58,92,0.15)", background: "#fff", color: COLORS.nuit, fontFamily: "var(--font-body)" }}
            >
              <option value="default">Tri par défaut</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5A6B7D" }} />
          </div>

          <span className="text-sm ml-auto" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>
            {filtered.length} véhicule{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: COLORS.blanc }} className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {vehiclesLoading ? (
            <div className="py-20 flex items-center justify-center gap-2 text-sm" style={{ color: "#5A6B7D" }}>
              <Loader2 size={18} className="animate-spin" /> Chargement du catalogue…
            </div>
          ) : vehiclesError ? (
            <div className="text-center py-20 rounded-sm border" style={{ borderColor: "rgba(220,60,60,0.3)", background: "#fff5f5" }}>
              <p className="text-sm mb-3" style={{ color: "#b23b3b" }}>{vehiclesError}</p>
              <button onClick={onRetry} className="text-sm underline" style={{ color: COLORS.indigo }}>Réessayer</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: "#5A6B7D" }}>
              <Car size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium" style={{ fontFamily: "var(--font-heading)" }}>Aucun véhicule pour ces critères.</p>
              <button onClick={() => { setStatut("tous"); setMarque("Toutes"); }} className="mt-3 text-sm underline" style={{ color: COLORS.indigo }}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((v) => <VehicleCard key={v.id} vehicle={v} navigate={navigate} />)}
            </div>
          )}
        </div>
      </section>

      {/* Import sur commande */}
      <section style={{ background: COLORS.brume }} className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Import sur commande</p>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
            Le véhicule idéal n'est pas encore en stock ?
          </h2>
          <p className="text-sm mb-8" style={{ color: "#5A6B7D" }}>
            Nous pouvons sourcer et importer le véhicule exact que vous recherchez — avec la même maîtrise de la chaîne d'import que pour nos véhicules en stock.
          </p>
          {orderSent ? (
            <div className="p-6 rounded-sm text-center border" style={{ borderColor: COLORS.vert, background: "#f0faf8" }}>
              <CheckCircle size={32} className="mx-auto mb-3" style={{ color: COLORS.vert }} />
              <p className="font-semibold" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Votre demande a été ouverte dans WhatsApp.</p>
              <button onClick={() => setOrderSent(false)} className="mt-4 text-sm underline" style={{ color: COLORS.indigo }}>Nouvelle demande</button>
            </div>
          ) : (
            <form onSubmit={handleOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "marque", label: "Marque souhaitée", placeholder: "Ex : Toyota" },
                  { key: "modele", label: "Modèle souhaité", placeholder: "Ex : Prado" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      required
                      value={(orderForm as any)[f.key]}
                      onChange={(e) => setOrderForm((o) => ({ ...o, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-sm text-sm border"
                      style={{ borderColor: "rgba(27,58,92,0.2)", background: "#fff", color: COLORS.nuit }}
                    />
                  </div>
                ))}
              </div>
              {[
                { key: "budget", label: "Budget indicatif (FCFA)", placeholder: "Ex : 20 000 000 FCFA" },
                { key: "delai", label: "Délai souhaité", placeholder: "Ex : 3 mois" },
                { key: "contact", label: "Votre contact (WhatsApp ou email)", placeholder: "+221 77 …" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    required
                    value={(orderForm as any)[f.key]}
                    onChange={(e) => setOrderForm((o) => ({ ...o, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-sm text-sm border"
                    style={{ borderColor: "rgba(27,58,92,0.2)", background: "#fff", color: COLORS.nuit }}
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
              >
                <MessageCircle size={20} />
                Soumettre ma demande via WhatsApp
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

// ─── VEHICLE DETAIL PAGE ──────────────────────────────────────────────────────

function VehicleDetailPage({
  vehicle,
  navigate,
}: {
  vehicle: Vehicle;
  navigate: (p: Page) => void;
}) {
  return (
    <main className="py-10" style={{ background: COLORS.blanc }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <button
          onClick={() => navigate("vehicles")}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: COLORS.indigo, fontFamily: "var(--font-heading)" }}
        >
          <ChevronLeft size={16} />
          Retour au catalogue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Photo */}
          <div>
            <div className="rounded-sm overflow-hidden bg-secondary aspect-video">
              <img
                src={vehicle.photo}
                alt={`${vehicle.marque} ${vehicle.modele}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="text-xs px-3 py-1 rounded-sm font-semibold"
                style={{ background: vehicle.statut === "neuf" ? COLORS.vert : COLORS.indigo, color: "#fff", fontFamily: "var(--font-mono)" }}
              >
                {vehicle.statut === "neuf" ? "Neuf" : "Occasion"}
              </span>
              <ProvenanceBadge from={vehicle.provenance} />
              {hasPromo(vehicle) && (
                <span
                  className="text-xs px-3 py-1 rounded-sm font-bold"
                  style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-mono)" }}
                >
                  PROMO
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
              {vehicle.marque} {vehicle.modele}
            </h1>
            <p className="text-sm mb-6" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>
              {vehicle.annee} · {fmtKm(vehicle.kilometrage)}
            </p>

            {/* Price */}
            <div className="mb-6 p-4 rounded-sm border-l-4" style={{ background: COLORS.brume, borderLeftColor: COLORS.ocre }}>
              <p className="text-xs mb-1" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>Prix</p>
              {hasPromo(vehicle) && (
                <p className="text-sm line-through mb-0.5" style={{ fontFamily: "var(--font-mono)", color: "#A0AEC0" }}>
                  {fmtPrice(vehicle.prixBarre)}
                </p>
              )}
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-mono)", color: !vehicle.prix ? "#5A6B7D" : hasPromo(vehicle) ? COLORS.ocre : COLORS.nuit }}>
                {fmtPrice(vehicle.prix)}
              </p>
            </div>

            {/* Specs table */}
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Fiche technique</p>
              <div className="divide-y rounded-sm overflow-hidden border" style={{ borderColor: "rgba(27,58,92,0.1)", divideColor: "rgba(27,58,92,0.08)" }}>
                {Object.entries(vehicle.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between px-4 py-2.5 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: "#5A6B7D" }}>{key}</span>
                    <span style={{ color: COLORS.nuit, fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-8" style={{ color: "#4A5A6B" }}>{vehicle.description}</p>

            {/* CTA */}
            <a
              href={waVehicle(vehicle)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-sm font-bold text-white text-base transition-opacity hover:opacity-90"
              style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
            >
              <MessageCircle size={22} />
              Je suis intéressé(e) — Contacter sur WhatsApp
            </a>
            <p className="text-center text-xs mt-3" style={{ color: "#A0AEC0" }}>
              Le message sera pré-rempli avec les détails de ce véhicule.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

function AboutPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <main>
      <section className="relative min-h-[50vh] flex flex-col justify-center overflow-hidden" style={{ background: COLORS.indigo }}>
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&h=700&fit=crop&auto=format"
          alt="Partenariat professionnel"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <p className="inline-block text-xs tracking-widest uppercase mb-4 px-3 py-1.5 rounded-sm" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}>À PROPOS</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
            Un seul interlocuteur.<br />Toute la chaîne.
          </h1>
        </div>
      </section>

      <section style={{ background: COLORS.blanc }} className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Notre histoire</p>
            <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
              Née à Dakar, ancrée dans le commerce réel
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#4A5A6B" }}>
              <p>
                Dakar Transit & Auto est née d'un constat simple : les professionnels et particuliers qui importent des marchandises ou des véhicules font face à trop d'intermédiaires — et perdent le contrôle de leur dossier à chaque relais.
              </p>
              <p>
                Déclarante en douane opérant depuis Dakar, nous avons bâti notre activité sur la maîtrise directe des procédures douanières sénégalaises et la relation de confiance avec nos clients.
              </p>
              <p>
                L'activité véhicules est née naturellement : en gérant nous-mêmes le transit de nos propres imports, nous garantissons des délais prévisibles, une traçabilité complète — et aucun surcoût caché.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Notre différence</p>
            <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
              Pourquoi nous choisir
            </h2>
            <div className="space-y-4">
              {[
                { icon: <Shield size={18} />, title: "Maîtrise des procédures douanières", desc: "Déclarantes en douane — chaque dossier est suivi de la déclaration à la mainlevée." },
                { icon: <Globe size={18} />, title: "Chaîne d'import intégrée", desc: "Pour nos véhicules, nous gérons l'origine, le transport et le dédouanement sans sous-traitance." },
                { icon: <MessageCircle size={18} />, title: "Réponse rapide, contact direct", desc: "WhatsApp comme canal principal — vous parlez directement à la personne qui gère votre dossier." },
                { icon: <Truck size={18} />, title: "Couverture sous-régionale", desc: "Capacité à acheminer vos marchandises jusqu'à destination finale dans la sous-région." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-sm border" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                  <div className="mt-0.5 flex-shrink-0" style={{ color: COLORS.indigo }}>{item.icon}</div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>{item.title}</p>
                    <p className="text-sm" style={{ color: "#5A6B7D" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SectionRouteLine />

        {/* Testimonials placeholder */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Témoignages</p>
          <div className="p-6 rounded-sm border border-dashed text-center" style={{ borderColor: "rgba(27,58,92,0.2)" }}>
            <p className="text-sm" style={{ color: "#A0AEC0", fontFamily: "var(--font-mono)" }}>
              Espace réservé — les témoignages clients seront ajoutés ici dès disponibilité
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 text-center">
          <button
            onClick={() => navigate("contact")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: COLORS.indigo, fontFamily: "var(--font-heading)" }}
          >
            Nous contacter <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ nom: "", sujet: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Bonjour, je vous écris depuis votre site web.\n\nNom : ${form.nom}\nSujet : ${form.sujet}\n\n${form.message}`;
    window.open(wa(msg), "_blank");
    setSent(true);
  };

  return (
    <main>
      <section className="relative min-h-[45vh] flex flex-col justify-center overflow-hidden" style={{ background: COLORS.indigo }}>
        <img
          src="https://images.unsplash.com/photo-1560264357-8d9202250f21?w=1600&h=700&fit=crop&auto=format"
          alt="Équipe en action"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <p className="inline-block text-xs tracking-widest uppercase mb-4 px-3 py-1.5 rounded-sm" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}>CONTACT</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
            Contactez-nous
          </h1>
          <p className="text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            Notre canal principal est WhatsApp. C'est le moyen le plus rapide d'obtenir une réponse.
          </p>
        </div>
      </section>

      <section style={{ background: COLORS.blanc }} className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Contact info */}
          <div>
            {/* WhatsApp — primary */}
            <a
              href={wa("Bonjour, je vous contacte depuis votre site web.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-6 rounded-sm mb-5 transition-opacity hover:opacity-90 group"
              style={{ background: "#25D366" }}
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <MessageCircle size={28} style={{ color: "#25D366" }} />
              </div>
              <div>
                <p className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>WhatsApp</p>
                <p className="text-white text-sm" style={{ opacity: 0.85 }}>Canal principal — Réponse rapide</p>
                <p className="text-white text-sm font-semibold mt-1" style={{ fontFamily: "var(--font-mono)" }}>+221 77 520 86 35</p>
              </div>
            </a>

            {/* Other contacts */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-4 p-4 rounded-sm border" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                <Phone size={20} style={{ color: COLORS.indigo }} />
                <div>
                  <p className="text-xs" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>Téléphone</p>
                  <a href="tel:+221775208635" className="font-semibold text-sm" style={{ color: COLORS.nuit, fontFamily: "var(--font-mono)" }}>+221 77 520 86 35</a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-sm border" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                <Mail size={20} style={{ color: COLORS.indigo }} />
                <div>
                  <p className="text-xs" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>Email</p>
                  <a href="mailto:contact@dakartransitauto.sn" className="font-semibold text-sm" style={{ color: COLORS.nuit, fontFamily: "var(--font-mono)" }}>contact@dakartransitauto.sn</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-sm border" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                <MapPin size={20} className="mt-0.5" style={{ color: COLORS.indigo }} />
                <div>
                  <p className="text-xs" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>Adresse</p>
                  <p className="font-semibold text-sm" style={{ color: COLORS.nuit }}>Rufisque, Dakar — Sénégal</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-sm" style={{ background: COLORS.brume }}>
              <p className="text-xs" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>
                DÉCLARANTE EN DOUANE · SÉNÉGAL<br />
                Transit maritime · aérien · terrestre<br />
                Import & vente de véhicules
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>Formulaire de contact</p>
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
              Envoyez-nous un message
            </h2>
            {sent ? (
              <div className="p-6 rounded-sm text-center border" style={{ borderColor: COLORS.vert, background: "#f0faf8" }}>
                <CheckCircle size={32} className="mx-auto mb-3" style={{ color: COLORS.vert }} />
                <p className="font-semibold" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Votre message a été ouvert dans WhatsApp.</p>
                <button onClick={() => { setSent(false); setForm({ nom: "", sujet: "", message: "" }); }} className="mt-4 text-sm underline" style={{ color: COLORS.indigo }}>
                  Nouveau message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "nom", label: "Votre nom", placeholder: "Prénom et nom", type: "text" },
                  { key: "sujet", label: "Sujet", placeholder: "Transit, achat véhicule, autre…", type: "text" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      required
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-sm text-sm border outline-none transition"
                      style={{ borderColor: "rgba(27,58,92,0.2)", background: COLORS.brume, color: COLORS.nuit }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>Message</label>
                  <textarea
                    placeholder="Décrivez votre besoin…"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-sm text-sm border outline-none transition resize-none"
                    style={{ borderColor: "rgba(27,58,92,0.2)", background: COLORS.brume, color: COLORS.nuit }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
                >
                  <Send size={18} />
                  Envoyer via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  const loadVehicles = () => {
    setVehiclesLoading(true);
    setVehiclesError(null);
    listVehicles()
      .then((all) => setVehicles(all.filter((v) => !v.vendu)))
      .catch(() => setVehiclesError("Impossible de charger le catalogue. Vérifiez votre connexion et réessayez."))
      .finally(() => setVehiclesLoading(false));
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  const navigate = (p: Page, v?: Vehicle, anchor?: string) => {
    if (v) setSelectedVehicle(v);
    setPage(p);
    if (anchor) {
      setPendingAnchor(anchor);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!pendingAnchor) return;
    const id = requestAnimationFrame(() => {
      document.getElementById(pendingAnchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingAnchor(null);
    });
    return () => cancelAnimationFrame(id);
  }, [page, pendingAnchor]);

  useEffect(() => {
    const meta: Record<Page, { title: string; desc: string; keywords: string }> = {
      home: {
        title: "Dakar Transit & Auto — Transit, Dédouanement & Vente de Véhicules à Dakar",
        desc: "Déclarante en douane à Rufisque, Dakar. Transit maritime, aérien et terrestre. Import et vente de véhicules neufs et d'occasion. Réponse rapide sur WhatsApp.",
        keywords: "transitaire Dakar, dédouanement Sénégal, transit maritime Dakar, vente voiture Dakar, import véhicule Sénégal, déclarante en douane Rufisque",
      },
      transit: {
        title: "Transit & Dédouanement — Dakar Transit & Auto",
        desc: "Services de transit et dédouanement à Dakar : maritime, aérien, terrestre. Déclarante en douane professionnelle. Zones desservies : Sénégal, Mali, Burkina, Niger, Guinée.",
        keywords: "transit douane Dakar, dédouanement marchandises Sénégal, commissionnaire douane Dakar, transit conteneur port Dakar, fret maritime aérien Sénégal",
      },
      vehicles: {
        title: "Catalogue Véhicules — Import & Vente à Dakar | Dakar Transit & Auto",
        desc: "Achetez un véhicule neuf ou d'occasion importé directement à Dakar. Toyota, Mercedes, Hyundai, Peugeot et plus. Import sur commande disponible.",
        keywords: "vente voiture Dakar, achat véhicule Sénégal, importation voiture Dakar, Toyota occasion Dakar, Mercedes Sénégal, véhicule neuf Rufisque",
      },
      "vehicle-detail": {
        title: selectedVehicle ? `${selectedVehicle.marque} ${selectedVehicle.modele} ${selectedVehicle.annee} — Dakar Transit & Auto` : "Véhicule — DTA",
        desc: selectedVehicle ? `${selectedVehicle.marque} ${selectedVehicle.modele} ${selectedVehicle.annee}, ${selectedVehicle.statut}, importé depuis ${selectedVehicle.provenance}. ${fmtPrice(selectedVehicle.prix)}.` : "",
        keywords: "vente voiture Dakar, import véhicule Sénégal",
      },
      about: {
        title: "À propos — Dakar Transit & Auto | Rufisque, Sénégal",
        desc: "Dakar Transit & Auto, déclarante en douane basée à Rufisque. Transit et import de véhicules : une chaîne maîtrisée de bout en bout.",
        keywords: "à propos transit Dakar, déclarante douane Rufisque, entreprise transit Sénégal",
      },
      contact: {
        title: "Contact — Dakar Transit & Auto | WhatsApp +221 77 520 86 35",
        desc: "Contactez Dakar Transit & Auto sur WhatsApp au +221 77 520 86 35. Basés à Rufisque, Dakar. Réponse rapide pour toute demande de transit ou de véhicule.",
        keywords: "contact transitaire Dakar, WhatsApp transit Sénégal, téléphone dédouanement Dakar",
      },
    };

    const { title, desc, keywords } = meta[page];
    document.title = title;

    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.content = content;
    };

    setMeta("description", desc);
    setMeta("keywords", keywords);
    setMeta("og:title", title, true);
    setMeta("og:description", desc, true);
    setMeta("og:type", "website", true);
    setMeta("og:locale", "fr_SN", true);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
  }, [page, selectedVehicle]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLORS.blanc }}>
      <Header current={page} navigate={navigate} />

      <div className="flex-1">
        {page === "home" && (
          <HomePage navigate={navigate} vehicles={vehicles} vehiclesLoading={vehiclesLoading} />
        )}
        {page === "transit" && <TransitPage />}
        {page === "vehicles" && (
          <VehiclesPage
            navigate={navigate}
            vehicles={vehicles}
            vehiclesLoading={vehiclesLoading}
            vehiclesError={vehiclesError}
            onRetry={loadVehicles}
          />
        )}
        {page === "vehicle-detail" && selectedVehicle && (
          <VehicleDetailPage vehicle={selectedVehicle} navigate={navigate} />
        )}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "contact" && <ContactPage />}
      </div>

      <Footer navigate={navigate} />
      <FloatingWA />
    </div>
  );
}
