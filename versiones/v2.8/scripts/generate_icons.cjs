const fs = require('fs');
const path = require('path');

const colors = {
    emerald: { start: '#10b981', end: '#047857' },
    blue: { start: '#0284c7', end: '#0369a1' },
    purple: { start: '#9333ea', end: '#6b21a8' },
    rose: { start: '#e11d48', end: '#9f1239' },
    amber: { start: '#d97706', end: '#92400e' },
};

const bioLoopEmblemSvg = `
<svg viewBox="0 0 100 100" style="width: 320px; height: 320px; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.2));">
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
          stroke="#ffffff" 
          stroke-width="8.2" />
    
    <!-- Organic Eco Leaf inside the upper bowl -->
    <path d="M 46 58 
             C 41 46, 44 32, 58 22 
             C 69 32, 68 47, 56 56 
             C 52 59, 48 59, 46 58 Z" 
          fill="rgba(255,255,255,0.24)" 
          stroke="#ffffff" 
          stroke-width="4.8" />
          
    <!-- Dynamic leaf vein -->
    <path d="M 48 56 C 52 44, 55 34, 57 24" 
          stroke="#ffffff" 
          stroke-width="2.8" 
          stroke-linecap="round" 
          stroke-opacity="0.9" />
  </g>
</svg>
`;

const tempDir = path.join(__dirname, 'temp_icons');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// Generate 512x512 master HTMLs for each color (square and round)
for (const [name, grad] of Object.entries(colors)) {
    // Square
    const squareHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 512px; height: 512px; overflow: hidden; background: transparent; }
  .canvas {
    width: 512px; height: 512px;
    background: linear-gradient(135deg, ${grad.start} 0%, ${grad.end} 100%);
    border-radius: 110px;
    display: flex; align-items: center; justify-content: center;
  }
</style>
</head>
<body>
  <div class="canvas">
    ${bioLoopEmblemSvg}
  </div>
</body>
</html>`;

    // Round
    const roundHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 512px; height: 512px; overflow: hidden; background: transparent; }
  .canvas {
    width: 512px; height: 512px;
    background: linear-gradient(135deg, ${grad.start} 0%, ${grad.end} 100%);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
</style>
</head>
<body>
  <div class="canvas">
    ${bioLoopEmblemSvg}
  </div>
</body>
</html>`;

    fs.writeFileSync(path.join(tempDir, `${name}_square.html`), squareHtml);
    fs.writeFileSync(path.join(tempDir, `${name}_round.html`), roundHtml);
}

console.log('HTML templates with new Bio-Loop R written successfully');
