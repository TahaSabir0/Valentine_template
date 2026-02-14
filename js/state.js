// State Management with localStorage persistence

import { memories, unlockRules as customUnlockRules, progressSubtitles, config } from '../data.js';
import { EVENTS, STORAGE_KEY } from './config.js';

// Auto-generate sequential unlock rules if none provided
function buildUnlockRules() {
    if (customUnlockRules) return customUnlockRules;
    const rules = {};
    for (let i = 0; i < memories.length; i++) {
        const current = memories[i].id;
        const next = i + 1 < memories.length ? [memories[i + 1].id] : [];
        rules[current] = next;
    }
    return rules;
}
const unlockRules = buildUnlockRules();

class StateManager {
    constructor() {
        this.state = this.initializeState();
        this.listeners = {};
        this.saveTimeout = null;
    }

    // Initialize state from localStorage or default data
    initializeState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with current data structure to handle updates
                return this.mergeState(parsed);
            }
        } catch (error) {
            console.warn('Could not load saved state:', error);
        }

        // Return default state
        return {
            memories: [...memories],
            currentScreen: 'landing',
            completedCount: 0,
            lastUpdated: Date.now()
        };
    }

    // Merge saved state with current data structure
    mergeState(savedState) {
        const mergedMemories = memories.map(memory => {
            const saved = savedState.memories?.find(m => m.id === memory.id);
            if (saved) {
                return {
                    ...memory,
                    unlocked: saved.unlocked,
                    completed: saved.completed
                };
            }
            return memory;
        });

        return {
            memories: mergedMemories,
            currentScreen: savedState.currentScreen || 'landing',
            completedCount: mergedMemories.filter(m => m.completed).length,
            lastUpdated: Date.now()
        };
    }

    // Save state to localStorage with debouncing
    saveState() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            try {
                const stateToSave = {
                    memories: this.state.memories.map(m => ({
                        id: m.id,
                        unlocked: m.unlocked,
                        completed: m.completed
                    })),
                    currentScreen: this.state.currentScreen,
                    completedCount: this.state.completedCount,
                    lastUpdated: Date.now()
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
            } catch (error) {
                console.error('Could not save state:', error);
            }
        }, config.autoSaveDelay);
    }

    // Get current state
    getState() {
        return { ...this.state };
    }

    // Get all memories
    getMemories() {
        return [...this.state.memories];
    }

    // Get memory by ID
    getMemory(id) {
        return this.state.memories.find(m => m.id === id);
    }

    // Get unlocked memories
    getUnlockedMemories() {
        return this.state.memories.filter(m => m.unlocked);
    }

    // Get completed memories
    getCompletedMemories() {
        return this.state.memories.filter(m => m.completed);
    }

    // Get progress (0-10)
    getProgress() {
        return this.state.completedCount;
    }

    // Get progress percentage (0-100)
    getProgressPercentage() {
        return (this.state.completedCount / this.state.memories.length) * 100;
    }

    // Get progress subtitle based on completion count
    getProgressSubtitle() {
        const count = this.state.completedCount;
        // Find the highest threshold that's <= count
        const thresholds = Object.keys(progressSubtitles)
            .map(Number)
            .sort((a, b) => b - a);

        for (const threshold of thresholds) {
            if (count >= threshold) {
                return progressSubtitles[threshold];
            }
        }

        return progressSubtitles[0];
    }

    // Mark memory as completed
    markMemoryComplete(id) {
        const memory = this.getMemory(id);
        if (!memory || memory.completed) {
            return false;
        }

        memory.completed = true;
        this.state.completedCount++;

        // Unlock next memories according to rules
        const toUnlock = unlockRules[id] || [];

        toUnlock.forEach(nextId => {
            const nextMemory = this.getMemory(nextId);
            if (nextMemory) {
                nextMemory.unlocked = true;
            }
        });

        this.saveState();
        this.emit(EVENTS.MEMORY_COMPLETE, { id, memory });
        this.emit(EVENTS.PROGRESS_UPDATE, {
            count: this.state.completedCount,
            percentage: this.getProgressPercentage(),
            subtitle: this.getProgressSubtitle()
        });

        // Check if all memories are complete
        if (this.state.completedCount === this.state.memories.length) {
            this.emit(EVENTS.ALL_COMPLETE);
        }

        return true;
    }

    // Set current screen
    setScreen(screenId) {
        this.state.currentScreen = screenId;
        this.saveState();
        this.emit(EVENTS.STATE_CHANGE, { screen: screenId });
    }

    // Reset all progress (for testing)
    reset() {
        localStorage.removeItem(STORAGE_KEY);
        this.state = this.initializeState();
        this.emit(EVENTS.STATE_CHANGE, { reset: true });
    }

    // Event emitter
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
}

// Export singleton instance
export const stateManager = new StateManager();
