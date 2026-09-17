import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { Link } from "@tanstack/react-router";
import type { Venue } from "@/lib/venues";

const icon = (hot: boolean) =>
  L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);background:${
      hot ? "#e8452a" : "#ef7a45"
    };font-size:14px">${hot ? "🔥" : "🍽️"}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

export default function VenueMap({ venues }: { venues: Venue[] }) {
  return (
    <MapContainer
      center={[50.0755, 14.4378]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {venues.slice(0, 200).map((v) => (
        <Marker key={v.id} position={[v.lat, v.lng]} icon={icon(v.hot)}>
          <Popup>
            <Link
              to="/venue/$venueId"
              params={{ venueId: v.id }}
              className="block text-sm font-bold text-foreground"
            >
              {v.name}
              <span className="block text-xs font-medium text-primary">{v.deals[0]}</span>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
