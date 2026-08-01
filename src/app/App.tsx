import { useState, useEffect } from "react";
import {
  Menu, X, MessageCircle, ArrowRight, Anchor,
  Wind, Truck, MapPin, Phone, Mail, ChevronLeft,
  Shield, Globe, CheckCircle, Package, Send,
  Car, Gauge, Calendar, ChevronDown, Loader2,
} from "lucide-react";
import { COLORS, wa, fmtPrice, fmtKm, hasPromo, type Vehicle } from "../lib/shared";
import { listVehicles } from "../lib/vehicles";
import { LangProvider, useLang } from "../lib/LangContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = "home" | "transit" | "vehicles" | "vehicle-detail" | "about" | "contact";

// ─── Shared Components ────────────────────────────────────────────────────────

function ProvenanceBadge({ from }: { from: string }) {
  if (!from.trim()) return null;
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

// ─── Floating WhatsApp ────────────────────────────────────────────────────────

function FloatingWA() {
  const { t, lang } = useLang();
  return (
    <a
      href={wa(t.wa.generic)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl text-white text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
      style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
      aria-label={lang === "en" ? "Contact us on WhatsApp" : "Nous contacter sur WhatsApp"}
    >
      <MessageCircle size={20} strokeWidth={2.5} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

// ─── Header / Nav ─────────────────────────────────────────────────────────────

function LangSwitch({ compact }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className="flex items-center rounded-sm overflow-hidden text-xs font-bold"
      style={{ border: "1px solid rgba(255,255,255,0.25)", fontFamily: "var(--font-mono)" }}
    >
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={compact ? "px-2 py-1.5" : "px-2.5 py-1"}
          style={{
            background: lang === l ? COLORS.ocre : "transparent",
            color: lang === l ? "#fff" : "rgba(255,255,255,0.7)",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Header({
  current,
  navigate,
}: {
  current: Page;
  navigate: (p: Page) => void;
}) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const links: { label: string; page: Page }[] = [
    { label: t.nav.home, page: "home" },
    { label: t.nav.transit, page: "transit" },
    { label: t.nav.vehicles, page: "vehicles" },
    { label: t.nav.about, page: "about" },
    { label: t.nav.contact, page: "contact" },
  ];

  const go = (p: Page) => { navigate(p); setOpen(false); };

  return (
    <header
      className="sticky top-0 z-40 shadow-md"
      style={{ background: COLORS.indigo }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-3 focus:outline-none"
        >
          <span
            className="text-xs sm:text-sm font-semibold tracking-wide text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            TRANSIT LOGISTIC INTERNATIONAL
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
          <LangSwitch />
          <a
            href={wa(t.wa.generic2)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
          >
            <MessageCircle size={16} />
            {t.nav.whatsapp}
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
          <div className="px-6 py-4">
            <LangSwitch compact />
          </div>
          <a
            href={wa(t.wa.generic)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mx-6 my-4 px-4 py-3 rounded text-sm font-semibold text-white justify-center"
            style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
          >
            <MessageCircle size={16} />
            {t.nav.writeOnWhatsapp}
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ navigate }: { navigate: (p: Page) => void }) {
  const { t } = useLang();
  return (
    <footer style={{ background: COLORS.nuit }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
              TRANSIT LOGISTIC INTERNATIONAL
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            {t.footer.tagline}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.footer.navTitle}</p>
          {(["home", "transit", "vehicles", "about", "contact"] as Page[]).map((p) => {
            const labels: Record<Page, string> = { ...t.footer.navLabels, "vehicle-detail": "" };
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
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.footer.contactTitle}</p>
          <div className="space-y-3">
            <a
              href={wa(t.wa.generic)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm"
              style={{ color: "#25D366" }}
            >
              <MessageCircle size={15} />
              {t.footer.whatsappPrimary}
            </a>
            <a href="tel:+221775208635" className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              <Phone size={15} />
              +221 77 520 86 35
            </a>
            <div className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              <MapPin size={15} className="mt-0.5 flex-shrink-0" />
              {t.footer.address}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}>
          {t.footer.copyright(new Date().getFullYear())}
        </p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}>
          {t.footer.tagLine}
        </p>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage({
  navigate,
  vehicles,
  vehiclesLoading,
}: {
  navigate: (p: Page, v?: Vehicle, anchor?: string) => void;
  vehicles: Vehicle[];
  vehiclesLoading: boolean;
}) {
  const { t } = useLang();
  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-[42vh] flex flex-col justify-center overflow-hidden"
        style={{ background: COLORS.nuit }}
      >
        <img
          src="https://images.unsplash.com/photo-1751091764788-75cc6a39e9c6?w=1600&h=900&fit=crop&auto=format"
          alt="Port de conteneurs"
          className="absolute inset-x-0 top-0 h-[38vh] sm:h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <p
            className="inline-block text-xs tracking-widest uppercase mb-6 px-3 py-1.5 rounded-sm"
            style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}
          >
            {t.hero.badge}
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4"
            style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}
          >
            {t.hero.titleLine1}<br />{t.hero.titleLine2}
          </h1>
          <p className="text-xl sm:text-2xl font-medium mb-2" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-heading)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            {t.hero.subtitle}
          </p>

          {/* Two CTA blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => navigate("transit", undefined, "devis")}
              className="group relative rounded-sm p-6 text-left border transition-all hover:border-opacity-60"
              style={{ background: "rgba(27,58,92,0.6)", border: `1px solid rgba(255,255,255,0.15)` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Package size={20} style={{ color: COLORS.ocre }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.hero.transitLabel}</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                {t.hero.transitTitle}
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t.hero.transitDesc}
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold" style={{ color: COLORS.ocre }}>
                {t.hero.transitCta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate("vehicles")}
              className="group relative rounded-sm p-6 text-left border transition-all hover:border-opacity-60"
              style={{ background: "rgba(201,127,46,0.12)", border: `1px solid rgba(201,127,46,0.3)` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Car size={20} style={{ color: COLORS.ocre }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.hero.vehiclesLabel}</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                {t.hero.vehiclesTitle}
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t.hero.vehiclesDesc}
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold" style={{ color: COLORS.ocre }}>
                {t.hero.vehiclesCta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Trust tags */}
          <div className="flex flex-wrap gap-3 mt-8">
            {t.hero.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-sm" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section style={{ background: "#fff", borderBottom: "1px solid rgba(16,27,45,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Shield size={20} />, ...t.trustBand[0] },
            { icon: <Anchor size={20} />, ...t.trustBand[1] },
            { icon: <Wind size={20} />, ...t.trustBand[2] },
            { icon: <Truck size={20} />, ...t.trustBand[3] },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div style={{ color: COLORS.ocre }}>{item.icon}</div>
              <div>
                <p className="text-xs" style={{ color: "rgba(16,27,45,0.55)", fontFamily: "var(--font-mono)" }}>{item.label}</p>
                <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services overview */}
      <section style={{ background: COLORS.blanc }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.services.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
              {t.services.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "maritime",
                icon: <Anchor size={22} />,
                image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=600&h=400&fit=crop&auto=format",
                ...t.services.maritime,
              },
              {
                id: "aerien",
                icon: <Wind size={22} />,
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&auto=format",
                ...t.services.aerien,
              },
              {
                id: "terrestre",
                icon: <Truck size={22} />,
                image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop&auto=format",
                ...t.services.terrestre,
              },
            ].map((s) => (
              <div key={s.id} className="border rounded-sm overflow-hidden" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
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
                    {t.services.learnMore} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle preview */}
      <section style={{ background: COLORS.brume }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.vehiclePreview.eyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
                {t.vehiclePreview.title}
              </h2>
            </div>
            <button
              onClick={() => navigate("vehicles")}
              className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: COLORS.indigo, fontFamily: "var(--font-heading)" }}
            >
              {t.vehiclePreview.viewAll} <ArrowRight size={16} />
            </button>
          </div>
          {vehiclesLoading ? (
            <div className="py-16 flex items-center justify-center gap-2 text-sm" style={{ color: "#5A6B7D" }}>
              <Loader2 size={18} className="animate-spin" /> {t.vehiclePreview.loading}
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
            {t.stats.items.map((c) => (
              <div key={c.label}>
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-mono)", color: COLORS.indigo }}>
                  {c.val} <span className="text-base font-medium" style={{ color: COLORS.ocre }}>{c.unit}</span>
                </div>
                <p className="text-sm" style={{ color: "#5A6B7D" }}>{c.label}</p>
              </div>
            ))}
          </div>
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
  const { t, lang } = useLang();
  const priceSuffix = vehicle.prix
    ? t.wa.vehiclePriceSuffix(vehicle.prix.toLocaleString(lang === "en" ? "en-US" : "fr-FR"))
    : "";
  const waHref = wa(t.wa.vehicle(vehicle.marque, vehicle.modele, vehicle.annee, priceSuffix));

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
        {vehicle.statut && (
          <span
            className="absolute top-3 left-3 text-xs px-2 py-1 rounded-sm font-semibold"
            style={{
              background: vehicle.statut === "neuf" ? COLORS.vert : COLORS.indigo,
              color: "#fff",
              fontFamily: "var(--font-mono)",
            }}
          >
            {vehicle.statut === "neuf" ? t.vehicleCard.neuf : t.vehicleCard.occasion}
          </span>
        )}
        {hasPromo(vehicle) && (
          <span
            className="absolute top-3 right-3 text-xs px-2 py-1 rounded-sm font-bold"
            style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-mono)" }}
          >
            {t.vehicleCard.promo}
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
          <span className="flex items-center gap-1"><Gauge size={11} />{fmtKm(vehicle.kilometrage, lang)}</span>
        </div>
        <ProvenanceBadge from={vehicle.provenance} />
        <div className="mt-3 pt-3 border-t flex justify-between items-center" style={{ borderColor: "rgba(27,58,92,0.08)" }}>
          <div>
            {hasPromo(vehicle) && (
              <span
                className="block text-xs line-through"
                style={{ fontFamily: "var(--font-mono)", color: "#A0AEC0" }}
              >
                {fmtPrice(vehicle.prixBarre, lang)}
              </span>
            )}
            <span
              className="font-bold text-base"
              style={{ fontFamily: "var(--font-mono)", color: vehicle.prix == null ? "#5A6B7D" : hasPromo(vehicle) ? COLORS.ocre : COLORS.indigo }}
            >
              {fmtPrice(vehicle.prix, lang)}
            </span>
          </div>
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: COLORS.ocre }}>
            {t.vehicleCard.detail} <ArrowRight size={12} />
          </span>
        </div>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#25D366" }}
        >
          <MessageCircle size={15} />
          {t.vehicleCard.contact}
        </a>
      </div>
    </div>
  );
}

// ─── TRANSIT PAGE ─────────────────────────────────────────────────────────────

function TransitPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ type: "", origine: "", mode: "maritime", nom: "", contact: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const modeLabel = form.mode === "maritime" ? t.transitPage.devisForm.modeMaritime : form.mode === "aérien" ? t.transitPage.devisForm.modeAerien : t.transitPage.devisForm.modeTerrestre;
    const msg = t.wa.devis(form.type, form.origine, modeLabel, form.nom, form.contact);
    window.open(wa(msg), "_blank");
    setSent(true);
  };

  const services = [
    { id: "maritime", icon: <Anchor size={32} />, ...t.transitPage.whatWeDo.maritime },
    { id: "aerien", icon: <Wind size={32} />, ...t.transitPage.whatWeDo.aerien },
    { id: "terrestre", icon: <Truck size={32} />, ...t.transitPage.whatWeDo.terrestre },
  ];

  return (
    <main>
      {/* Page hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: COLORS.indigo }}>
        <img
          src="https://images.unsplash.com/photo-1751091764788-75cc6a39e9c6?w=1400&h=500&fit=crop&auto=format"
          alt="Port de Dakar"
          className="absolute inset-x-0 top-0 h-[45vh] sm:h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <p className="inline-block text-xs tracking-widest uppercase mb-4 px-3 py-1.5 rounded-sm" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}>
            {t.transitPage.hero.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
            {t.transitPage.hero.titleLine1}<br />{t.transitPage.hero.titleLine2}
          </h1>
          <p className="text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            {t.transitPage.hero.desc}
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
                {t.transitPage.statusBox.title}
              </p>
              <p className="text-sm" style={{ color: "#5A6B7D" }}>
                {t.transitPage.statusBox.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services trois colonnes */}
      <section style={{ background: COLORS.blanc }} className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-widest uppercase mb-10" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.transitPage.whatWeDo.eyebrow}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} id={s.id} className="p-6 border rounded-sm scroll-mt-20" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
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
        </div>
      </section>

      {/* Zones desservies */}
      <section style={{ background: COLORS.brume }} className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.transitPage.zones.eyebrow}</p>
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
            {t.transitPage.zones.title}
          </h2>
          <div className="flex flex-wrap gap-3">
            {t.transitPage.zones.list.map((pays) => (
              <div key={pays} className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-white border text-sm font-medium" style={{ borderColor: "rgba(27,58,92,0.12)", color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>
                <Globe size={14} style={{ color: COLORS.indigo }} />
                {pays}
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "#A0AEC0", fontFamily: "var(--font-mono)" }}>
            {t.transitPage.zones.note}
          </p>
        </div>
      </section>

      {/* Devis form */}
      <section id="devis" style={{ background: COLORS.blanc }} className="py-20 scroll-mt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.transitPage.devisForm.eyebrow}</p>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
            {t.transitPage.devisForm.title}
          </h2>
          <p className="text-sm mb-8" style={{ color: "#5A6B7D" }}>
            {t.transitPage.devisForm.desc}
          </p>
          {sent ? (
            <div className="p-6 rounded-sm text-center border" style={{ borderColor: COLORS.vert, background: "#f0faf8" }}>
              <CheckCircle size={32} className="mx-auto mb-3" style={{ color: COLORS.vert }} />
              <p className="font-semibold" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>{t.transitPage.devisForm.sentTitle}</p>
              <p className="text-sm mt-1" style={{ color: "#5A6B7D" }}>{t.transitPage.devisForm.sentDesc}</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm underline" style={{ color: COLORS.indigo }}>{t.transitPage.devisForm.newRequest}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: t.transitPage.devisForm.typeLabel, key: "type", placeholder: t.transitPage.devisForm.typePlaceholder },
                { label: t.transitPage.devisForm.originLabel, key: "origine", placeholder: t.transitPage.devisForm.originPlaceholder },
                { label: t.transitPage.devisForm.nameLabel, key: "nom", placeholder: t.transitPage.devisForm.namePlaceholder },
                { label: t.transitPage.devisForm.contactLabel, key: "contact", placeholder: t.transitPage.devisForm.contactPlaceholder },
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
                  {t.transitPage.devisForm.modeLabel}
                </label>
                <div className="relative">
                  <select
                    value={form.mode}
                    onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}
                    className="w-full px-4 py-3 rounded-sm text-sm border outline-none appearance-none"
                    style={{ borderColor: "rgba(27,58,92,0.2)", background: COLORS.brume, color: COLORS.nuit, fontFamily: "var(--font-body)" }}
                  >
                    <option value="maritime">{t.transitPage.devisForm.modeMaritime}</option>
                    <option value="aérien">{t.transitPage.devisForm.modeAerien}</option>
                    <option value="terrestre">{t.transitPage.devisForm.modeTerrestre}</option>
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
                {t.transitPage.devisForm.submit}
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
  const { t } = useLang();
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
    const msg = t.wa.order(orderForm.marque, orderForm.modele, orderForm.budget, orderForm.delai, orderForm.contact);
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
          <p className="inline-block text-xs tracking-widest uppercase mb-4 px-3 py-1.5 rounded-sm" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}>{t.vehiclesPage.hero.eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
            {t.vehiclesPage.hero.title}
          </h1>
          <p className="text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            {t.vehiclesPage.hero.desc}
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
                {s === "tous" ? t.vehiclesPage.filters.all : s === "neuf" ? t.vehiclesPage.filters.neuf : t.vehiclesPage.filters.occasion}
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
              {marques.map((m) => <option key={m} value={m}>{m === "Toutes" ? t.vehiclesPage.filters.allBrands : m}</option>)}
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
              <option value="default">{t.vehiclesPage.filters.sortDefault}</option>
              <option value="asc">{t.vehiclesPage.filters.sortAsc}</option>
              <option value="desc">{t.vehiclesPage.filters.sortDesc}</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5A6B7D" }} />
          </div>

          <span className="text-sm ml-auto" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>
            {t.vehiclesPage.filters.count(filtered.length)}
          </span>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: COLORS.blanc }} className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {vehiclesLoading ? (
            <div className="py-20 flex items-center justify-center gap-2 text-sm" style={{ color: "#5A6B7D" }}>
              <Loader2 size={18} className="animate-spin" /> {t.vehiclesPage.grid.loading}
            </div>
          ) : vehiclesError ? (
            <div className="text-center py-20 rounded-sm border" style={{ borderColor: "rgba(220,60,60,0.3)", background: "#fff5f5" }}>
              <p className="text-sm mb-3" style={{ color: "#b23b3b" }}>{vehiclesError}</p>
              <button onClick={onRetry} className="text-sm underline" style={{ color: COLORS.indigo }}>{t.vehiclesPage.grid.retry}</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: "#5A6B7D" }}>
              <Car size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium" style={{ fontFamily: "var(--font-heading)" }}>{t.vehiclesPage.grid.empty}</p>
              <button onClick={() => { setStatut("tous"); setMarque("Toutes"); }} className="mt-3 text-sm underline" style={{ color: COLORS.indigo }}>
                {t.vehiclesPage.grid.reset}
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
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.vehiclesPage.orderForm.eyebrow}</p>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
            {t.vehiclesPage.orderForm.title}
          </h2>
          <p className="text-sm mb-8" style={{ color: "#5A6B7D" }}>
            {t.vehiclesPage.orderForm.desc}
          </p>
          {orderSent ? (
            <div className="p-6 rounded-sm text-center border" style={{ borderColor: COLORS.vert, background: "#f0faf8" }}>
              <CheckCircle size={32} className="mx-auto mb-3" style={{ color: COLORS.vert }} />
              <p className="font-semibold" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>{t.vehiclesPage.orderForm.sentTitle}</p>
              <button onClick={() => setOrderSent(false)} className="mt-4 text-sm underline" style={{ color: COLORS.indigo }}>{t.vehiclesPage.orderForm.newRequest}</button>
            </div>
          ) : (
            <form onSubmit={handleOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "marque", label: t.vehiclesPage.orderForm.brandLabel, placeholder: t.vehiclesPage.orderForm.brandPlaceholder },
                  { key: "modele", label: t.vehiclesPage.orderForm.modelLabel, placeholder: t.vehiclesPage.orderForm.modelPlaceholder },
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
                { key: "budget", label: t.vehiclesPage.orderForm.budgetLabel, placeholder: t.vehiclesPage.orderForm.budgetPlaceholder },
                { key: "delai", label: t.vehiclesPage.orderForm.delayLabel, placeholder: t.vehiclesPage.orderForm.delayPlaceholder },
                { key: "contact", label: t.vehiclesPage.orderForm.contactLabel, placeholder: t.vehiclesPage.orderForm.contactPlaceholder },
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
                {t.vehiclesPage.orderForm.submit}
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
  const { t, lang } = useLang();
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = vehicle.photos.length ? vehicle.photos : [vehicle.photo];
  const priceSuffix = vehicle.prix
    ? t.wa.vehiclePriceSuffix(vehicle.prix.toLocaleString(lang === "en" ? "en-US" : "fr-FR"))
    : "";
  const waHref = wa(t.wa.vehicle(vehicle.marque, vehicle.modele, vehicle.annee, priceSuffix));

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
          {t.vehicleDetail.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Photo */}
          <div>
            <div className="rounded-sm overflow-hidden bg-secondary aspect-video">
              <img
                src={photos[activePhoto] ?? photos[0]}
                alt={`${vehicle.marque} ${vehicle.modele}`}
                className="w-full h-full object-cover"
              />
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 mt-2">
                {photos.map((url, i) => (
                  <button
                    key={url + i}
                    onClick={() => setActivePhoto(i)}
                    className="w-16 h-12 rounded-sm overflow-hidden bg-secondary border-2 flex-shrink-0"
                    style={{ borderColor: i === activePhoto ? COLORS.ocre : "transparent" }}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center gap-3">
              {vehicle.statut && (
                <span
                  className="text-xs px-3 py-1 rounded-sm font-semibold"
                  style={{ background: vehicle.statut === "neuf" ? COLORS.vert : COLORS.indigo, color: "#fff", fontFamily: "var(--font-mono)" }}
                >
                  {vehicle.statut === "neuf" ? t.vehicleCard.neuf : t.vehicleCard.occasion}
                </span>
              )}
              <ProvenanceBadge from={vehicle.provenance} />
              {hasPromo(vehicle) && (
                <span
                  className="text-xs px-3 py-1 rounded-sm font-bold"
                  style={{ background: COLORS.ocre, color: "#fff", fontFamily: "var(--font-mono)" }}
                >
                  {t.vehicleCard.promo}
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
              {vehicle.annee} · {fmtKm(vehicle.kilometrage, lang)}
            </p>

            {/* Price */}
            <div className="mb-6 p-4 rounded-sm border-l-4" style={{ background: COLORS.brume, borderLeftColor: COLORS.ocre }}>
              <p className="text-xs mb-1" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>{t.vehicleDetail.price}</p>
              {hasPromo(vehicle) && (
                <p className="text-sm line-through mb-0.5" style={{ fontFamily: "var(--font-mono)", color: "#A0AEC0" }}>
                  {fmtPrice(vehicle.prixBarre, lang)}
                </p>
              )}
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-mono)", color: !vehicle.prix ? "#5A6B7D" : hasPromo(vehicle) ? COLORS.ocre : COLORS.nuit }}>
                {fmtPrice(vehicle.prix, lang)}
              </p>
            </div>

            {/* Specs table */}
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.vehicleDetail.specs}</p>
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
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-sm font-bold text-white text-base transition-opacity hover:opacity-90"
              style={{ background: "#25D366", fontFamily: "var(--font-heading)" }}
            >
              <MessageCircle size={22} />
              {t.vehicleDetail.interested}
            </a>
            <p className="text-center text-xs mt-3" style={{ color: "#A0AEC0" }}>
              {t.vehicleDetail.note}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

function AboutPage({ navigate }: { navigate: (p: Page) => void }) {
  const { t } = useLang();
  const differenceIcons = [<Shield size={18} />, <Globe size={18} />, <MessageCircle size={18} />, <Truck size={18} />];
  return (
    <main>
      <section className="relative min-h-[50vh] flex flex-col justify-center overflow-hidden" style={{ background: COLORS.indigo }}>
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&h=700&fit=crop&auto=format"
          alt="Partenariat professionnel"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <p className="inline-block text-xs tracking-widest uppercase mb-4 px-3 py-1.5 rounded-sm" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}>{t.aboutPage.hero.eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
            {t.aboutPage.hero.titleLine1}<br />{t.aboutPage.hero.titleLine2}
          </h1>
        </div>
      </section>

      <section style={{ background: COLORS.blanc }} className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.aboutPage.story.eyebrow}</p>
            <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
              {t.aboutPage.story.title}
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#4A5A6B" }}>
              {t.aboutPage.story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.aboutPage.difference.eyebrow}</p>
            <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
              {t.aboutPage.difference.title}
            </h2>
            <div className="space-y-4">
              {t.aboutPage.difference.items.map((item, i) => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-sm border" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                  <div className="mt-0.5 flex-shrink-0" style={{ color: COLORS.indigo }}>{differenceIcons[i]}</div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>{item.title}</p>
                    <p className="text-sm" style={{ color: "#5A6B7D" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials placeholder */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.aboutPage.testimonials.eyebrow}</p>
          <div className="p-6 rounded-sm border border-dashed text-center" style={{ borderColor: "rgba(27,58,92,0.2)" }}>
            <p className="text-sm" style={{ color: "#A0AEC0", fontFamily: "var(--font-mono)" }}>
              {t.aboutPage.testimonials.placeholder}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 text-center">
          <button
            onClick={() => navigate("contact")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: COLORS.indigo, fontFamily: "var(--font-heading)" }}
          >
            {t.aboutPage.cta} <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────

function ContactPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ nom: "", sujet: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = t.wa.contactForm(form.nom, form.sujet, form.message);
    window.open(wa(msg), "_blank");
    setSent(true);
  };

  return (
    <main>
      <section className="relative min-h-[45vh] flex flex-col justify-center overflow-hidden" style={{ background: COLORS.indigo }}>
        <img
          src="https://images.unsplash.com/photo-1573164574397-dd250bc8a598?w=1600&h=700&fit=crop&auto=format"
          alt="Équipe en action"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <p className="inline-block text-xs tracking-widest uppercase mb-4 px-3 py-1.5 rounded-sm" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.55)" }}>{t.contactPage.hero.eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
            {t.contactPage.hero.title}
          </h1>
          <p className="text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            {t.contactPage.hero.desc}
          </p>
        </div>
      </section>

      <section style={{ background: COLORS.blanc }} className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Contact info */}
          <div>
            {/* WhatsApp — primary */}
            <a
              href={wa(t.wa.generic)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-6 rounded-sm mb-5 transition-opacity hover:opacity-90 group"
              style={{ background: "#25D366" }}
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <MessageCircle size={28} style={{ color: "#25D366" }} />
              </div>
              <div>
                <p className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>{t.contactPage.whatsapp.title}</p>
                <p className="text-white text-sm" style={{ opacity: 0.85 }}>{t.contactPage.whatsapp.subtitle}</p>
                <p className="text-white text-sm font-semibold mt-1" style={{ fontFamily: "var(--font-mono)" }}>+221 77 520 86 35</p>
              </div>
            </a>

            {/* Other contacts */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-4 p-4 rounded-sm border" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                <Phone size={20} style={{ color: COLORS.indigo }} />
                <div>
                  <p className="text-xs" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>{t.contactPage.phone}</p>
                  <a href="tel:+221775208635" className="font-semibold text-sm" style={{ color: COLORS.nuit, fontFamily: "var(--font-mono)" }}>+221 77 520 86 35</a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-sm border" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                <Mail size={20} style={{ color: COLORS.indigo }} />
                <div>
                  <p className="text-xs" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>{t.contactPage.email}</p>
                  <a href="mailto:contact@dakartransitauto.sn" className="font-semibold text-sm" style={{ color: COLORS.nuit, fontFamily: "var(--font-mono)" }}>contact@dakartransitauto.sn</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-sm border" style={{ borderColor: "rgba(27,58,92,0.1)" }}>
                <MapPin size={20} className="mt-0.5" style={{ color: COLORS.indigo }} />
                <div>
                  <p className="text-xs" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>{t.contactPage.address}</p>
                  <p className="font-semibold text-sm" style={{ color: COLORS.nuit }}>{t.contactPage.addressValue}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-sm" style={{ background: COLORS.brume }}>
              <p className="text-xs" style={{ color: "#5A6B7D", fontFamily: "var(--font-mono)" }}>
                {t.contactPage.badge}<br />
                {t.contactPage.badgeLine2}<br />
                {t.contactPage.badgeLine3}
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.ocre, fontFamily: "var(--font-mono)" }}>{t.contactPage.form.eyebrow}</p>
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)", color: COLORS.nuit }}>
              {t.contactPage.form.title}
            </h2>
            {sent ? (
              <div className="p-6 rounded-sm text-center border" style={{ borderColor: COLORS.vert, background: "#f0faf8" }}>
                <CheckCircle size={32} className="mx-auto mb-3" style={{ color: COLORS.vert }} />
                <p className="font-semibold" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>{t.contactPage.form.sentTitle}</p>
                <button onClick={() => { setSent(false); setForm({ nom: "", sujet: "", message: "" }); }} className="mt-4 text-sm underline" style={{ color: COLORS.indigo }}>
                  {t.contactPage.form.newMessage}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "nom", label: t.contactPage.form.nameLabel, placeholder: t.contactPage.form.namePlaceholder, type: "text" },
                  { key: "sujet", label: t.contactPage.form.subjectLabel, placeholder: t.contactPage.form.subjectPlaceholder, type: "text" },
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
                  <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.nuit, fontFamily: "var(--font-heading)" }}>{t.contactPage.form.messageLabel}</label>
                  <textarea
                    placeholder={t.contactPage.form.messagePlaceholder}
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
                  {t.contactPage.form.submit}
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

function AppInner() {
  const { t, lang } = useLang();
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
      .catch(() => setVehiclesError(t.common.catalogError))
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
    const vehicleTitle = selectedVehicle
      ? `${selectedVehicle.marque} ${selectedVehicle.modele} ${selectedVehicle.annee} — Transit Logistic International`
      : "Véhicule — TLI";
    const vehicleDesc = selectedVehicle
      ? `${selectedVehicle.marque} ${selectedVehicle.modele} ${selectedVehicle.annee}${selectedVehicle.statut ? `, ${selectedVehicle.statut}` : ""}${selectedVehicle.provenance.trim() ? `, ${lang === "en" ? "imported from" : "importé depuis"} ${selectedVehicle.provenance}` : ""}. ${fmtPrice(selectedVehicle.prix, lang)}.`
      : "";

    const meta: Record<Page, { title: string; desc: string; keywords: string }> = {
      home: t.meta.home,
      transit: t.meta.transit,
      vehicles: t.meta.vehicles,
      "vehicle-detail": { title: vehicleTitle, desc: vehicleDesc, keywords: t.meta["vehicle-detail"].keywords },
      about: t.meta.about,
      contact: t.meta.contact,
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
    setMeta("og:locale", lang === "en" ? "en_US" : "fr_SN", true);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
  }, [page, selectedVehicle, lang]);

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

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}
