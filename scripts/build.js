/**
 * Reveal.js Slide Builder Script
 * Automatically combines all modular slide files in slides/*.html into index.html
 */

const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, '..', 'slides');
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

console.log('📦 Compiling modular slides from slides/ into index.html...');

try {
  // Read and sort slide files alphabetically
  const slideFiles = fs.readdirSync(SLIDES_DIR)
    .filter(file => file.endsWith('.html'))
    .sort();

  console.log(`Found ${slideFiles.length} slide files:`, slideFiles);

  let combinedSlidesHTML = '';

  slideFiles.forEach(file => {
    const filePath = path.join(SLIDES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8').trim();
    combinedSlidesHTML += `\n\n      <!-- Loaded from slides/${file} -->\n${content}`;
  });

  // Load base template or update index.html
  let indexHTML = fs.readFileSync(INDEX_PATH, 'utf8');

  // Replace content inside <div class="slides">...</div>
  const slidesRegex = /(<div class="slides">)([\s\S]*?)(<\/div>\s*<\/div>\s*<!-- Custom Navigation Overlay -->)/;

  if (slidesRegex.test(indexHTML)) {
    indexHTML = indexHTML.replace(slidesRegex, `$1${combinedSlidesHTML}\n    $3`);
    fs.writeFileSync(INDEX_PATH, indexHTML, 'utf8');
    console.log('✅ Successfully compiled index.html with all modular slides!');
  } else {
    console.error('❌ Error: Could not locate <div class="slides"> container in index.html');
  }

} catch (err) {
  console.error('❌ Error building slides:', err.message);
}
