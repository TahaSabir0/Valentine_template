// ============================================================
// ROSE GARDEN - PERSONALIZATION FILE
// ============================================================
// This is the ONLY file you need to edit to customize the experience.
// Follow the instructions in each section below.
// ============================================================

// ------------------------------------------------------------
// 1. LANDING SCREEN
// ------------------------------------------------------------
// This is what the user sees first when they open the page.

export const landing = {
  title: "My Dearest [Name],",
  description: "I made something special for you...",
  subtitle: "I've planted a garden of our memories...",
  buttonText: "Start Exploring",
};

// ------------------------------------------------------------
// 2. MEMORIES
// ------------------------------------------------------------
// Each memory is a pin on the map. You can have as many as you want (minimum 2).
// The last memory should be the special "proposal" type.
//
// For each memory, set:
//   - title:     A short name for the memory
//   - mediaType: "video" for a single video, "images" for one or more photos
//   - media:     Array of file paths (relative to this folder)
//                Videos: ["assets/memories/memory_1/video.mp4"]
//                Photos: ["assets/memories/memory_1/photo1.jpg", "assets/memories/memory_1/photo2.jpg"]
//   - caption:   The text shown below the media
//   - position:  GPS coordinates { lat: ..., lng: ... }
//                Use ?dev=true in the URL to click the map and get coordinates
//
// MEDIA FILES:
//   Drop your photos/videos into assets/memories/memory_X/ folders.
//   Supported formats: .jpg, .jpeg, .png, .mp4
//   Tip: Compress images to <200KB each for fast loading (use https://squoosh.app/)
//
// The LAST memory should always be the special proposal trigger:
//   { id: N, title: "...", mediaType: "special", specialType: "proposal", media: [], caption: "", position: {...} }

export const memories = [
  {
    id: 1,
    title: "Memory 1 Title",
    mediaType: "video",
    media: ["assets/memories/memory_1/video.mp4"],
    caption: "Describe this memory...",
    position: { lat: 39.8365, lng: -77.2330 },
    unlocked: true,
    completed: false,
  },
  {
    id: 2,
    title: "Memory 2 Title",
    mediaType: "images",
    media: [
      "assets/memories/memory_2/photo1.jpg",
      "assets/memories/memory_2/photo2.jpg",
    ],
    caption: "Describe this memory...",
    position: { lat: 39.8367, lng: -77.2324 },
    unlocked: false,
    completed: false,
  },
  {
    id: 3,
    title: "Memory 3 Title",
    mediaType: "images",
    media: [
      "assets/memories/memory_3/photo1.jpg",
    ],
    caption: "Describe this memory...",
    position: { lat: 39.8333, lng: -77.2340 },
    unlocked: false,
    completed: false,
  },
  // -------------------------------------------------------
  // ADD MORE MEMORIES HERE by copying the block above.
  // Give each one a unique id (4, 5, 6...).
  // -------------------------------------------------------

  // FINAL MEMORY - The proposal trigger (always keep this last!)
  // When the user reaches this pin, they see a fake "Error 404"
  // screen, then the proposal question.
  {
    id: 4,
    title: "The Last Memory",
    mediaType: "special",
    specialType: "proposal",
    media: [],
    caption: "",
    position: { lat: 39.8344, lng: -77.2337 },
    unlocked: false,
    completed: false,
  },
];

// ------------------------------------------------------------
// 3. UNLOCK ORDER (optional)
// ------------------------------------------------------------
// By default, memories unlock sequentially: 1 → 2 → 3 → ... → N
// Only set this if you want a CUSTOM unlock order (e.g., branching paths).
// If you leave this as null, sequential order is used automatically.
//
// Example custom rules:
// export const unlockRules = {
//   1: [2, 3],   // Completing memory 1 unlocks both 2 and 3
//   2: [4],
//   3: [4],      // Both 2 and 3 must be done before 4 unlocks
//   4: [],
// };

export const unlockRules = null; // null = automatic sequential order

// ------------------------------------------------------------
// 4. PROGRESS BAR SUBTITLES
// ------------------------------------------------------------
// Messages shown above the progress bar at different completion stages.
// The number is the count of completed memories that triggers the message.
// These auto-scale to your memory count, but you can customize them.

export const progressSubtitles = {
  0: "Begin your journey through our memories...",
  1: "The first rose begins to bloom...",
  3: "Our story is unfolding beautifully...",
  5: "Halfway through our garden of memories...",
  7: "So many cherished moments together...",
  9: "One final rose remains... the most important one",
};

// ------------------------------------------------------------
// 5. FINAL / PROPOSAL SCREEN
// ------------------------------------------------------------
// This appears after all memories are viewed.
// The "body" array is a list of paragraphs shown one by one.

export const finalMessage = {
  title: "The Last Memory...",
  body: [
    "I've saved all these memories of us together, but the last one...",
    "The last memory is the one we get to create together.",
    "So...",
  ],
  question: "Will you be my Valentine?",
  yesButton: "Yes, I will!",
  noButton: "No, I won't",
  successTitle: "YAYYYYYYY",
  // Images for the proposal screen (sad = before answer, happy = after yes)
  // Replace with your own images, or leave these defaults.
  sadImage: "assets/sad_hamster.png",
  happyImage: "assets/hamster_jumping.gif",
};

// ------------------------------------------------------------
// 6. APP SETTINGS (optional - defaults work fine)
// ------------------------------------------------------------

export const config = {
  storageKey: "rose_garden_state",
  animationDuration: 1200,
  autoSaveDelay: 500,
  enableDevMode: false, // Set to true or use ?dev=true in URL
  map: {
    // Center of the map - set this to the middle of your memory locations
    center: { lat: 39.8344, lng: -77.2337 },
    zoom: 16,
    minZoom: 14,
    maxZoom: 19,
    tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};
