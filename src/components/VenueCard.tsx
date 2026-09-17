import { Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import type { Venue } from "@/lib/venues";

export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Link
      to="/venue/$venueId"
      params={{ venueId: venue.id }}
      className="flex items-stretch gap-3 rounded-2xl bg-card p-3 shadow-card active:scale-[0.99] transition-transform"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="truncate text-[15px] font-extrabold text-foreground">{venue.name}</h3>
        <p className="truncate text-xs text-muted-foreground">{venue.categories.join(" · ")}</p>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {venue.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-0.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {venue.distance} km
          </span>
          <span className={venue.open ? "text-success" : "text-muted-foreground"}>
            {venue.open ? "Otevřeno" : "Zavřeno"}
          </span>
        </div>
        <div className="mt-1 flex gap-2 overflow-hidden">
          {venue.deals.slice(0, 2).map((d) => (
            <span
              key={d}
              className="shrink-0 truncate rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
      <img
        src={venue.image}
        alt={venue.name}
        loading="lazy"
        className="h-[92px] w-[108px] shrink-0 rounded-xl object-cover"
      />
    </Link>
  );
}
