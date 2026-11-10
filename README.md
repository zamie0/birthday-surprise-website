# 🎁 Birthday Surprise Website

A polished, mobile-first birthday experience that turns a few photos, messages, gifts, and sound effects into an unforgettable interactive story.

This project is designed to be reusable: keep the experience, replace the example content, and deploy your own personalized surprise in minutes.

## ✨ Features

- Seven guided surprise stages with animated transitions
- Live birthday countdown and automatic birthday mode
- Interactive gift, birthday cake, wish, and candle-blowing experiences
- Photo-memory gallery with swipeable and expandable cards
- Interactive A/B/C/D choice and reveal scenes
- Personal gift voucher screens with configurable details
- Confetti, hearts, balloons, and motion effects
- Built-in music box and optional custom audio files
- Progress navigation, replay controls, and saved stage progress
- Microphone candle-blowing support where the browser allows it
- Reduced-motion and mobile-friendly support
- Hidden Easter egg included

## 🖼️ Preview

The experience begins with a personalized welcome, continues through memories and choices, reveals planned gifts, and ends with a heartfelt final message.

> Birthday mode can be previewed at any time by opening the site with `?birthday=1`.

## 🚀 Quick Start

### Requirements

- Node.js 20 or newer
- npm

### Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. Use the Network URL on another device connected to the same network to preview it on mobile.

### Production build

```bash
npm run build
npm run preview
```

## 🎨 Make It Yours

Most customization happens in one place:

**[`src/config/birthday.ts`](src/config/birthday.ts)**

Configure:

- Recipient name, age, and birthday date
- Welcome and countdown copy
- Birthday message and final letter
- Memory photo captions
- Choice-card labels and teaser messages
- Gift, treat, venue, and voucher details
- Sign-off
- Easter egg copy
- Background music and sound effects

Keep placeholder gifts clearly marked as placeholders or replace them with real arrangements before sharing the surprise.

### Add photos

Place your images in `public/images/`, for example:

```text
public/images/memory-1.jpg
public/images/memory-2.jpg
public/images/memory-3.jpg
```

Then update each entry in `birthday.memories.photos`:

```ts
{
  src: 'images/memory-1.jpg',
  caption: 'Where it all started ✨',
  orientation: 'portrait'
}
```

Supported orientations are `portrait`, `landscape`, and `square`. Missing images automatically show a friendly placeholder.

For the best balance of quality and loading speed, resize images to approximately 1200 px on the longest side.

### Add music or sound effects

The experience includes synthesized music and effects by default.

To use your own audio, place supported files in `public/audio/` and update `birthday.audio.music` or the entries under `birthday.audio.sfx`.

Browsers normally allow audio only after the recipient taps the welcome button.

## 🌐 Deployment

### GitHub Pages

This repository includes `.github/workflows/deploy.yml`. Push to the `main` branch and GitHub Actions will build and publish the site.

After the first workflow run, enable Pages under:

**Repository → Settings → Pages → Source: GitHub Actions**

### Other static hosts

```bash
npm run build
```

Upload the contents of `dist/` to Netlify Drop, Vercel, Cloudflare Pages, or another static host. The Vite configuration uses relative paths so the build can also work when hosted below a repository sub-path.

## 🗂️ Project Structure

```text
src/config/birthday.ts   All personalized content
src/stages/              The seven experience stages
src/components/          Reusable interactive components
src/lib/                 Audio and visual effects
public/images/           Personal photos
public/audio/            Optional custom audio
.github/workflows/       Automatic GitHub Pages deployment
```

## 🧰 Built With

React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide, canvas-confetti, and bundled web fonts.

## 📄 License

This project is provided as a personal-use starter. Add a license file if you plan to publish or redistribute customized versions publicly.
