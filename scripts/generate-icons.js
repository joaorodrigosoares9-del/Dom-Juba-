import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG with Barber theme: Scissors & Razor in Pepperoni Red & Ocean Blue - DON JUBA
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19"/>
      <stop offset="100%" stop-color="#151D2F"/>
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3856"/>
      <stop offset="100%" stop-color="#E31837"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
  </defs>
  <!-- Background with subtle border -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="#E31837" stroke-width="3" stroke-opacity="0.3"/>
  
  <!-- Barber pole spiral accent circle -->
  <circle cx="256" cy="256" r="195" fill="none" stroke="#1E293B" stroke-width="6"/>
  <circle cx="256" cy="256" r="185" fill="none" stroke="url(#blueGrad)" stroke-width="3" stroke-dasharray="12 12"/>

  <!-- Straight Razor Blade (Stylized) -->
  <g transform="translate(256,256) rotate(-35) translate(-256,-256)">
    <!-- Razor handle -->
    <path d="M 170 330 Q 185 365 240 375 Q 295 385 340 350 Q 300 375 250 365 Q 195 355 180 325 Z" fill="#475569"/>
    <!-- Razor blade -->
    <path d="M 180 325 L 340 180 Q 365 160 350 145 Q 335 130 310 150 L 175 310 Z" fill="url(#blueGrad)"/>
    <!-- Pivot pin -->
    <circle cx="180" cy="325" r="7" fill="#F8FAFC"/>
  </g>

  <!-- Barber Scissor (Crossed) -->
  <g transform="translate(256,256) rotate(35) translate(-256,-256)">
    <!-- Scissor Loop 1 -->
    <circle cx="170" cy="370" r="32" fill="none" stroke="url(#redGrad)" stroke-width="12"/>
    <!-- Scissor Loop 2 -->
    <circle cx="230" cy="390" r="28" fill="none" stroke="url(#redGrad)" stroke-width="12"/>
    <!-- Scissor Shanks -->
    <path d="M 185 345 L 256 265" stroke="url(#redGrad)" stroke-width="14" stroke-linecap="round"/>
    <path d="M 235 365 L 256 265" stroke="url(#redGrad)" stroke-width="14" stroke-linecap="round"/>
    <!-- Pivot -->
    <circle cx="256" cy="265" r="9" fill="#F8FAFC"/>
    <!-- Blade 1 -->
    <path d="M 256 265 L 345 130" stroke="url(#redGrad)" stroke-width="14" stroke-linecap="round"/>
    <!-- Blade 2 -->
    <path d="M 256 265 L 325 155" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
  </g>

  <!-- Central Crest Crown / Monogram "DJ" (Don Juba) -->
  <text x="256" y="278" font-family="'Playfair Display', Georgia, serif" font-weight="900" font-size="74" fill="#FFFFFF" text-anchor="middle" letter-spacing="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.85))">DJ</text>
  
  <!-- Subtle slogan ribbon -->
  <rect x="146" y="420" width="220" height="28" rx="14" fill="#E31837" opacity="0.95"/>
  <text x="256" y="439" font-family="Arial, sans-serif" font-weight="800" font-size="13" fill="#FFFFFF" text-anchor="middle" letter-spacing="2.5">DON JUBA</text>
</svg>`;

// Safe-zone Maskable SVG with extra 15% inner padding
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19"/>
      <stop offset="100%" stop-color="#151D2F"/>
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3856"/>
      <stop offset="100%" stop-color="#E31837"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
  </defs>
  <!-- Full bleed bg -->
  <rect width="512" height="512" fill="url(#bg)"/>
  
  <!-- Content scaled inside 80% circle safe zone (center at 256, radius 180) -->
  <g transform="translate(256, 256) scale(0.75) translate(-256, -256)">
    <circle cx="256" cy="256" r="210" fill="none" stroke="#1E293B" stroke-width="8"/>
    <circle cx="256" cy="256" r="195" fill="none" stroke="url(#blueGrad)" stroke-width="4" stroke-dasharray="12 12"/>

    <g transform="translate(256,256) rotate(-35) translate(-256,-256)">
      <path d="M 170 330 Q 185 365 240 375 Q 295 385 340 350 Q 300 375 250 365 Q 195 355 180 325 Z" fill="#475569"/>
      <path d="M 180 325 L 340 180 Q 365 160 350 145 Q 335 130 310 150 L 175 310 Z" fill="url(#blueGrad)"/>
      <circle cx="180" cy="325" r="7" fill="#F8FAFC"/>
    </g>

    <g transform="translate(256,256) rotate(35) translate(-256,-256)">
      <circle cx="170" cy="370" r="32" fill="none" stroke="url(#redGrad)" stroke-width="12"/>
      <circle cx="230" cy="390" r="28" fill="none" stroke="url(#redGrad)" stroke-width="12"/>
      <path d="M 185 345 L 256 265" stroke="url(#redGrad)" stroke-width="14" stroke-linecap="round"/>
      <path d="M 235 365 L 256 265" stroke="url(#redGrad)" stroke-width="14" stroke-linecap="round"/>
      <circle cx="256" cy="265" r="9" fill="#F8FAFC"/>
      <path d="M 256 265 L 345 130" stroke="url(#redGrad)" stroke-width="14" stroke-linecap="round"/>
      <path d="M 256 265 L 325 155" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
    </g>

    <text x="256" y="278" font-family="'Playfair Display', Georgia, serif" font-weight="900" font-size="74" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">DJ</text>
    
    <rect x="146" y="420" width="220" height="30" rx="15" fill="#E31837"/>
    <text x="256" y="440" font-family="Arial, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle" letter-spacing="2.5">DON JUBA</text>
  </g>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), svgMaskable);

  // 192x192
  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512
  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Maskable 512x512
  await sharp(Buffer.from(svgMaskable))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Apple Touch Icon 180x180
  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Favicon 64x64 png / ico
  await sharp(Buffer.from(svgIcon))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All Don Juba PWA icons successfully generated in public/ directory!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
