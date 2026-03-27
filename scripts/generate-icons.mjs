// TODO: Replace with actual Bacachito Feliz icons
// This script generates placeholder PNG icons for PWA manifest.
// Run once: node scripts/generate-icons.mjs

import { writeFileSync, mkdirSync } from 'fs';

function createPlaceholderSVG(size) {
  const fontSize = Math.round(size * 0.12);
  const emojiSize = Math.round(size * 0.3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.15)}" fill="url(#bg)"/>
  <text x="50%" y="45%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}">🍾</text>
  <text x="50%" y="78%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial,sans-serif" font-weight="900" font-size="${fontSize}">BACACHITO</text>
</svg>`;
}

function createMaskableSVG(size) {
  const fontSize = Math.round(size * 0.1);
  const emojiSize = Math.round(size * 0.25);
  // Maskable icons need safe zone (inner 80%)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <text x="50%" y="42%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}">🍾</text>
  <text x="50%" y="68%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial,sans-serif" font-weight="900" font-size="${fontSize}">BACACHITO</text>
</svg>`;
}

function createSplashSVG(width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <text x="50%" y="40%" text-anchor="middle" dominant-baseline="middle" font-size="${Math.round(width * 0.12)}">🍾</text>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial,sans-serif" font-weight="900" font-size="${Math.round(width * 0.05)}">BACACHITO FELIZ</text>
</svg>`;
}

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const maskableSizes = [192, 512];
const splashSizes = [
  [1290, 2796],
  [1179, 2556],
  [1170, 2532],
  [1125, 2436],
];

// Icons
for (const size of iconSizes) {
  writeFileSync(`public/icons/icon-${size}x${size}.svg`, createPlaceholderSVG(size));
  console.log(`Created icon-${size}x${size}.svg`);
}

// Maskable icons
for (const size of maskableSizes) {
  writeFileSync(`public/icons/icon-maskable-${size}x${size}.svg`, createMaskableSVG(size));
  console.log(`Created icon-maskable-${size}x${size}.svg`);
}

// Splash screens
for (const [w, h] of splashSizes) {
  writeFileSync(`public/splash/splash-${w}x${h}.svg`, createSplashSVG(w, h));
  console.log(`Created splash-${w}x${h}.svg`);
}

// Screenshot placeholder
writeFileSync(`public/screenshots/game-screenshot-1.svg`, createSplashSVG(1080, 1920));
console.log('Created game-screenshot-1.svg');

console.log('\n⚠️  These are SVG placeholders. Replace with actual PNG icons before deploying.');
console.log('Update manifest.json icon paths from .png to .svg OR convert these to PNG.');
