# Rose Garden Memory Map

An interactive Valentine's Day web experience where memories are revealed through an explorable map. Users click rose pins at real GPS locations to unlock memories (photos/videos), progressing toward a final proposal screen.

## Tech Stack

- Vanilla JavaScript (ES6 modules), HTML5, CSS3
- Leaflet.js + OpenStreetMap tiles (free, no API key)
- localStorage for state persistence
- Google Fonts (Playfair Display, Inter)

## Personalization

**`data.js` is the only file users need to edit.** It controls:
- Landing screen text (title, description, button)
- Memory entries (title, caption, media paths, GPS coordinates)
- Final proposal screen text (question, buttons, success message, images)
- Map settings (center, zoom)
- Unlock rules (auto-sequential by default, or custom)
- Progress bar subtitles

All HTML text is populated dynamically from `data.js` by `main.js:populateHTML()`.

**Variable memory count:** Supports any number of memories (minimum 2). Progress bar, unlock rules, and counter all scale automatically.

## File Structure

```
├── data.js              ← Single personalization file
├── index.html           ← Main page (generic placeholders, filled by JS)
├── .gitignore           ← Excludes personal media from git
├── css/
│   ├── variables.css    ← Design tokens (colors, fonts)
│   ├── map.css, modal.css, progress.css, landing.css, final.css, main.css
│   ├── reset.css, typography.css, animations.css
├── js/
│   ├── main.js          ← App entry, populateHTML(), fireworks, proposal flow
│   ├── state.js         ← State management, localStorage, auto unlock rules
│   ├── pins.js          ← Leaflet markers, click handlers, marker recreation
│   ├── modal.js         ← Memory modal, carousel/video, proposal Error 404
│   ├── carousel.js      ← Photo carousel (swipe, arrows, dots)
│   ├── map.js           ← Leaflet map init
│   ├── progress.js      ← Progress bar (dynamic count)
│   ├── router.js        ← Screen transitions
│   ├── animations.js    ← Petals, celebrations
│   └── config.js        ← Constants (screens, events, pin states)
├── assets/
│   ├── memories/        ← User drops media here (gitignored)
│   │   ├── memory_1/
│   │   ├── memory_2/
│   │   └── ...
│   ├── sad_hamster.png
│   └── hamster_jumping.gif
```

## Architecture

```
App (main.js)
├── populateHTML()    → Fills all DOM text from data.js on init
├── Router           → Screen transitions (landing → map → final)
├── StateManager     → Data + localStorage + auto unlock rules
├── PinManager       → Leaflet markers, recreation on state change
├── ProgressManager  → Progress bar (dynamic count from memories.length)
├── ModalManager     → Memory viewing (carousel/video/proposal Error 404)
├── Carousel         → Photo navigation (swipe/arrows/dots)
├── MapManager       → Leaflet integration
└── AnimationManager → Petals, fireworks, celebrations
```

## Data Flow

1. `data.js` exports: `landing`, `memories`, `unlockRules`, `progressSubtitles`, `finalMessage`, `config`
2. `main.js:populateHTML()` fills landing + final screen DOM elements
3. `state.js` auto-generates sequential unlock rules if `unlockRules` is null
4. User clicks pin → modal opens → close marks complete → next unlocks → all done → final screen

## Dev Mode

```
http://localhost:8000?dev=true
```
- Click map to get GPS coordinates
- Reset progress button visible

## Quick Commands

```javascript
window.RoseGarden.reset()           // Reset all progress
window.RoseGarden.state.getMemories() // Check memory states
window.RoseGarden.state.markMemoryComplete(1) // Skip a memory
```
