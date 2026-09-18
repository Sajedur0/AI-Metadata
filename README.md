# Remove AI Label & Metadata from Photos

TypeScript browser-only tool that strips C2PA, XMP, EXIF, and PNG text chunks by re-encoding images on-device. Nothing is uploaded.

## Run

```bash
npm install
npm run dev
```

## Stack

- Vite + TypeScript
- Design tokens from `DESIGN.md` (`src/tokens.css`)
- Clean logic in `src/clean.ts`
