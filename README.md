# Dine & Deal

Vytvoř kompletní mobilní Web App / PWA v Reactu a Tailwind CSS. Aplikace musí být navržena VÝHRADNĚ pro mobilní zařízení.

VSTUPNÍ PODKLADY:

- Přiložené screenshoty aplikace TasteTown (včetně průchodu rezervace a uplatnění slevy).

- Přiložený soubor `podniky_praha.json` pro data restaurací.

HLAVNÍ STRUKTURA A FUNKČNOSTI:

1. DESIGN A SPODNÍ LIŠTA:

   - Spodní navigace (Bottom Nav Bar): ikonky 'Explore' (hlavní feed), 'My deals' (moje slevy), 'Account' (profil).

   - Horní lišta s vyhledáváním, výběrem lokace "Praha" a horizontálně posuvnými ikonami kategorií.

   - Přepínač pohledu: "Seznam" vs "Mapa" (interaktivní mapa pomocí Leaflet / OpenStreetMap).

2. REZERVAČNÍ FLOW (BOOKING & REDEEM SYSTEM):

   - Detail podniku: Zobraz nabídku slevy s tlačítkem "Book DEAL".

   - Po kliknutí na "Book DEAL": Zobraz potvrzovací obrazovku "Deal booked" s tlačítkem pro přechod do "My DEALS". Ulož deal do lokálního stavu/localStorage pod stav "Booked".

   - Záložka "My deals": Obsahuje dva taby — "Booked" (aktivní rezervace) a "Redeemed" (již použité).

   - Karta v "Booked": Zobrazuje detaily slevy, platnost (např. 09:00 - 21:00) a výrazné zelené tlačítko "Redeem deal".

3. INTERAKTIVNÍ "SWIPE TO REDEEM" A HODNOCENÍ:

   - Po kliknutí na "Redeem deal" se otevře obrazovka "DEAL REDEMPTION".

   - Zobraz interaktivní zelený slider / swipe komponentu s textem "Swipe to redeem DEAL". Uživatel musí přetáhnout zelenou ikonu zlevá doprava (použij např. framer-motion nebo touch eventy), aby nabídku aktivoval.

   - Po dokončení swipnutí: Zobraz popup modal "Successfully applied" s 5 hvězdičkami pro hodnocení podniku a textovým polem "Tell us your experience...".

   - Přesuň tento deal ze složky "Booked" do složky "Redeemed".

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a55faa05-14e8-40ad-bd85-14fa932b0024).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
