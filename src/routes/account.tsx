import { createFileRoute } from "@tanstack/react-router";
import { Bell, CreditCard, Globe, HelpCircle, LogOut, Star, Ticket } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useBookings } from "@/lib/bookings";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Můj účet | DealBite" },
      { name: "description", content: "Spravuj svůj profil, členství a nastavení v DealBite." },
      { property: "og:title", content: "Můj účet | DealBite" },
      { property: "og:description", content: "Spravuj svůj profil, členství a nastavení." },
    ],
  }),
  component: Account,
});

const rows = [
  { icon: CreditCard, label: "Členství a platby" },
  { icon: Bell, label: "Notifikace" },
  { icon: Globe, label: "Jazyk aplikace" },
  { icon: HelpCircle, label: "Nápověda a podpora" },
  { icon: LogOut, label: "Odhlásit se" },
];

function Account() {
  const { bookings } = useBookings();
  const redeemed = bookings.filter((b) => b.status === "redeemed");

  return (
    <div className="min-h-screen pb-24">
      <div className="gradient-primary px-5 pb-8 pt-10 text-primary-foreground">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-card text-2xl font-black text-primary">
            JN
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black">Jana Nováková</h1>
            <p className="text-sm opacity-90">Praha · Premium člen</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card/20 p-3 backdrop-blur">
            <p className="flex items-center gap-1.5 text-xs font-semibold opacity-90">
              <Ticket className="h-3.5 w-3.5" /> Uplatněné slevy
            </p>
            <p className="text-2xl font-black">{redeemed.length}</p>
          </div>
          <div className="rounded-2xl bg-card/20 p-3 backdrop-blur">
            <p className="flex items-center gap-1.5 text-xs font-semibold opacity-90">
              <Star className="h-3.5 w-3.5" /> Ušetřeno
            </p>
            <p className="text-2xl font-black">{redeemed.length * 167} Kč</p>
          </div>
        </div>
      </div>

      <div className="mx-4 -mt-4 divide-y divide-border rounded-2xl bg-card shadow-card">
        {rows.map(({ icon: Icon, label }) => (
          <button key={label} className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-semibold">
            <Icon className="h-4 w-4 text-primary" />
            {label}
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
