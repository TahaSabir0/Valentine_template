# 📋 Valentine's Day Project Checklist

## Day 1 - TODAY ✅

### Testing (Right Now!)

- [ ] Open `index.html` i n browser (or start local server)
- [ ] Click "Start Exploring" button
- [ ] Verify map loads with 10 pins visible
- [ ] Click first unlocked pin (Memory 1)
- [ ] Modal opens with placeholder image
- [ ] Close modal → pin blooms with animation
- [ ] Progress bar updates (1/10)
- [ ] Memory 2 unlocks (changes color)
- [ ] Test zoom controls (+ / - / reset buttons)
- [ ] Try development mode: `index.html?dev=true`
- [ ] Click map to see position coordinates

### Content Gathering (Tonight)

- [ ] Choose 10 special memories to feature
- [ ] Gather 10-30 photos total (1-5 per memory)
- [ ] Compress photos using TinyPNG or Squoosh
- [ ] Organize photos by memory number
- [ ] Draft captions (1-2 sentences each)

---

## Day 2 - TOMORROW

### Add Photos (Morning)

- [ ] Place photos in `assets/images/memories/memory-1/` through `memory-10/`
- [ ] Rename files: `photo1.jpg`, `photo2.jpg`, etc.
- [ ] Verify all photos are <200KB each
- [ ] Test that photos load in browser

### Update data.js (Afternoon)

- [ ] Open `data.js` in text editor
- [ ] For each memory (1-10):
  - [ ] Add real title
  - [ ] Update caption with your text
  - [ ] Update media paths to match your photo filenames
  - [ ] Keep placeholder positions for now
- [ ] Save and test in browser

### Position Pins (Evening)

- [ ] Open `index.html?dev=true`
- [ ] Click map where you want Memory 1 pin
- [ ] Copy coordinates from console
- [ ] Paste into `data.js` memory 1 position field
- [ ] Repeat for all 10 memories
- [ ] Test final layout

---

## Day 3

### Customize Text (Morning)

- [ ] Edit `index.html` line 32: Change "My Dearest Cienna" greeting
- [ ] Edit `data.js` → `progressSubtitles` (6 custom messages)
- [ ] Edit `data.js` → `finalMessage.title`
- [ ] Edit `data.js` → `finalMessage.body` (2 paragraphs)
- [ ] Edit `data.js` → `finalMessage.question` (your proposal)
- [ ] Edit `data.js` → `finalMessage.celebrationMessage`

### Full Testing (Afternoon)

- [ ] Reset progress: Console → `window.RoseGarden.reset()`
- [ ] Complete full experience start to finish
- [ ] Verify all 10 memories load correctly
- [ ] Check all captions display properly
- [ ] Verify progress bar updates
- [ ] Reach final proposal screen
- [ ] Click "Yes ❤️" → celebration appears
- [ ] Refresh page → progress persists
- [ ] Clear localStorage and test from scratch again

### Mobile Testing (Evening)

- [ ] Test on phone browser
- [ ] Verify touch gestures work (swipe, pinch zoom)
- [ ] Check text is readable on small screen
- [ ] Verify images load on mobile data
- [ ] Test modal full-screen view

---

## Day 4

### Polish (Morning)

- [ ] Review all captions for typos
- [ ] Ensure photo quality is good
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Double-check final message text
- [ ] Verify celebration animation works

### Optional Enhancements

- [ ] Replace garden background with custom image
- [ ] Add 2nd or 3rd photo to some memories
- [ ] Include a video if you have one
- [ ] Customize colors in `css/variables.css`
- [ ] Add more personal touches to text

### Deployment (Afternoon)

- [ ] Choose deployment method:
  - [ ] **Option A:** Netlify Drop (drag & drop, instant)
  - [ ] **Option B:** GitHub Pages (requires Git)
  - [ ] **Option C:** Vercel (requires account)
- [ ] Deploy project
- [ ] Test deployed URL
- [ ] Verify all images load on live site
- [ ] Test on different device using live URL
- [ ] Save URL somewhere safe

---

## Day 5 - Valentine's Eve

### Final Prep (Morning)

- [ ] One last test of live URL
- [ ] Take screenshots as backup
- [ ] Prepare how you'll send the link (text? email? card?)
- [ ] Set reminder for when to send (midnight? morning?)

### Optional

- [ ] Write a short message to accompany the link
- [ ] Create a custom short URL (bit.ly, tiny.cc)
- [ ] Add link to a greeting card or letter

---

## Day 6 - VALENTINE'S DAY! 💝

### The Big Day

- [ ] Send link to Cienna at planned time
- [ ] Include brief intro: "I made something special for you..."
- [ ] Wait for her reaction 😊
- [ ] Be available if she has questions
- [ ] Celebrate! 🎉

---

## Troubleshooting Reference

### If something breaks:

1. **Check browser console** (F12 → Console tab)
2. **Reset state**: `window.RoseGarden.reset()`
3. **Check file paths** in data.js match actual files
4. **Use local server** instead of opening file directly
5. **Clear browser cache** (Ctrl+Shift+Delete)

### Quick Debug Commands:

```javascript
// In browser console (F12):

// See current state
window.RoseGarden.state.getState();

// Complete a memory manually
window.RoseGarden.state.markMemoryComplete(1);

// Jump to final screen
window.RoseGarden.router.navigateTo("final-screen");

// Reset everything
window.RoseGarden.reset();
```

---

## Notes & Ideas

## **Memory Ideas:**

-
- **Caption Drafts:**

1.
2.
3.

## **Questions:**

- **Backup Plan:**
  If you run into major issues, you can always:

1. Send her the folder directly
2. Show her in person
3. Create a simpler version with just photos + text

---

## Progress Tracker

**Day 1:** ⬜ Not started | 🔄 In progress | ✅ Complete
**Day 2:** ⬜ Not started | 🔄 In progress | ✅ Complete
**Day 3:** ⬜ Not started | 🔄 In progress | ✅ Complete
**Day 4:** ⬜ Not started | 🔄 In progress | ✅ Complete
**Day 5:** ⬜ Not started | 🔄 In progress | ✅ Complete
**Day 6:** 💝 Valentine's Day!

---

**Remember:** The most important thing is the thought and effort you're putting in. Even if it's not perfect, Cienna will love it! 🌹
