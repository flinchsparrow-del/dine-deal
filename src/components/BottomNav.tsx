import { Link } from "@tanstack/react-router";
import { Compass, Ticket, UserRound } from "lucide-react";

const items = [
  { to: "/account", label: "Account", Icon: UserRound },
  { to: "/", label: "Explore", Icon: Compass },
  { to: "/my-deals", label: "My deals", Icon: Ticket },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-3">
        {items.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
