import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  Clock,
  Gift,
  Info,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Share2,
  Star,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useBookings, type Booking } from "@/lib/bookings";
import { dealPerks, venueById } from "@/lib/venues";

export const Route = createFileRoute("/my-deals")({
  head: () => ({
    meta: [
      { title: "Moje slevy | DealBite" },
      {
        name: "description",
        content: "Rezervované a uplatněné slevy na jednom místě. Uplatni je přímo v podniku.",
      },
      { property: "og:title", content: "Moje slevy | DealBite" },
      { property: "og:description", content: "Rezervované a uplatněné slevy na jednom místě." },
    ],
  }),
  component: MyDeals,
});

function MyDeals() {
  const { bookings } = useBookings();
  const [tab, setTab] = useState<"booked" | "redeemed">("booked");
  const list = bookings.filter((b) => b.status === tab);

  return (
    <div className="min-h-screen pb-24">
      <header className="px-4 pt-5">
        <h1 className="text-3xl font-black">My deals</h1>
        <div className="mt-4 flex rounded-full bg-card p-1 shadow-card">
          {(["booked", "redeemed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-colors ${
                tab === t ? "gradient-primary text-primary-foreground" : "text-foreground"
              }`}
            >
              {t === "booked" ? "Booked" : "Redeemed"}
              <span className={`text-xs ${tab === t ? "opacity-90" : "text-muted-foreground"}`}>
                {bookings.filter((b) => b.status === t).length}
              </span>
            </button>
          ))}
        </div>
      </header>

      {tab === "booked" && list.length > 0 && (
        <p className="mx-4 mt-4 rounded-2xl bg-primary-soft p-3 text-xs font-semibold text-accent-foreground">
          🔥 Po příchodu do podniku řekni obsluze, že jsi tu s DealBite 😊 Slevu uplatni při placení
          😉 Pamatuj, na jeden stůl lze použít jen jednu slevu.
        </p>
      )}

      <div className="space-y-4 px-4 pt-4">
        {list.map((b) => (
          <DealCard key={b.id} booking={b} />
        ))}
        {list.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">
              {tab === "booked" ? "Zatím nemáš žádnou rezervovanou slevu." : "Zatím jsi žádnou slevu neuplatnil."}
            </p>
            <Link to="/" className="mt-3 inline-block font-bold text-primary">
              Objevit slevy
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function DealCard({ booking }: { booking: Booking }) {
  const venue = venueById(booking.venueId);
  const { cancel } = useBookings();
  if (!venue) return null;
  const redeemed = booking.status === "redeemed";

  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-card">
      <Link to="/venue/$venueId" params={{ venueId: venue.id }} className="relative block">
        <img src={venue.image} alt={venue.name} className="h-40 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.35_0.14_35_/_0.95)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3 text-primary-foreground">
          <h2 className="text-lg font-black leading-tight">{venue.name}</h2>
          <p className="text-xs opacity-90">{venue.categories.join(" · ")}</p>
          <div className="mt-1 flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current" />
              {venue.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {venue.distance} km
            </span>
            <span>{venue.open ? "Otevřeno" : "Zavřeno"}</span>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-3 gap-2 px-3 py-3">
        {[
          { Icon: Phone, label: "Contact" },
          { Icon: Navigation, label: "Navigate" },
          { Icon: Share2, label: "Share" },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-soft py-2 text-xs font-bold text-primary"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="mx-3 mb-3 rounded-2xl border border-border p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-black">{booking.deal}</h3>
          <Info className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
        <ul className="mt-2 space-y-2 text-sm font-semibold">
          {dealPerks(booking.deal).map((p) => (
            <li key={p.text} className="flex items-center gap-2">
              {p.icon === "gift" && <Gift className="h-4 w-4 text-primary" />}
              {p.icon === "refresh" && <RefreshCw className="h-4 w-4 text-primary" />}
              {p.icon === "pin" && <MapPin className="h-4 w-4 text-primary" />}
              {p.text}
            </li>
          ))}
          <li className="flex flex-wrap items-center gap-2 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              {new Date(booking.bookedAt).toLocaleDateString("cs-CZ")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              09:00 – 21:00
            </span>
          </li>
        </ul>

        {redeemed ? (
          <div className="mt-3 rounded-full bg-muted py-3 text-center text-sm font-bold text-muted-foreground">
            Uplatněno {booking.rating ? `· ${booking.rating}★` : ""}
          </div>
        ) : (
          <Link
            to="/redeem/$bookingId"
            params={{ bookingId: booking.id }}
            className="mt-3 block rounded-full bg-success py-3.5 text-center text-base font-bold text-success-foreground active:scale-[0.99]"
          >
            Redeem deal
          </Link>
        )}
      </div>

      {!redeemed && (
        <button
          onClick={() => cancel(booking.id)}
          className="w-full pb-4 text-center text-sm font-bold text-muted-foreground"
        >
          Cancel deal
        </button>
      )}
    </section>
  );
}
