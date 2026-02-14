# 🌹 Rose Garden Memory Map

A romantic, interactive web experience where memories bloom into roses. Perfect for Valentine's Day or any special occasion!

## ✨ Features

- **Interactive Zoomable Map**: Explore a garden with 10 memory locations
- **Progressive Unlocking**: Memories unlock as you view them in sequence
- **Rich Media Support**: Image carousels and video playback
- **Bloom Animations**: Roses bloom as you complete each memory
- **State Persistence**: Progress is saved across browser sessions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessible**: Full keyboard navigation and screen reader support

## 🚀 Quick Start

### Option 1: Open Directly

Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local Server (Recommended)

For best results, use a local server to avoid CORS issues with images:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Then open: http://localhost:8000
```

## 📝 Customization Guide

### 1. Add Your Memory Content

Edit `data.js` to customize all content:

```javascript
{
    id: 1,
    title: "Our First Date",  // Optional title
    mediaType: "images",      // "images" or "video"
    media: [
        "assets/images/memories/memory-1/photo1.jpg",
        "assets/images/memories/memory-1/photo2.jpg"
    ],
    caption: "That coffee shop where you laughed at my terrible joke...",
    position: { x: 25, y: 30 },  // Position on map (0-100%)
    unlocked: true,              // Only memory 1 starts unlocked
    completed: false
}
```

### 2. Add Your Images & Videos

**Images:**

- Place photos in `assets/images/memories/memory-{1-10}/`
- Format: JPG or PNG
- Recommended: Max 1920px width, compressed to <200KB each
- Update `media` array in `data.js` with file paths

**Videos:**

- Place videos in `assets/videos/`
- Format: MP4 (H.264 codec)
- Recommended: Max 1080p, compressed to <10MB
- Set `mediaType: "video"` and update `media` array

**Compression Tools:**

- Images: [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/)
- Videos: [HandBrake](https://handbrake.fr/), [Clipchamp](https://clipchamp.com/)

### 3. Position Your Memory Pins

**Development Mode** - Use the position picker:

1. Add `?dev=true` to URL: `index.html?dev=true`
2. Click anywhere on the map
3. Coordinates will be logged to console and shown on screen
4. Copy coordinates to `data.js` in each memory's `position` field

```javascript
position: { x: 27.3, y: 45.8 }  // Example from picker
```

### 4. Customize Text & Messages

In `data.js`, update:

```javascript
// Progress subtitles at different stages
export const progressSubtitles = {
  0: "Begin your journey through our memories...",
  1: "The first rose begins to bloom...",
  // ... customize these
};

// Final proposal message
export const finalMessage = {
  title: "You've unlocked all our memories...",
  body: ["Your custom paragraph 1...", "Your custom paragraph 2..."],
  question: "Will you be my Valentine? 🌹",
  celebrationMessage: "I knew you'd say yes! 💗",
};
```

### 5. Change Unlock Pattern (Optional)

By default, memories unlock sequentially (1→2→3...). To customize:

```javascript
// In data.js
export const unlockRules = {
  1: [2, 3], // Memory 1 unlocks both 2 AND 3
  2: [4], // Memory 2 unlocks 4
  3: [4], // Memory 3 also unlocks 4
  4: [5],
  // ...
};
```

### 6. Replace Garden Background (Optional)

Replace `assets/images/map/garden-background.svg` with:

- Your own illustration (SVG or PNG)
- A photo collage
- A meaningful background image

**Recommended size:** 2000x1500px

## 🎨 Design Customization

### Colors

Edit `css/variables.css` to change the color scheme:

```css
:root {
  --color-rose-pink: #f4a7b9;
  --color-soft-red: #e63950;
  --color-blush: #ffe4ec;
  /* ... change these */
}
```

### Fonts

Current fonts: **Playfair Display** (headings), **Inter** (body)

To change, update the Google Fonts import in `index.html` and `css/variables.css`:

```css
--font-heading: "Your-Heading-Font", serif;
--font-body: "Your-Body-Font", sans-serif;
```

## 🧪 Testing Checklist

- [ ] All 10 memories have content (title, caption, media)
- [ ] All images load correctly
- [ ] Videos play without issues
- [ ] Pin positions are correctly placed
- [ ] Unlock sequence works as expected
- [ ] Progress bar updates correctly
- [ ] Final reveal screen shows proper message
- [ ] Works on mobile/tablet
- [ ] State persists after page refresh

## 🐛 Troubleshooting

### Images Not Loading

- Check file paths in `data.js` match actual file locations
- Use a local server (not `file://` protocol)
- Ensure images are in correct format (JPG, PNG)

