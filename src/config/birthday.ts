/**
 * ─────────────────────────────────────────────────────────────
 *  🎂  EDIT EVERYTHING ABOUT THE SURPRISE HERE
 * ─────────────────────────────────────────────────────────────
 *  You never need to touch the components to change text,
 *  photos, gift details or sounds. Save the file and the site
 *  updates (in dev) or rebuild (for deploy).
 *
 *  Emoji are fine anywhere. Line breaks: use separate array
 *  items for separate paragraphs.
 */

const name = 'Habil';
const age = 25;

export const birthday = {
  name,
  age,

  /** The birthday, as YYYY-MM-DD (local time of whoever opens the site). */
  birthdayDate: '2026-11-12',
  /** How the date is shown on screen. */
  birthdayDateLabel: '12 November 2026',

  /** Who it's from — shown as the sign-off on the final letter. */
  signature: 'With all my love, me ❤️',

  // ── Stage 1 · Welcome ────────────────────────────────────────
  welcome: {
    teaser: `Psst... ${name} 👀`,
    line: 'Someone has prepared something special for you...',
    button: 'Open Your Surprise 🎁',
    /** Replaces the teaser on the actual birthday. */
    birthdayModeTeaser: `It's finally the day, ${name} 👑`,
    loadingText: 'Wrapping up something special...',
  },

  // ── Stage 2 · Celebration + cake ─────────────────────────────
  celebration: {
    title: `HAPPY ${age}TH BIRTHDAY, ${name.toUpperCase()}! 🎂`,
    wishPrompt: 'Close your eyes and make a wish... 🤫',
    wishButton: "I've made my wish ✨",
    blowButton: 'Blow the candles 🌬️',
    micButton: 'Or blow into the mic 🎤',
    afterBlow: 'Yay! Your wish is on its way ✨',
    message: [
      `Happy ${age}th Birthday, ${name}! ❤️`,
      'Another year older, another year of making memories.',
      "I hope this year brings you endless happiness, beautiful moments, lots of laughter, and everything you've been wishing for.",
      "Today is all about you, so get ready for a little surprise I've prepared!",
      "And yes... there's more than one surprise. 🤭❤️",
    ],
    nextButton: 'Show me more →',
  },

  // ── Stage 3 · Memories ───────────────────────────────────────
  memories: {
    heading: 'A Little Collection of Memories 📸',
    subheading: 'Every memory deserves a little space here. And there are many more to come. ❤️',
    /**
     * Put your photos in /public/images/ and list them here.
     * orientation: 'portrait' | 'landscape' | 'square'
     * caption is optional — use '' to hide it.
     * A missing file automatically shows a cute placeholder.
     */
    photos: [
      { src: '/images/memory-1.jpg', caption: 'Where it all started ✨', orientation: 'portrait' },
      { src: '/images/memory-2.jpg', caption: 'That one day we laughed too much', orientation: 'landscape' },
      { src: '/images/memory-3.jpg', caption: 'Food dates are the best dates 🍜', orientation: 'portrait' },
      { src: '/images/memory-4.jpg', caption: 'My favourite view', orientation: 'square' },
      { src: '/images/memory-5.jpg', caption: 'Adventure mode: ON', orientation: 'landscape' },
      { src: '/images/memory-6.jpg', caption: 'Us being us 🤭', orientation: 'portrait' },
      { src: '/images/memory-7.jpg', caption: 'Little moments, big smiles', orientation: 'portrait' },
      { src: '/images/memory-8.jpg', caption: 'To many more like this ❤️', orientation: 'landscape' },
    ] as Photo[],
    nextButton: 'Okay, what else? 👀',
  },

  // ── Stage 4 · The A / B / C / D question ─────────────────────
  choice: {
    question: 'Remember when I asked you to choose A, B, C or D? 👀',
    hint: 'You picked A... remember?',
    chosen: 'A',
    /**
     * image: shown on the card once it flips (put files in /public/images/choice/).
     * Use '' for no photo (falls back to the emoji).
     * credit: required for the Creative Commons photos below. Keep it if you keep the photo.
     */
    options: [
      {
        letter: 'A',
        label: 'Buffet',
        emoji: '🍖',
        image: 'images/choice/a-buffet.jpg',
        credit: { author: 'Geoffreyrabbit', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Grilled_meat_collection_in_buffet.jpg' },
      },
      {
        letter: 'B',
        label: 'LEGOLAND',
        emoji: '🧱',
        image: 'images/choice/b-legoland.jpg',
        credit: { author: 'milst1', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Entrance_Legoland_Malaysia.jpg' },
      },
      {
        letter: 'C',
        label: '5-Star Hotel',
        emoji: '🏨',
        image: 'images/choice/c-hotel.jpg',
        credit: { author: 'Basile Morin', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Canopy_bed_of_Amantaka_Suite_in_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg' },
      },
      {
        letter: 'D',
        label: 'Genting Highlands',
        emoji: '🚠',
        image: 'images/choice/d-genting.jpg',
        credit: { author: 'Chongkian', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Awana_Skyway.jpg' },
      },
    ] as ChoiceOption[],
    /** Shown if he taps B, C or D first. */
    wrongTapLines: [
      'Nice try 😏 You picked A!',
      'Nope, no take-backs 🙅',
      'A. You literally said A. 😂',
      'The A card is right there, glowing at you ✨',
    ],
    notChosenLabel: 'not this time 😜',
    nextButton: 'Unwrap my treat 🎁',
  },

  // ── Stage 5 · Gift A · Buffet ────────────────────────────────
  buffet: {
    youChose: 'YOU CHOSE A! 🎉',
    intro: 'Your Birthday Treat Is...',
    headline: 'A BUFFET DATE! 🍖🔥',
    restaurant: 'King of the Grill',
    venue: 'The Pearl Hotel',
    message: 'Good food, a happy tummy, and a birthday date together! ❤️',
    voucherTitle: 'Birthday Treat Voucher',
    voucherNote: 'Admit: one very hungry birthday boy + me',
    detailsButton: 'Reveal more details',
    /**
     * Shown when he taps "Reveal more details".
     * Only put real details here — e.g. change "When" to the actual
     * date & time once you know it.
     */
    details: [
      { label: 'What', value: 'An all-you-can-eat buffet date 🍖' },
      { label: 'Where', value: 'King of the Grill, The Pearl Hotel' },
      { label: 'Who', value: `${name} & me ❤️` },
      { label: 'When', value: "It's a secret... I'll tell you soon 🤫" },
      { label: 'Dress code', value: 'Stretchy pants recommended 😋' },
    ],
    nextButton: "I'm so full 😋 →",
  },

  // ── Stage 6 · Bonus surprise · Theme park ────────────────────
  bonus: {
    lines: ['Wait a minute...', 'Did you really think that was your only present? 👀'],
    nope: 'NOPE! 🤭',
    oneMore: 'ONE MORE SURPRISE!',
    tapHint: 'Tap the box 3 times to open!',
    headline: 'BONUS BIRTHDAY SURPRISE! 🎢🎟️',
    place: 'BERJAYA TIMES SQUARE THEME PARK!',
    ticketPlace: 'Berjaya Times Square Theme Park',
    /** Photo at the top of the ticket ('' to hide). Keep the credit if you keep this photo. */
    ticketPhoto: 'images/bonus/theme-park.jpg',
    ticketPhotoCredit: { author: 'Cmglee', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Berjaya_Times_Square_theme_park.jpg' } as
      | { author: string; license: string; url: string }
      | null,
    ticketLabel: 'Birthday Surprise Voucher',
    ticketGoodFor: 'Good for: one day of rides, screams & laughs together',
    /** Keep this unless you add real ticket details. */
    ticketFinePrint: 'A birthday gift announcement — not an admission ticket.',
    lines2: [
      'Because your birthday deserves more than just good food...',
      "Let's eat, play, laugh, and make more memories together! ❤️",
    ],
    nextButton: 'One more thing... →',
  },

  // ── Stage 7 · Final message ──────────────────────────────────
  final: {
    heading: `Here's to ${age}, ${name}. ❤️`,
    message: [
      `I hope your ${age}th birthday is filled with happiness, laughter, good food, fun adventures, and unforgettable memories.`,
      "I hope you enjoy the little surprises I've planned for you.",
      'You deserve a wonderful birthday, and I hope this one makes you smile.',
      `Happy Birthday again, ${name}! ❤️`,
    ],
    button: 'One Last Birthday Surprise ✨',
    finaleTitle: `HAPPY BIRTHDAY ${name.toUpperCase()}!`,
    replayButton: 'Replay the whole surprise 🔁',
    againButton: 'Celebrate again 🎉',
  },

  // ── Hidden Easter egg (tap the big "25" five times) ──────────
  easterEgg: {
    title: 'Secret unlocked 🤫',
    message: `You found the hidden message! Fun fact: ${age} looks really good on you. Now go back and enjoy the rest of your surprise 😚`,
  },

  // ── Sound ────────────────────────────────────────────────────
  audio: {
    /**
     * Background music. Put an mp3 in /public/audio/ and set the path,
     * e.g. '/audio/birthday-music.mp3'.
     * Leave '' to use the built-in soft music-box "Happy Birthday".
     */
    music: '',
    musicVolume: 0.35,
    /**
     * Optional custom sound effects (mp3 in /public/audio/).
     * Leave '' to use the built-in synthesized sounds.
     */
    sfx: {
      open: '',
      pop: '',
      chime: '',
      fanfare: '',
      blow: '',
    },
  },
};

export type Photo = {
  src: string;
  caption?: string;
  orientation: 'portrait' | 'landscape' | 'square';
};

export type ChoiceOption = {
  letter: string;
  label: string;
  emoji: string;
  image?: string;
  credit?: { author: string; license: string; url: string };
};

export type BirthdayConfig = typeof birthday;
