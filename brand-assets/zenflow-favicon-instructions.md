# ZenFlow Favicon Creation Instructions

To create the ZenFlow favicon for your project, follow these steps:

## Option 1: Using Online Tools (Recommended)

1. **Export the SVG**:
   - Open the `zenflow-logo.html` file in a browser
   - Right-click on the favicon preview and select "Save Image As" or use browser developer tools to copy the SVG code
   - Save as `zenflow-favicon.svg`

2. **Convert to ICO using an online service**:
   - Visit [Favicon.io](https://favicon.io/favicon-converter/) or [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Upload your SVG file
   - Generate the favicon package
   - Download the .ico file

3. **Implement the favicon**:
   - Replace the existing `public/favicon.ico` file with your new file
   - Remember to also update any HTML references if needed

## Option 2: Using Image Editing Software

1. **Create a new 32x32 pixel canvas** in an image editor like GIMP, Photoshop, or Figma

2. **Recreate the design**:
   - Create a stylized "Z" that flows into a wave
   - Use the gradient from #8A2BE2 (violet) to #20B2AA (teal)
   - Ensure the stroke is thick enough to be visible at small sizes

3. **Export as .ico**:
   - Most professional image editors can export directly to .ico format
   - If not, export as PNG and use a converter like [ConvertICO](https://convertico.com/)

## Option 3: Generate from Text

If you prefer a simpler approach using just the letter "Z" with styling:

1. Use an online favicon generator like [Favicon.cc](https://www.favicon.cc/) or [Favicon.io](https://favicon.io/favicon-generator/)
2. Enter "Z" as the text
3. Select a gradient fill or the primary violet color (#8A2BE2)
4. Style as needed and download the .ico file

## SVG Code for Reference

```svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8A2BE2" />
            <stop offset="100%" stop-color="#20B2AA" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="none" />
    <!-- Simplified Z for favicon -->
    <path d="M20,20 L80,20 L35,50 C30,55 35,65 45,60 C60,55 70,40 85,40 C90,45 80,55 70,60 C55,70 30,65 25,55 C20,45 25,35 35,30 L80,30" 
          stroke="url(#faviconGradient)" 
          stroke-width="8" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          fill="none" />
</svg>
``` 