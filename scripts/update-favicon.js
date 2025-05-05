// Simple script to update the favicon.ico file with a data URI from zenflow-favicon.svg
const fs = require('fs');
const path = require('path');

// Base64 encoded version of zenflow-favicon.svg with proper colors
const faviconBase64 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8A2BE2" />
      <stop offset="100%" stop-color="#20B2AA" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="#FFFFFF" />
  <path d="M20,20 L80,20 L35,50 C30,55 35,65 45,60 C60,55 70,40 85,40 C90,45 80,55 70,60 C55,70 30,65 25,55 C20,45 25,35 35,30 L80,30" 
        stroke="url(#faviconGradient)" 
        stroke-width="8" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        fill="none" />
</svg>
`;

// Create an HTML file to test the favicon
const testFaviconHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZenFlow Favicon Test</title>
  <link rel="icon" href="data:image/svg+xml;base64,${Buffer.from(faviconBase64).toString('base64')}" type="image/svg+xml">
</head>
<body>
  <h1>ZenFlow Favicon Test</h1>
  <p>Check your browser tab to see the favicon.</p>
</body>
</html>
`;

// Generate the test HTML file
fs.writeFileSync(path.join(__dirname, '../public/test-favicon.html'), testFaviconHtml);

// Update the favicon info
const faviconInfo = `
# ZenFlow Favicon Updated

The ZenFlow favicon has been updated to use a direct SVG data URI.

Current implementation:
- The favicon is embedded as a data URI in the index.html file
- The SVG version is available at public/zenflow-favicon.svg
- Test page available at public/test-favicon.html

For a production-ready solution, consider using:
- favicon.io or realfavicongenerator.net to create multiple sizes
- Convert the SVG to .ico format for broader compatibility
`;

fs.writeFileSync(path.join(__dirname, '../public/favicon-info.md'), faviconInfo);

// Create the base64 export file
const base64ExportJs = `
// Base64 encoded version of the ZenFlow favicon SVG
// Use this to embed the favicon directly in HTML
export const zenflowFaviconBase64 = "${Buffer.from(faviconBase64).toString('base64')}";

// HTML link tag for direct embedding
export const zenflowFaviconLinkTag = '<link rel="icon" href="data:image/svg+xml;base64,${Buffer.from(faviconBase64).toString('base64')}" type="image/svg+xml">';
`;

fs.writeFileSync(path.join(__dirname, '../public/zenflow-favicon-base64.js'), base64ExportJs);

console.log('ZenFlow favicon files updated:');
console.log('1. Test HTML page created at public/test-favicon.html');
console.log('2. Base64 export created at public/zenflow-favicon-base64.js');
console.log('3. Information updated in public/favicon-info.md');
console.log('\nUpdate your index.html to use the data URI favicon for immediate effect.'); 