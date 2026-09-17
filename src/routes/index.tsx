import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { ChevronDown, List, Map as MapIcon, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { VenueCard } from "@/components/VenueCard";
import { categories, venues } from "@/lib/venues";

const VenueMap = lazy(() => import("@/components/VenueMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Explore — slevy v restauracích v Praze | DealBite" },
      {
        name: "description",
        content:
          "Procházej stovky pražských podniků se slevami 1+1, -50 % a HOT Deal. Seznam nebo mapa.",
      },
      { property: "og:title", content: "Explore — slevy v restauracích v Praze" },
      {
        property: "og:description",
        content: "Procházej pražské podniky se slevami 1+1 a -50 %.",
      },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return venues.filter((v) => {
      const matchQ =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.categories.some((c) => c.toLowerCase().includes(q)) ||
        v.deals.some((d) => d.toLowerCase().includes(q));
      const matchC = !cat || v.categories.includes(cat);
      return matchQ && matchC;
    });
  }, [query, cat]);

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <header className="sticky top-0 z-30 space-y-3 bg-background/95 px-4 pb-2 pt-4 backdrop-blur">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <button className="flex min-w-0 items-center gap-1.5 rounded-full bg-card px-4 py-2.5 shadow-card">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate text-sm font-extrabold">Praha</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-card">
              <Search className="h-4 w-4" />
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-card">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat podnik nebo slevu..."
            className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1">
          {categories.map((c) => {
            const active = cat === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCat(active ? null : c.key)}
                className={`flex w-[62px] shrink-0 flex-col items-center gap-1 text-[11px] font-semibold ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full text-xl ${
                    active ? "bg-primary-soft ring-2 ring-primary" : "bg-card shadow-card"
                  }`}
                >
                  {c.emoji}
                </span>
                <span className="truncate">{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex rounded-full bg-muted p-1">
          {(["list", "map"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-bold transition-colors ${
                view === v ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {v === "list" ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
              {v === "list" ? "Seznam" : "Mapa"}
            </button>
          ))}
        </div>
      </header>

      {view === "list" ? (
        <div className="space-y-3 px-4 pt-2">
          <p className="text-xs font-semibold text-muted-foreground">
            {filtered.length} podniků se slevou
          </p>
          {filtered.slice(0, 60).map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
          {filtered.length === 0 && (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Nic jsme nenašli. Zkus jiné hledání.
            </p>
          )}
        </div>
      ) : (
        <div className="mx-4 mt-2 h-[65vh] overflow-hidden rounded-2xl shadow-card">
          <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
              <VenueMap venues={filtered} />
            </Suspense>
          </ClientOnly>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
