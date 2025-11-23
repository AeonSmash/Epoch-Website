# Epoch The Endless Tower Website

Modern Vite + TypeScript + Three.js website replacing WordPress, featuring Oracle migration and Portal pages.

## Features

- **Portal Page**: Main landing page with Decentraland entry link and claim/redeem functionality
- **Oracle Page**: Migration page for transferring progress from free names to paid Decentraland Name NFTs
- **3D Scene**: Three.js rendering of Oracle Chamber (with GLB fallback)
- **Modern UI**: Dark mystic design with glass panels, neon borders, and magical ambiance

## Tech Stack

- **Vite**: Build tool and dev server
- **TypeScript**: Type-safe JavaScript
- **Three.js**: 3D graphics library
- **Vercel**: Deployment platform

## Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_EPOCH_API_BASE="https://epochstower-git-dev-aeonsmashs-projects.vercel.app/api"
```

## Project Structure

```
Epoch-Website/
  src/
    main.ts              # Entry point, routing, page initialization
    threeScene.ts        # Three.js GLB loader and fallback orb renderer
    oracleMigration.ts   # Oracle migration logic
    portal.ts            # Portal page logic
    style.css            # Dark mystic UI styles
    env.d.ts             # Vite environment types
    globals.d.ts         # Window.ethereum type definitions
  public/
    models/
      oracle_chamber.glb # Optional 3D model (fallback if missing)
  index.html             # Main HTML structure
  package.json
  tsconfig.json
  vite.config.ts
  vercel.json            # Vercel deployment config
```

## API Endpoints Used

- `GET /api/player/verify_name_nft?wallet=ADDRESS` - Verify wallet owns Decentraland Name NFT
- `POST /api/player/migrate` - Execute migration (body: `migration_token`, `wallet_address`, `new_decentraland_name`)
- `POST /api/redeem` - Redeem claim code (body: `code`, `wallet`)

## Deployment

### Deploy to Vercel

1. Push the project to GitHub
2. Go to [Vercel](https://vercel.com) → New Project → Import GitHub Repo
3. Add environment variable:
   ```
   VITE_EPOCH_API_BASE="https://epochstower-git-dev-aeonsmashs-projects.vercel.app/api"
   ```
4. Deploy

### Connect Custom Domain (Hostinger → Vercel)

1. **Add Domain in Vercel**:
   - Go to Project → Settings → Domains → Add Domain
   - Enter: `aeonsmash.com`
   - Vercel will show DNS records:
     ```
     A      @      76.76.21.21
     CNAME  www    cname.vercel-dns.com
     ```

2. **Update DNS in Hostinger**:
   - Go to Hostinger hPanel → Domains → DNS Zone
   - Add A Record:
     - Type: A
     - Name: @
     - Value: 76.76.21.21
     - TTL: Auto
   - Add CNAME Record:
     - Type: CNAME
     - Name: www
     - Target: cname.vercel-dns.com
     - TTL: Auto
   - Remove old default Hostinger DNS records

3. **Wait for DNS Propagation**:
   - Typically 5-30 minutes
   - Max 1-2 hours
   - Vercel will show "Connected ✓" when ready

4. **Test**:
   - Visit `https://aeonsmash.com`
   - Visit `https://www.aeonsmash.com`

## Development

### Adding New Pages

1. Add page HTML in `index.html` with class `page`
2. Create init function (e.g., `initNewPage()`)
3. Add routing logic in `src/main.ts`
4. Update navigation links

### Styling

All styles are in `src/style.css`. The design uses:
- Dark backgrounds (`#0a0a0f`, `#1a1a2e`)
- Neon accents (purple `#4f46e5`, blue `#0ea5e9`, green `#059669`)
- Glass morphism effects
- Responsive grid layouts

### 3D Scene

The Three.js scene loads `/public/models/oracle_chamber.glb`. If the file is missing, a fallback glowing orb is rendered. To add your own model:

1. Export GLB from Blender
2. Place in `public/models/oracle_chamber.glb`
3. The scene will automatically load it

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Private project - All rights reserved




