import { BatteryCharging, Leaf, Package, Recycle, Trash2 } from "lucide-react";
import { CAMPUS_CONTAINERS_CATALOG } from "../data/wasteData";

/** Contraste legible para texto sobre el color oficial del contenedor. */
export function containerTextOn(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.52 ? "#18181b" : "#ffffff";
}

export function ContainerGlyph({
  id,
  size = 18,
  className = "",
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  if (id === "bin-verde") return <Leaf size={size} className={className} strokeWidth={2.2} />;
  if (id === "bin-amarillo") return <Recycle size={size} className={className} strokeWidth={2.2} />;
  if (id === "bin-negro") return <Trash2 size={size} className={className} strokeWidth={2.2} />;
  if (id === "bin-azul") return <Package size={size} className={className} strokeWidth={2.2} />;
  return <BatteryCharging size={size} className={className} strokeWidth={2.2} />;
}

export function ContainerDot({ id, size = 8 }: { id: string; size?: number }) {
  const spec = CAMPUS_CONTAINERS_CATALOG.find((bin) => bin.id === id);
  return (
    <span
      className="inline-block shrink-0 rounded-full ring-1 ring-black/15 dark:ring-white/20"
      style={{ width: size, height: size, backgroundColor: spec?.colorHex ?? "#71717a" }}
      aria-hidden="true"
    />
  );
}
