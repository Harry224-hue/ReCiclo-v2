export interface WasteVisualProps {
  id: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  forceSvg?: boolean;
  imageUrl?: string;
  alt?: string;
}

const SIZE_MAP = {
  sm: "size-8",
  md: "size-12",
  lg: "size-16",
  xl: "size-24",
};

function getVisualFamily(id: string): string {
  const s = id.toLowerCase();
  if (s.includes("pet") || s.includes("botella") || s.includes("ciel") || s.includes("bonafont") || s.includes("electrolit") || s.includes("jugo") || s.includes("agua")) return "pet-bottle";
  if (s.includes("lata") || s.includes("can") || s.includes("aluminio") || s.includes("atun") || s.includes("arizona") || s.includes("cerveza")) return "aluminum-can";
  if (s.includes("scribe") || s.includes("papel") || s.includes("carton") || s.includes("hoja") || s.includes("cuaderno") || s.includes("caja") || s.includes("folder")) return "notebook-paper";
  if (s.includes("platano") || s.includes("manzana") || s.includes("mango") || s.includes("comida") || s.includes("organico") || s.includes("fruta") || s.includes("cascara")) return "organic-food";
  if (s.includes("tetra") || s.includes("lala") || s.includes("boing") || s.includes("leche")) return "tetra-pak";
  if (s.includes("unicel") || s.includes("maruchan") || s.includes("andatti") || s.includes("cafe") || s.includes("charola")) return "unicel";
  if (s.includes("pila") || s.includes("battery") || s.includes("duracell") || s.includes("cable") || s.includes("usb") || s.includes("cargador") || s.includes("bateria")) return "battery-alkaline";
  if (s.includes("snack") || s.includes("doritos") || s.includes("takis") || s.includes("cheetos") || s.includes("sabritas") || s.includes("galletas") || s.includes("emperador") || s.includes("gansito") || s.includes("marinela") || s.includes("pluma") || s.includes("bic") || s.includes("ticket") || s.includes("servilleta")) return "snack-wrapper";
  return "pet-bottle";
}

