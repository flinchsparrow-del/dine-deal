import { createFileRoute, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  Gift,
  Heart,
  Info,
  MapPin,
  RefreshCw,
  Star,
} from "lucide-react";
import { useBookings } from "@/lib/bookings";
import { dealDescription, dealPerks, venueById } from "@/lib/venues";

export const Route = createFileRoute("/venue/$venueId")({
  loader: ({ params }) => {
    const venue = venueById(params.venueId);
    if (!venue) throw notFound();
    return { venue };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Podnik nenalezen | DealBite" }, { name: "robots", content: "noindex" }] };
    const { venue } = loaderData;
    const title = `${venue.name} — ${venue.deals[0] ?? "sleva"} | DealBite`;
    const description = `${venue.name}: ${venue.deals.join(", ")}. Rezervuj slevu zdarma a uplatni ji na místě.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: venue.image },
        { name: "twitter:image", content: venue.image },
      ],
    };
  },
  component: VenueDetail,
});

function VenueDetail() {
  const { venue } = Route.useLoaderData();
  const { book } = useBookings();
  const navigate = useNavigate();
  const router = useRouter();
  const [tab, setTab] = useState<"deals" | "menu">("deals");
  const [liked, setLiked] = useState(false);

  const onBook = (deal: string) => {
    const b = book(venue.id, deal);
    navigate({ to: "/booked/$bookingId", params: { bookingId: b.id } });
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="relative">
        <img src={venue.image} alt={venue.name} className="h-72 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.35_0.14_35_/_0.95)] via-transparent to-[oklch(0.2_0_0_/_0.25)]" />
        <button
          onClick={() => router.history.back()}
          aria-label="Zpět"
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card/80 backdrop-blur"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setLiked((v) => !v)}
          aria-label="Uložit"
          className="absolute bottom-16 right-4 grid h-10 w-10 place-items-center rounded-full bg-card/85 backdrop-blur"
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`} />
        </button>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 text-primary-foreground">
          <h1 className="text-2xl font-black leading-tight">{venue.name}</h1>
          <p className="text-sm opacity-90">{venue.categories.join(" · ")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" />
              {venue.rating.toFixed(1)} ({venue.reviews})
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {venue.distance} km
            </span>
            <span>{venue.open ? "Otevřeno" : "Zavřeno"}</span>
          </div>
        </div>
      </div>

      <div className="mx-4 -mt-1 flex rounded-full bg-card p-1 shadow-card">
        {(["deals", "menu"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-colors ${
              tab === t ? "gradient-primary text-primary-foreground" : "text-foreground"
            }`}
          >
            {t === "deals" ? "Deals & more" : "Menu"}
          </button>
        ))}
      </div>

      {tab === "deals" ? (
        <div className="space-y-4 px-4 pt-4">
          {venue.deals.map((deal) => (
            <article key={deal} className="rounded-2xl bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-black">{deal}</h2>
                <Info className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{dealDescription(deal)}</p>
              <ul className="mt-3 divide-y divide-border">
                {dealPerks(deal).map((p) => (
                  <li key={p.text} className="flex items-center gap-3 py-2.5 text-sm font-semibold">
                    {p.icon === "gift" && <Gift className="h-4 w-4 text-primary" />}
                    {p.icon === "refresh" && <RefreshCw className="h-4 w-4 text-primary" />}
                    {p.icon === "pin" && <MapPin className="h-4 w-4 text-primary" />}
                    {p.text}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onBook(deal)}
                className="mt-3 w-full rounded-full gradient-primary py-3.5 text-base font-bold text-primary-foreground active:scale-[0.99]"
              >
                Book DEAL
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="px-4 pt-6 text-center text-sm text-muted-foreground">
          Menu tohoto podniku najdeš přímo na místě.
          <a
            href={venue.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block font-bold text-primary"
          >
            Otevřít profil podniku
          </a>
        </div>
      )}
    </div>
  );
}
