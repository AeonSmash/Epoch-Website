# Favicon Setup Instructions

## Steps to Add Your Dragon Image as Favicon

1. **Place your dragon image** in this `public/` directory
   - Name it something like `dragon.png` or `dragon.jpg`
   - Recommended: Use a square image (1:1 aspect ratio) for best results
   - Recommended size: At least 512x512 pixels

2. **Convert to Favicon Formats**

   You can use one of these methods:

   ### Option A: Online Tool (Easiest)
   - Go to https://realfavicongenerator.net/
   - Upload your dragon image
   - It will generate all required sizes automatically
   - Download and place the generated files in the `public/` directory:
     - `favicon.ico`
     - `favicon-16x16.png`
     - `favicon-32x32.png`
     - `apple-touch-icon.png` (180x180)

   ### Option B: ImageMagick (Command Line)
   ```bash
   # Install ImageMagick first, then:
   convert dragon.png -resize 16x16 favicon-16x16.png
   convert dragon.png -resize 32x32 favicon-32x32.png
   convert dragon.png -resize 180x180 apple-touch-icon.png
   convert dragon.png -resize 256x256 favicon.ico
   ```

   ### Option C: Using Node.js Package
   ```bash
   npm install -g to-ico
   # Then convert PNG to ICO
   to-ico dragon.png > favicon.ico
   ```

3. **Required Files** (place in `public/` directory):
   - `favicon.ico` (16x16, 32x32, or 48x48)
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png` (180x180 for iOS devices)

4. **The HTML is already configured** - just add the files!

## Quick Test
After adding the files, the favicon should appear in:
- Browser tabs
- Bookmarks
- Mobile home screen (when saved)