export function WasteVisual({
  id,
  className = "",
  size = "md",
}: WasteVisualProps) {
  const sizeClass = SIZE_MAP[size] || "size-12";
  const family = getVisualFamily(id);

  switch (family) {
    case "pet-bottle":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/40 p-1.5 border border-sky-200/60 dark:border-sky-800/60 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <rect x="27" y="6" width="10" height="6" rx="2" fill="#0284c7" />
            <rect x="25" y="12" width="14" height="3" rx="1.5" fill="#38bdf8" />
            <path d="M28 15 L28 20 L22 26 L22 52 C22 56 26 58 32 58 C38 58 42 56 42 52 L42 26 L36 20 L36 15 Z" fill="#38bdf8" fillOpacity="0.35" stroke="#0284c7" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="22" y="32" width="20" height="12" rx="1" fill="#0ea5e9" fillOpacity="0.85" />
            <path d="M30 36 L34 36 M32 36 L32 40" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <text x="32" y="42" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">PET</text>
            <path d="M25 28 L25 50" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" />
          </svg>
        </div>
      );

    case "aluminum-can":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-1.5 border border-amber-200/60 dark:border-amber-800/60 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="14" rx="12" ry="4" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            <ellipse cx="32" cy="14" rx="8" ry="2.5" fill="#cbd5e1" />
            <circle cx="32" cy="14" r="1.5" fill="#334155" />
            <rect x="30" y="11" width="4" height="5" rx="1" fill="#64748b" />
            <path d="M20 14 V48 C20 52 25 54 32 54 C39 54 44 52 44 48 V14" fill="url(#canGrad)" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
            <ellipse cx="32" cy="48" rx="12" ry="3.5" fill="none" stroke="#475569" strokeWidth="2" />
            <line x1="24" y1="18" x2="24" y2="46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
            <text x="32" y="34" fill="#1e293b" fontSize="6.5" fontWeight="bold" textAnchor="middle">ALU</text>
            <defs>
              <linearGradient id="canGrad" x1="20" y1="14" x2="44" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="0.5" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case "notebook-paper":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 p-1.5 border border-indigo-200/60 dark:border-indigo-800/60 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="10" width="24" height="34" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" transform="rotate(8 36 27)" />
            <rect x="18" y="14" width="26" height="36" rx="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <path d="M36 14 L44 22 L36 22 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
            <line x1="23" y1="24" x2="33" y2="24" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="23" y1="30" x2="39" y2="30" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="23" y1="36" x2="39" y2="36" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="23" y1="42" x2="35" y2="42" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="21" cy="20" r="1.2" fill="#cbd5e1" />
            <circle cx="21" cy="28" r="1.2" fill="#cbd5e1" />
            <circle cx="21" cy="36" r="1.2" fill="#cbd5e1" />
            <circle cx="21" cy="44" r="1.2" fill="#cbd5e1" />
          </svg>
        </div>
      );

    case "organic-food":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-1.5 border border-emerald-200/60 dark:border-emerald-800/60 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 14 C30 8 36 6 36 6" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M34 11 C38 8 44 10 44 14 C40 16 34 14 34 11 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
            <path d="M32 20 C24 16 16 22 16 32 C16 46 26 54 32 54 C38 54 48 46 48 32 C48 22 40 16 32 20 Z" fill="#10b981" stroke="#047857" strokeWidth="2" strokeLinejoin="round" />
            <path d="M22 26 C20 30 20 38 23 42" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="29" cy="34" rx="1.5" ry="3" fill="#065f46" transform="rotate(-15 29 34)" />
            <ellipse cx="35" cy="34" rx="1.5" ry="3" fill="#065f46" transform="rotate(15 35 34)" />
          </svg>
        </div>
      );

    case "tetra-pak":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-1.5 border border-blue-200/60 dark:border-blue-800/60 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <circle cx="34" cy="18" r="4.5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
            <circle cx="34" cy="18" r="2" fill="#93c5fd" />
            <path d="M22 22 L32 14 L42 22 L32 24 Z" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.8" />
            <path d="M22 22 L32 24 V54 L22 51 Z" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
            <path d="M32 24 L42 22 V51 L32 54 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" strokeLinejoin="round" />
            <line x1="24" y1="36" x2="30" y2="37" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="40" x2="28" y2="41" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <text x="37" y="40" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">BRICK</text>
          </svg>
        </div>
      );

    case "unicel":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-1.5 border border-zinc-200/80 dark:border-zinc-700 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 18 H46 L40 52 H24 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" />
            <ellipse cx="32" cy="18" rx="14" ry="3.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
            <ellipse cx="32" cy="18" rx="11" ry="2" fill="#ffffff" />
            <circle cx="28" cy="30" r="1" fill="#cbd5e1" />
            <circle cx="35" cy="34" r="1.2" fill="#cbd5e1" />
            <circle cx="26" cy="42" r="1" fill="#cbd5e1" />
            <circle cx="34" cy="44" r="1.2" fill="#cbd5e1" />
            <path d="M27 26 L37 36 M37 26 L27 36" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "battery-alkaline":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-1.5 border border-amber-200/60 dark:border-amber-800/60 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <rect x="29" y="8" width="6" height="4" rx="1.5" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
            <rect x="22" y="12" width="20" height="44" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <path d="M22 15 C22 13.5 23.5 12 25 12 H39 C40.5 12 42 13.5 42 15 V26 H22 Z" fill="#f59e0b" />
            <line x1="32" y1="16" x2="32" y2="22" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <line x1="29" y1="19" x2="35" y2="19" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <polygon points="32,32 26,44 38,44" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <text x="32" y="42" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">!</text>
            <text x="32" y="52" fill="#94a3b8" fontSize="4.5" fontWeight="bold" textAnchor="middle">AA</text>
          </svg>
        </div>
      );

    case "snack-wrapper":
    default:
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-1.5 border border-rose-200/60 dark:border-rose-800/60 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12 L22 14 L20 16 L22 18 L20 20 V48 L22 50 L20 52 L22 54 L20 56 H44 L42 54 L44 52 L42 50 L44 48 V20 L42 18 L44 16 L42 14 L44 12 Z" fill="#e11d48" stroke="#be123c" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="26,16 34,16 26,52 22,52" fill="#ffffff" fillOpacity="0.45" />
            <ellipse cx="32" cy="34" rx="8" ry="6" fill="#fb7185" />
            <text x="32" y="36" fill="white" fontSize="5.5" fontWeight="bold" textAnchor="middle">CHIPS</text>
            <path d="M22 22 H42 M22 46 H42" stroke="#881337" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        </div>
      );
  }
}
