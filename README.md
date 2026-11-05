# 💌 A Letter For You

A small, cinematic love letter website: an ivory envelope with a wax seal opens,
flowers burst out, your photos float into the air, and a letter unfolds and
writes itself. It ends with a bouquet and a last little note.

Built with **React + TypeScript + Tailwind CSS + Motion (Framer Motion)**.

## 🚀 Publishing on Vercel

1. Go to https://vercel.com/new and sign in with GitHub.
2. Import **hotmanpvv/yaya**. Leave every setting as it is, since `vercel.json` takes care of them.
3. Optional: change the project name. It becomes the link, e.g. `a-letter-for-you` → `https://a-letter-for-you.vercel.app`.
4. Click **Deploy**. Every later push redeploys automatically.

### Link preview
When you send the link, WhatsApp, iMessage, Instagram and others show a card with an envelope and **"Open me"** (`public/og.jpg`, 1200×630). The site's address is filled in automatically on Vercel. To regenerate the card, run `npm run dev`, open `http://localhost:5173/?og` at 1200×630 and take a screenshot.

---

## 📸 Adding your photos

### Option A: from the GitHub website (no installs)

1. Open the folder **`public/photos/`** on GitHub.
2. Click **Add file → Upload files**, drop in your pictures (`.jpg`, `.png`, `.webp`, `.avif`, `.gif`) and commit.
3. Vercel rebuilds the site automatically. New photos are added to the list on their own (in file-name order).
4. *(Optional)* To add captions, edit `public/photos/photos.json` on GitHub:

```json
{
  "photos": [
    { "src": "01-first-coffee.jpg", "caption": "our first coffee ☕" },
    { "src": "02-beach.jpg", "caption": "that windy day", "focus": "50% 75%" },
    { "src": "03-us.jpg" }
  ]
}
```

- `src`: the file name inside `public/photos/`
- `caption` *(optional)*: shown in handwriting under the photo
- `alt` *(optional)*: description for screen readers (the caption is used if empty)
- `focus` *(optional)*: which part of the photo stays visible in the square polaroid, as `"x% y%"`. The default is `"50% 40%"`. Use a bigger second number (e.g. `"50% 75%"`) if faces are near the bottom of the photo, or a smaller one if they're near the top.
- Order in this list = order the photos float out.

### Option B: on your computer

```bash
npm install
# put your photos in public/photos/
npm run dev      # preview at http://localhost:5173 (photos.json is updated automatically)
npm run build    # writes the finished site to dist/
```

Then commit and push.

### Tips
- **Resize photos to about 1200–1600 px on the long side** (≈ 200–400 KB each) so they load fast on her phone.
- Square-ish photos look best, because the polaroids crop to a square. The enlarged view shows the full photo.
- You can add as many as you like. A few float at once (4 on phones, up to 8 on big screens), and the rest take turns.
- A missing or broken photo is skipped quietly.
- **Placeholder photos appear only in `npm run dev`** and only while the folder has no photos. The published site never shows them.

---

## ✍️ Changing the words

All text lives in [`src/data/letter.ts`](src/data/letter.ts): the letter (one string per paragraph), the button and the final message.

## 🧩 Structure

```
src/
  App.tsx                    phases: closed → opening → letter → final
  components/
    EnvelopeScene.tsx        opening screen, floating envelope + text
    Envelope.tsx             envelope layers, 3D flap, glow, letter peek
    WaxSeal.tsx              burgundy heart seal that cracks in two
    FlowerParticles.tsx      roses/peonies/petals bursting out (+ golden flash)
    FloatingHearts.tsx       rising glowing hearts (+ one-off heart bursts)
    FallingPetals.tsx        petals drifting down (CSS animated)
    CornerFlorals.tsx        floral corner arrangements
    FloatingMemories.tsx     polaroids floating around the letter
    Polaroid.tsx / PhotoLightbox.tsx
    LoveLetter.tsx           tri-fold unfolding letter + surprise button
    WritingText.tsx          handwriting-style text reveal (tap to skip)
    FinalSurprise.tsx / Bouquet.tsx
    flora/                   shared SVG roses, peonies, leaves, petals, hearts
  hooks/                     usePhotos (reads photos.json), useViewport
  lib/                       layout + photo placement maths
```

## ♿ Accessibility & performance
- Honors **reduced motion**: no bursts or drifting particles, and the letter appears in full.
- Everything works by keyboard. The photo viewer closes with Esc and browses with ← →.
- Screen readers get the whole letter at once.
- Only `transform` and `opacity` animate. Phones get fewer particles and photos, and the page never scrolls sideways.
