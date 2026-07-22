/**
 * Reveal.js Slide Builder Script
 * Automatically combines modular slide files listed in slides/slides.json into index.html
 */

const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, '..', 'slides');
const MANIFEST_PATH = path.join(SLIDES_DIR, 'slides.json');
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

console.log('📦 Compiling modular slides into index.html...');

try {
  let slideFiles = [];

  if (fs.existsSync(MANIFEST_PATH)) {
    console.log('📋 Reading slide order from slides/slides.json...');
    const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
    slideFiles = JSON.parse(manifestContent);
  } else {
    console.log('⚠️ Warning: slides/slides.json not found. Falling back to alphabetical order.');
    slideFiles = fs.readdirSync(SLIDES_DIR)
      .filter(file => file.endsWith('.html'))
      .sort();
  }

  console.log(`Loading ${slideFiles.length} slides in order:`, slideFiles);

  let combinedSlidesHTML = '';

  slideFiles.forEach(file => {
    const filePath = path.join(SLIDES_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Warning: Slide file "${file}" listed in slides.json does not exist! Skipping...`);
      return;
    }
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
