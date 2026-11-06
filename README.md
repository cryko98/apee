# $APE — ape into lowcaps

Static one-page site for the $APE memecoin on Solana. No build step: `index.html`, `css/style.css`, `js/main.js`.

- **CA:** paste it into `CONFIG.CA` at the top of `js/main.js` on launch day; both "coming soon" pills switch to the address with copy-to-clipboard.
- **X:** https://x.com/apelowcaps
- **Receipts:** the ten @a1lon9 posts are static cards in `index.html`, each linking to the original post.
- **Poster:** `alon-ape-tweets.png` (2048×2048 download), `assets/receipts-poster.webp` (on-page copy).
- **Trailer:** `assets/ape-promo-720.mp4` (hero card, muted autoplay, one tap for sound) + `assets/ape-promo-poster.jpg`. The 1080p master `ape-promo.mp4` stays out of git.

Deploy on Vercel as a static site (framework preset: Other, no build command, output directory `.`).
