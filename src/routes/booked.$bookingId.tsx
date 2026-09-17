import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/booked/$bookingId")({
  head: () => ({
    meta: [
      { title: "Sleva rezervována | DealBite" },
      { name: "description", content: "Tvoje sleva je rezervovaná a čeká na uplatnění." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Sleva rezervována | DealBite" },
      { property: "og:description", content: "Tvoje sleva je rezervovaná a čeká na uplatnění." },
    ],
  }),
  component: Booked,
});

function Booked() {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-24">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-success">
          <Check className="h-8 w-8 text-success" strokeWidth={3} />
        </div>
        <h1 className="mt-5 text-3xl font-black">Deal booked</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          Nezapomeň si rezervovat stůl nebo si jídlo objednat s sebou. Dobrou chuť!
        </p>
      </div>

      <div className="mt-auto space-y-3">
        <Link
          to="/my-deals"
          className="block rounded-full bg-foreground py-4 text-center text-base font-bold text-background"
        >
          My DEALs
        </Link>
        <Link to="/" className="block py-2 text-center text-sm font-bold">
          Zpět na Explore
        </Link>
      </div>
    </div>
  );
}