### Pins Not Appearing

- Check browser console for errors (F12)
- Verify `position` coordinates are between 0-100
- Ensure `data.js` is properly imported

### State Not Saving

- Check if localStorage is enabled in browser
- Clear browser cache and refresh
- Check browser console for storage errors

### Reset Progress

Open browser console (F12) and run:

```javascript
window.RoseGarden.reset();
```

Or manually clear localStorage for the site.

## 📱 Deployment

### GitHub Pages (Free)

1. Push project to GitHub repository
2. Go to Settings → Pages
3. Select branch and root folder
4. Your site will be at: `https://username.github.io/repo-name/`

### Netlify (Free)

1. Drag and drop the entire project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant URL
3. Optional: Configure custom domain

### Vercel (Free)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project folder
3. Follow prompts for deployment

## 🔒 Privacy & Sharing

**Private Sharing Options:**

- Share the direct URL only with intended recipient
- Use Netlify/Vercel password protection
- Host on private server
- Use unlisted URL (share privately, not indexed by search engines)

## 💡 Debug Mode

Access debug tools in browser console (F12):

```javascript
// Reset all progress
window.RoseGarden.reset();

// Check current state
window.RoseGarden.state.getState();

// Manually complete a memory
window.RoseGarden.state.markMemoryComplete(1);

// Navigate to final screen
window.RoseGarden.router.navigateTo("final-screen");
```

## 📋 Project Structure

```
Cienna_Project/
├── index.html              # Main HTML file
├── data.js                 # YOUR CONTENT (customize this!)
├── README.md               # This file
├── assets/
│   ├── images/
│   │   ├── map/
│   │   │   └── garden-background.svg
│   │   └── memories/
│   │       ├── memory-1/   # Your photos here
│   │       ├── memory-2/
│   │       └── ...
│   └── videos/             # Your videos here (optional)
├── css/
│   ├── animations.css      # Animation keyframes
│   ├── final.css           # Final reveal screen
│   ├── landing.css         # Landing screen
│   ├── main.css            # Main styles
│   ├── map.css             # Map & pins
│   ├── modal.css           # Memory modal
│   ├── progress.css        # Progress bar
│   ├── reset.css           # CSS reset
│   ├── typography.css      # Typography
│   └── variables.css       # Design system
└── js/
    ├── animations.js       # Animation manager
    ├── carousel.js         # Image carousel
    ├── config.js           # App configuration
    ├── main.js             # Application entry point
    ├── map.js              # Map & zoom
    ├── modal.js            # Memory modal
    ├── pins.js             # Pin rendering
    ├── progress.js         # Progress bar
    ├── router.js           # Screen navigation
    └── state.js            # State management
```

## 🛠️ Technical Details

- **Pure Vanilla JS** - No frameworks, just modern ES6+
- **CSS3 Animations** - Smooth, GPU-accelerated
- **Panzoom.js** - Interactive map zoom/pan (3KB)
- **localStorage** - Persistent state across sessions
- **Responsive Design** - Mobile-first approach
- **Accessible** - WCAG 2.1 compliant

## ❤️ Tips for Best Results

1. **Use high-quality images** but compress them well
2. **Write heartfelt captions** - be specific and personal
3. **Test on the recipient's device** if possible
4. **Consider the unlock sequence** - build emotional progression
5. **Time the reveal** - share just before Valentine's Day for impact

## 🎁 Surprise Factor

Consider these ideas:

- Send the link at a specific time (midnight on Valentine's Day)
- Add a custom domain name that's meaningful
- Include inside jokes in captions only they would understand
- Use photos from across your entire relationship timeline
- End with a real proposal or special announcement

---

**Made with ❤️ for Cienna**

Happy Valentine's Day! 🌹
