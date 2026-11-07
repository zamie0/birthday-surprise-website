# 🎁 A Magical 25th Birthday Surprise — for Habil

An interactive, mobile-first birthday story in 7 stages:

1. **Welcome** — "Psst... Habil 👀", live countdown, a gift box you can shake, then open
2. **Celebration** — confetti, a giant animated 25, a two-tier cake with 25 candles → make a wish → blow them out (tap, or blow into the mic) → sweet message
3. **Memories** — swipeable polaroid scrapbook (tap a photo to enlarge)
4. **A / B / C / D** — four mystery cards; A glows; tapping B/C/D gets teased 😏; A flips open, then the others show "not this time"
5. **Buffet reveal** — drumroll → *A BUFFET DATE!* → King of the Grill card + voucher + "Reveal more details"
6. **Bonus** — "Wait a minute..." → *NOPE!* → a royal gift box (tap 3×) → flash, rays, confetti → holographic Berjaya Times Square Theme Park voucher (tilts when you drag across it)
7. **Finale** — heartfelt letter → *One Last Birthday Surprise ✨* → balloons, hearts, confetti, giant 25, replay

Extras: soft music-box "Happy Birthday" (starts only after the first tap, mute button top-right), synthesized sound effects, birthday mode on 12 Nov (crown on the gift + special greeting), progress bar you can tap to revisit stages, restart button, stage saved across refreshes, reduced-motion support, and a hidden Easter egg.

> 🤫 **Easter egg:** on the cake screen, tap the big **25** five times.

---

## Run it

Needs [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open the URL it prints. To test on your phone, use the **Network** URL shown (same Wi-Fi).

- Preview birthday mode early: add `?birthday=1` to the URL.
- Start over any time with the ↺ button (top-left), or the replay button at the end.

## Replace the photos 📸

1. Put your pictures in **`public/images/`** — e.g. `memory-1.jpg` … `memory-8.jpg`.
2. Open **`src/config/birthday.ts`** → `memories.photos` and set each photo's:
   - `src` — `'/images/your-file.jpg'`
   - `caption` — any text, or `''` for none
   - `orientation` — `'portrait'`, `'landscape'` or `'square'` (sets the frame shape)
3. Add or remove entries freely (6–10 looks best). Missing files show a cute placeholder automatically.

Tip: resize photos to ~1200px on the long side so they load fast on mobile data.

## Edit the messages ✍️

Everything lives in **`src/config/birthday.ts`** — name, age, date, every message, button labels, the A/B/C/D options, buffet details, theme park text, the Easter egg and the sign-off (`signature`). Each paragraph of a message is one item in its array.

- **Buffet details** (`buffet.details`): once you have the real date/time, update the `When` line. Nothing about bookings or prices is invented.
- **Theme park voucher**: it's labelled as a *Birthday Surprise Voucher* with a "not an admission ticket" note. Change `bonus.ticketFinePrint` if you want.

## Music & sounds 🎵

- Built-in: a gentle synthesized music box plays "Happy Birthday" — no files needed.
- Your own song: put an mp3 in `public/audio/` and set `audio.music: '/audio/your-song.mp3'`.
- Custom effects: set any of `audio.sfx.open / pop / chime / fanfare / blow` to an mp3 path. Empty = built-in sound.

Browsers only allow sound after a tap, so music starts when he presses **Open Your Surprise**.

## Deploy (free) 🚀

```bash
npm run build
```

This creates the **`dist/`** folder — a static site. Pick one:

- **Netlify Drop (easiest):** go to <https://app.netlify.com/drop> and drag the `dist` folder in. You get a link instantly.
- **Vercel:** `npx vercel` in this folder (framework: Vite, output: `dist`).
- **GitHub Pages / any static host:** upload the contents of `dist/`. The build uses relative paths, so it works in a sub-folder too.

After changing photos or text, run `npm run build` again and re-upload `dist/`.

## Project map

```
src/config/birthday.ts   ← edit this
src/stages/              ← the 7 stages
src/components/          ← gift box, cake, decorations, countdown, buttons
src/lib/audio.ts         ← music + sound effects
src/lib/fx.ts            ← confetti + date helpers
public/images/           ← your photos
public/audio/            ← optional music / sounds
```

Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide icons and canvas-confetti. Fonts (Fraunces, Caveat, DM Sans) are bundled, so nothing loads from outside.
