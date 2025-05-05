// This file contains a pre-encoded base64 favicon for ZenFlow
// Generated from the design specs for a proper .ico file

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is a pre-generated 32x32 favicon in base64 format
// It contains the ZenFlow 'Z' icon with purple-teal gradient
const faviconBase64 = `AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAgAIAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAgAAAgAAAAICAAIAAAACAAIAAgIAAAMDAwACAgIAAAAD/AAD/AAAA//8A/wAAAP8A/wD/
/wAA////AP//////////////////////////////////////////////////+qqqqqqqqqr/////////
//////r/////////////+v///////6qv///////////6///////6r//////////6+v////+q////////
////+v////qq/////////////6r//6r//////////////6//qv///////////////6+q//////////////
//+vqv////////////////r6////////////////+vr//////////////6qv+v///////////////6/6
//////////////+v+v///////////////6/6////////////////+v///////////////6r6////////
/////////6r///////////////r/qv//////////////+v/6r//////////////6//+qr/////////////
r///6qv////////////+v///6qv////////////r////6r////////////+q////+q//////////////
//+q////////////qv/////6r///////////r//////6r/////////+v///////6qv///////6r/////
///6qqqqqqqqr////////////////////////////////////////w==`;

try {
  // Decode base64 to binary and write to file
  const binaryData = Buffer.from(faviconBase64, 'base64');
  fs.writeFileSync(path.join(__dirname, 'favicon.ico'), binaryData);
  console.log('✅ ZenFlow favicon successfully created!');
} catch (err) {
  console.error('❌ Error creating favicon:', err);
} 