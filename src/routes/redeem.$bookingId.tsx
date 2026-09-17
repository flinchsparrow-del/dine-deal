import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { Calendar, Check, Clock, Info, Star } from "lucide-react";
import { useBookings } from "@/lib/bookings";
import { dealDescription, venueById } from "@/lib/venues";

export const Route = createFileRoute("/redeem/$bookingId")({
  head: () => ({
    meta: [
      { title: "Uplatnění slevy | DealBite" },
      { name: "description", content: "Přejeď prstem a uplatni svou slevu přímo v podniku." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Uplatnění slevy | DealBite" },
      { property: "og:description", content: "Přejeď prstem a uplatni svou slevu." },
    ],
  }),
  component: Redeem,
});

function Redeem() {
  const { bookingId } = Route.useParams();
  const { get, redeem, rate } = useBookings();
  const navigate = useNavigate();
  const booking = get(bookingId);
  const venue = booking ? venueById(booking.venueId) : undefined;

  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [maxX, setMaxX] = useState(220);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setMaxX(trackRef.current.offsetWidth - 64);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (!booking || !venue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-primary px-6 text-center text-primary-foreground">
        <div>
          <p className="font-bold">Tato sleva už není dostupná.</p>
          <button onClick={() => navigate({ to: "/my-deals" })} className="mt-4 underline">
            Zpět na My deals
          </button>
        </div>
      </div>
    );
  }

  const onDragEnd = () => {
    if (x.get() > maxX * 0.75) {
      animate(x, maxX, { type: "spring", stiffness: 300, damping: 30 });
      redeem(booking.id);
      setTimeout(() => setDone(true), 250);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 35 });
    }
  };

  const submit = () => {
    rate(booking.id, rating, review);
    navigate({ to: "/my-deals" });
  };

  return (
    <div className="relative min-h-screen bg-gradient-primary px-4 pb-10 pt-5">
      <p className="text-center text-xs font-black uppercase tracking-widest text-primary-foreground">
        Deal redemption
      </p>

      <div className="mt-5 overflow-hidden rounded-3xl bg-card shadow-card">
        <div className="relative">
          <img src={venue.image} alt={venue.name} className="h-44 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.35_0.14_35_/_0.95)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
            <h1 className="text-xl font-black">{venue.name}</h1>
            <p className="text-xs opacity-90">{venue.categories.join(" · ")}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-black">{booking.deal}</h2>
            <Info className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{dealDescription(booking.deal)}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-primary-soft px-3 py-2 text-sm font-bold text-accent-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString("cs-CZ")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              09:00 – 21:00
            </span>
          </div>

          <div
            ref={trackRef}
            className="relative mt-4 h-16 overflow-hidden rounded-2xl border border-border bg-background"
          >
            <span className="pointer-events-none absolute inset-0 grid place-items-center text-sm font-bold text-foreground">
              {booking.status === "redeemed" ? "DEAL uplatněn" : "Swipe to redeem DEAL"}
            </span>
            <motion.button
              drag="x"
              dragConstraints={{ left: 0, right: maxX }}
              dragElastic={0}
              dragMomentum={false}
              style={{ x }}
              onDragEnd={onDragEnd}
              aria-label="Přejeď pro uplatnění slevy"
              className="absolute left-1.5 top-1.5 grid h-[52px] w-[52px] cursor-grab touch-none place-items-center rounded-2xl bg-success text-success-foreground active:cursor-grabbing"
            >
              <Check className="h-7 w-7" strokeWidth={3} />
            </motion.button>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate({ to: "/my-deals" })}
        className="mx-auto mt-6 block text-sm font-bold text-primary-foreground"
      >
        Close
      </button>

      {done && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-background p-5 text-center shadow-card">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-success">
              <Check className="h-7 w-7 text-success" strokeWidth={3} />
            </div>
            <h3 className="mt-4 text-2xl font-black">Successfully applied</h3>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">Jak se ti líbilo?</p>

            <div className="mt-3 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  aria-label={`${n} hvězdiček`}
                  className="grid h-12 w-12 place-items-center rounded-xl bg-card shadow-card"
                >
                  <Star
                    className={`h-6 w-6 ${n <= rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us your experience ... 😊"
              rows={5}
              className="mt-4 w-full resize-none rounded-2xl bg-card p-3 text-sm outline-none shadow-card"
            />

            <button
              onClick={submit}
              disabled={rating === 0}
              className="mt-4 w-full rounded-full bg-gradient-primary py-3.5 text-base font-bold text-primary-foreground disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
