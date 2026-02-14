# Quick Start Guide

## How It Works

This is an interactive Valentine's Day web experience. Your partner explores a real map with rose pins at meaningful locations. Each pin reveals a memory (photos or video). After viewing all memories, a proposal question appears.

## Setup (3 Steps)

### Step 1: Add Your Media

Drop your photos and videos into the `assets/memories/` folders:

```
assets/memories/
  memory_1/    ← video.mp4 or photo1.jpg, photo2.jpg, etc.
  memory_2/
  memory_3/
  ...
```

Create a new folder for each memory. Supported formats: `.jpg`, `.jpeg`, `.png`, `.mp4`

**Tip:** Compress images to <200KB each for fast loading (use https://squoosh.app/)

### Step 2: Edit data.js

`data.js` is the **only file you need to edit**. Open it and customize:

1. **Landing screen** - The greeting text your partner sees first
2. **Memories** - Title, caption, media paths, and GPS coordinates for each pin
3. **Final message** - The proposal question and response text
4. **Map center** - Set to the middle of your memory locations

Each section has inline instructions explaining what to do.

**Getting GPS coordinates:**
- Open the app with `?dev=true` in the URL (e.g., `http://localhost:8000?dev=true`)
- Click anywhere on the map to see coordinates
- Copy them into your memory's `position` field

**Adding/removing memories:**
- You can have any number of memories (minimum 2)
- Copy an existing memory block and change the `id`, `title`, `media`, etc.
- The last memory should always be the `specialType: "proposal"` entry
- Unlock order is automatic (1 → 2 → 3 → ... → N)

### Step 3: Test & Deploy

**Run locally:**
```bash
python -m http.server 8000
# Then open http://localhost:8000
```

Or on Windows, double-click `START_SERVER.bat`.

**Test the flow:**
- Landing screen → click button → map with pins
- Click unlocked pin → modal with your photos/video
- Close modal → next pin unlocks
- Complete all → proposal screen appears

**Reset progress** (for re-testing):
```javascript
// Open browser console (F12) and run:
window.RoseGarden.reset()
```

**Deploy:**
- **Netlify:** Drag the whole folder to https://app.netlify.com/drop
- **GitHub Pages:** Push to repo, enable Pages in Settings
- **Vercel:** Import from GitHub

## File Overview

```
├── data.js              ← EDIT THIS (your content goes here)
├── index.html           ← Main page (no editing needed)
├── css/                 ← Styles (no editing needed)
├── js/                  ← App logic (no editing needed)
├── assets/
│   ├── memories/        ← DROP YOUR MEDIA HERE
│   │   ├── memory_1/
│   │   ├── memory_2/
│   │   └── ...
│   ├── sad_hamster.png  ← Proposal screen image (replaceable)
│   └── hamster_jumping.gif ← Success screen image (replaceable)
└── QUICK_START.md       ← You are here
```

## Troubleshooting

**Images/videos not loading?**
→ Make sure file paths in `data.js` match your actual filenames exactly (case-sensitive on Linux/Mac).

**Map not showing?**
→ You need a local server. Opening `index.html` directly won't load map tiles.

**Want to reset and start over?**
→ Browser console: `window.RoseGarden.reset()`

**Want different colors/fonts?**
→ Edit `css/variables.css`
