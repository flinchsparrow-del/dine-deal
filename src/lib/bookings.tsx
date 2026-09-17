import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Booking = {
  id: string;
  venueId: string;
  deal: string;
  status: "booked" | "redeemed";
  bookedAt: number;
  redeemedAt?: number;
  rating?: number;
  review?: string;
};

const KEY = "tastetown.bookings.v1";

type Ctx = {
  bookings: Booking[];
  book: (venueId: string, deal: string) => Booking;
  redeem: (id: string) => void;
  rate: (id: string, rating: number, review: string) => void;
  cancel: (id: string) => void;
  get: (id: string) => Booking | undefined;
};

const BookingContext = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setBookings(JSON.parse(stored) as Booking[]);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: Booking[]) => {
    setBookings(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      bookings,
      get: (id) => bookings.find((b) => b.id === id),
      book: (venueId, deal) => {
        const booking: Booking = {
          id: `${venueId}-${Date.now()}`,
          venueId,
          deal,
          status: "booked",
          bookedAt: Date.now(),
        };
        persist([booking, ...bookings]);
        return booking;
      },
      redeem: (id) =>
        persist(
          bookings.map((b) =>
            b.id === id ? { ...b, status: "redeemed" as const, redeemedAt: Date.now() } : b,
          ),
        ),
      rate: (id, rating, review) =>
        persist(bookings.map((b) => (b.id === id ? { ...b, rating, review } : b))),
      cancel: (id) => persist(bookings.filter((b) => b.id !== id)),
    }),
    [bookings, persist],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used inside BookingProvider");
  return ctx;
}
