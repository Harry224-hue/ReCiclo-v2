const fs = require('fs');
const path = require('path');

const bioLoopEmblemSvg = `
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main R continuous ribbon -->
    <path d="M 28 82 
             L 28 40 
             C 28 22, 42 14, 58 14 
             C 74 14, 84 25, 84 42 
             C 84 57, 72 66, 54 66 
             L 42 66 
             C 52 66, 60 71, 66 77 
             L 74 84" 
          stroke="url(#recicloGrad)" 
          stroke-width="8" />
    
    <!-- Organic Eco Leaf inside the upper bowl -->
    <path d="M 46 58 
             C 41 46, 44 32, 58 22 
             C 69 32, 68 47, 56 56 
             C 52 59, 48 59, 46 58 Z" 
          fill="url(#leafFill)" 
          stroke="url(#recicloGrad)" 
          stroke-width="4.5" />
          
    <!-- Dynamic leaf vein -->
    <path d="M 48 56 C 52 44, 55 34, 57 24" 
          stroke="#ffffff" 
          stroke-width="2.6" 
          stroke-linecap="round" 
          stroke-opacity="0.85" />
  </g>
`;

const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 512px; height: 512px; background: #09090b; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  svg { width: 330px; height: 330px; filter: drop-shadow(0 10px 25px rgba(16, 185, 129, 0.25)); }
  .wordmark { display: flex; align-items: baseline; margin-top: 6px; }
  .title-re { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 42px; font-weight: 800; color: #10b981; letter-spacing: -0.8px; }
  .title-ciclo { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 42px; font-weight: 700; color: #f4f4f5; letter-spacing: -0.8px; }
  .subtitle { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #71717a; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
</style>
</head>
<body>
  <svg viewBox="0 0 100 100">
    <defs>
      <linearGradient id="recicloGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="45%" stop-color="#14b8a6" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>
      <linearGradient id="leafFill" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.55" />
      </linearGradient>
    </defs>
    ${bioLoopEmblemSvg}
  </svg>
  <div class="wordmark">
    <span class="title-re">Re</span><span class="title-ciclo">Ciclo</span>
  </div>
  <div class="subtitle">Visión Inteligente</div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'temp_icons/bio_loop_preview.html'), fullHtml);
console.log('Bio Loop preview updated');
