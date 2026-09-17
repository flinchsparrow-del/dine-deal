import raw from "@/data/venues.json";

export type Venue = {
  id: string;
  slug: string;
  name: string;
  hot: boolean;
  rating: number;
  reviews: number;
  categories: string[];
  deals: string[];
  image: string;
  url: string;
  lat: number;
  lng: number;
  distance: number;
  open: boolean;
};

export const venues = raw as Venue[];

export const venueById = (id: string) => venues.find((v) => v.id === id);

export const categories = [
  { key: "HOT Deal", label: "HOT Deal", emoji: "🔥" },
  { key: "Kavárna", label: "Káva", emoji: "☕" },
  { key: "Asijská", label: "Asijská", emoji: "🥡" },
  { key: "Pizza", label: "Pizza", emoji: "🍕" },
  { key: "Burger", label: "Burger", emoji: "🍔" },
  { key: "Sushi", label: "Sushi", emoji: "🍣" },
  { key: "Dezerty", label: "Dezerty", emoji: "🍰" },
  { key: "Snídaně", label: "Snídaně", emoji: "🥐" },
  { key: "Koktejl", label: "Koktejl", emoji: "🍹" },
  { key: "Pivo", label: "Pivo", emoji: "🍺" },
  { key: "Vegan", label: "Vegan", emoji: "🥗" },
  { key: "Zmrzlina", label: "Zmrzlina", emoji: "🍦" },
];

export function dealPerks(deal: string) {
  const perks = [
    { icon: "gift", text: "Ušetři až 167 Kč" },
    { icon: "refresh", text: "Obnovuje se každých 14 dní" },
    { icon: "pin", text: "Na místě i s sebou" },
  ];
  if (/1\+1/i.test(deal)) perks[0] = { icon: "gift", text: "Druhé jídlo zdarma" };
  if (/50/.test(deal)) perks[0] = { icon: "gift", text: "Ušetři až 167 Kč" };
  return perks;
}

export function dealDescription(deal: string) {
  if (/1\+1/i.test(deal))
    return "Objednej si dvě položky z nabídky a tu levnější dostaneš úplně zdarma.";
  if (/-?\s?50/.test(deal))
    return "Objednej si jedno nebo více menu dle výběru a to nejlevnější získáš za polovinu!";
  return "Uplatni nabídku přímo na místě u obsluhy a ušetři na své objednávce.";
}
