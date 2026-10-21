/**
 * Museum backdrops for the stacked contact cards.
 *
 * Photography is read from public/assets/statues/<id>.jpg. Those files ship with
 * the repo rather than coming from a stock-photo CDN, because a remote ID cannot
 * be verified from a build environment without network access — the previous
 * version pointed at three unverifiable Unsplash IDs and rendered nothing.
 *
 * A background-image layer whose URL 404s is skipped by the browser and the next
 * layer shows through, so the chiaroscuro field below is a real fallback that
 * costs no JavaScript and no error handling. Add the photographs and they simply
 * take over; see public/assets/statues/README.md.
 */

/**
 * Layer 1 — the photographs in public/assets/statues (see the README there).
 * Wikimedia fallbacks used to sit under these, but browsers block that host's
 * redirects as cross-origin images (ERR_BLOCKED_BY_ORB) and the local files
 * always covered them anyway, so they only cost three failed requests.
 */
const local = (id) => `url("/assets/statues/${id}.jpg"), `;


/**
 * Marble veining plus film grain. Two turbulence passes: a low-frequency one
 * stretched along the y axis for the veins, and a fine one for the grain that
 * keeps the gradient from banding on large panels.
 */
function stone(seed) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='1000'>` +
      `<filter id='vein'>` +
        `<feTurbulence type='fractalNoise' baseFrequency='0.008 0.05' numOctaves='5' seed='${seed}'/>` +
        `<feColorMatrix type='saturate' values='0'/>` +
        `<feComponentTransfer><feFuncA type='linear' slope='0.42'/></feComponentTransfer>` +
      `</filter>` +
      `<filter id='grain'>` +
        `<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='${seed + 3}'/>` +
        `<feColorMatrix type='saturate' values='0'/>` +
        `<feComponentTransfer><feFuncA type='linear' slope='0.16'/></feComponentTransfer>` +
      `</filter>` +
      `<rect width='100%' height='100%' filter='url(%23vein)'/>` +
      `<rect width='100%' height='100%' filter='url(%23grain)'/>` +
    `</svg>`;
  return `url("data:image/svg+xml;utf8,${svg}")`;
}

/**
 * Chiaroscuro: a hard key light falling across stone into deep shadow, which is
 * how sculpture is lit in a gallery and why the panels read as monochrome
 * photography rather than a flat grey block.
 */
export function marbleBackdrop({ seed, keyX, keyY }) {
  return [
    stone(seed),
    // key light
    `radial-gradient(ellipse 60% 42% at ${keyX}% ${keyY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.22) 30%, rgba(255,255,255,0) 62%)`,
    // bounced fill on the opposite side, so the shadow keeps some detail
    `radial-gradient(ellipse 55% 60% at ${100 - keyX}% ${100 - keyY}%, rgba(190,190,190,0.35) 0%, rgba(190,190,190,0) 70%)`,
    // vignette
    `radial-gradient(ellipse 85% 75% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)`,
    // the stone itself
    `linear-gradient(${140 + seed}deg, #8c8c8c 0%, #565656 38%, #2e2e2e 72%, #101010 100%)`,
  ].join(", ");
}

export const STATUES = {
  contact: {
    // Replaces the David. Draped head to foot, so there is nothing to crop
    // around, and the striding reach suits a panel whose job is "get in touch".
    // With the Venus and the Nike it also makes the set three Louvre marbles
    // rather than one Florentine and two French.
    statue: "Artemis, Diana of Versailles",
    photoLayer:
      local("contact"),
    marble: marbleBackdrop({ seed: 7, keyX: 30, keyY: 20 }),
  },
  contribute: {
    // Draped from the hips down; nothing to crop around.
    statue: "Venus de Milo",
    photoLayer:
      local("contribute"),
    marble: marbleBackdrop({ seed: 19, keyX: 66, keyY: 26 }),
  },
  connect: {
    // Replaces the Apollo Belvedere, which is a full nude. The Nike is fully
    // draped, is marble, and sits in the same Louvre Hellenistic register as
    // the Venus, so the three panels read as one collection.
    statue: "Winged Victory of Samothrace",
    photoLayer:
      local("connect"),
    marble: marbleBackdrop({ seed: 31, keyX: 44, keyY: 14 }),
  },
};
