// Simple script to generate a basic favicon.ico file with the ZenFlow logo
// This creates a placeholder since we can't directly manipulate binary files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a very basic favicon - this is just a placeholder
// In a real scenario, you would use a proper image conversion library
function createBasicFavicon() {
  // This creates a very simple .ico file structure
  // A proper implementation would use a library like 'png-to-ico' or similar
  
  // Simple 16x16 ico file header + basic content
  const header = Buffer.from([
    0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 
    0x00, 0x00, 0x01, 0x00, 0x04, 0x00, 0x28, 0x01, 
    0x00, 0x00, 0x16, 0x00, 0x00, 0x00
  ]);
  
  // Very simplified purple-teal gradient representation
  // This is a placeholder - in reality you'd want to use proper image conversion
  const pixelData = Buffer.alloc(256);
  for (let i = 0; i < 256; i++) {
    // Simple gradient pattern with purple-teal colors
    const value = Math.floor((i % 16) / 15 * 255);
    // Add some purple-teal gradient colors
    pixelData[i] = (i % 2 === 0) ? 0x8A : 0x20;  // Simplified violet/teal representation
  }
  
  const iconData = Buffer.concat([header, pixelData]);
  
  // Write to the favicon.ico file
  try {
    fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), iconData);
    console.log('Basic favicon.ico file created');
    console.log('Note: This is just a placeholder. For a proper favicon:');
    console.log('1. Use the SVG from public/zenflow-favicon.svg');
    console.log('2. Convert it using a tool like favicon.io or realfavicongenerator.net');
  } catch (err) {
    console.error('Error creating favicon:', err);
  }
}

// Create a notice file with instructions
function createInstructions() {
  const instructions = `# ZenFlow Favicon
  
This is a placeholder favicon for the ZenFlow brand.

For a proper favicon:
1. Use the SVG from public/zenflow-favicon.svg
2. Convert it using a tool like favicon.io or realfavicongenerator.net
3. Replace the favicon.ico file in the public directory

The brand colors are:
- Primary Gradient: Violet (#8A2BE2) to Teal (#20B2AA)
- Secondary Violet: #9370DB
- Accent Teal: #48D1CC
`;

  try {
    fs.writeFileSync(path.join(__dirname, '../public/FAVICON-INSTRUCTIONS.md'), instructions);
    console.log('Instruction file created');
  } catch (err) {
    console.error('Error creating instruction file:', err);
  }
}

// Make sure the scripts directory exists
if (!fs.existsSync(path.join(__dirname, '../public'))) {
  fs.mkdirSync(path.join(__dirname, '../public'), { recursive: true });
}

createBasicFavicon();
createInstructions();

console.log('ZenFlow branding updated!');
console.log('Remember to follow the instructions in public/FAVICON-INSTRUCTIONS.md to create a proper favicon.'); 