// Application Configuration & Constants

export const SCREENS = {
    LANDING: 'landing-screen',
    MAP: 'map-screen',
    FINAL: 'final-screen'
};

export const PIN_STATES = {
    LOCKED: 'locked',
    UNLOCKED: 'unlocked',
    COMPLETED: 'completed'
};

export const MEDIA_TYPES = {
    IMAGES: 'images',
    VIDEO: 'video'
};

export const EVENTS = {
    MEMORY_COMPLETE: 'memory:complete',
    PROGRESS_UPDATE: 'progress:update',
    STATE_CHANGE: 'state:change',
    ALL_COMPLETE: 'all:complete'
};

export const STORAGE_KEY = 'rose_garden_state';

export const ANIMATION_DURATION = 1200;

export const ZOOM_CONFIG = {
    maxZoom: 3,
    minZoom: 0.5,
    step: 0.3,
    bounds: true,
    boundsPadding: 0.1
};

// Pin icons (using emoji for now, can be replaced with SVG)
export const PIN_ICONS = {
    [PIN_STATES.LOCKED]: '🌱',      // Closed bud
    [PIN_STATES.UNLOCKED]: '🌹',    // Rose bud
    [PIN_STATES.COMPLETED]: '🌺'    // Bloomed rose
};

export const KEYBOARD_SHORTCUTS = {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    SPACE: ' ',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight'
};
