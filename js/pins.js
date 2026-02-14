// Pin Rendering & Interactions with Leaflet Markers

import { stateManager } from './state.js';
import { mapManager } from './map.js';
import { PIN_STATES, PIN_ICONS, EVENTS } from './config.js';
import { openMemoryModal } from './modal.js';

class PinManager {
    constructor() {
        this.markers = new Map(); // Store Leaflet markers by memory ID
        this.markersData = new Map(); // Store memory data for each marker

        // Listen for state changes
        stateManager.on(EVENTS.MEMORY_COMPLETE, () => {
            this.updateMarkers();
        });

        stateManager.on(EVENTS.STATE_CHANGE, ({ reset }) => {
            if (reset) {
                this.renderMarkers();
            }
        });
    }

    // Create custom rose icon for Leaflet markers
    createRoseIcon(state) {
        const styles = {
            locked: {
                width: 36,
                height: 36,
                fontSize: 18,
                bg: 'linear-gradient(135deg, #ccc, #999)',
                border: '3px solid #888'
            },
            unlocked: {
                width: 44,
                height: 44,
                fontSize: 22,
                bg: 'linear-gradient(135deg, #F4A7B9, #E63950)',
                border: '3px solid #fff'
            },
            completed: {
                width: 48,
                height: 48,
                fontSize: 24,
                bg: 'linear-gradient(135deg, #FF69B4, #FF1493)',
                border: '3px solid #FFD700'
            }
        };

        const emoji = state === 'completed' ? '✨' : '🌹';
        const style = styles[state];

        // Create a simple div icon - let Leaflet handle positioning
        return L.divIcon({
            className: `rose-marker-icon rose-marker-${state}`,
            html: `<div style="
                width: 100%;
                height: 100%;
                background: ${style.bg};
                border: ${style.border};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${style.fontSize}px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                cursor: pointer;
            ">${emoji}</div>`,
            iconSize: [style.width, style.height],
            iconAnchor: [style.width / 2, style.height / 2]
        });
    }

    // Render all markers on the map
    renderMarkers() {
        const map = mapManager.getMap();
        if (!map) {
            console.warn('Map not initialized, cannot render markers');
            return;
        }

        // Clear existing markers
        this.clearMarkers();

        const memories = stateManager.getMemories();

        memories.forEach(memory => {
            const marker = this.createMarker(memory);
            if (marker) {
                marker.addTo(map);
                this.markers.set(memory.id, marker);
                this.markersData.set(memory.id, memory);
            }
        });

        // Invalidate map size to ensure proper rendering
        map.invalidateSize();
    }

    // Create a single Leaflet marker
    createMarker(memory) {
        const state = this.getMarkerState(memory);
        const icon = this.createRoseIcon(state);

        // Create marker with standard Leaflet options
        const isInteractive = memory.unlocked || memory.completed;

        const marker = L.marker([memory.position.lat, memory.position.lng], {
            icon: icon,
            opacity: memory.unlocked ? 1 : 0.6,
            interactive: isInteractive,
            keyboard: isInteractive,
            riseOnHover: false,
            autoPanOnFocus: false
        });

        // ALWAYS add click handler - we'll check state when clicked
        const memoryId = memory.id; // Capture ID for closure
        marker.on('click', () => {
            this.handleMarkerClick(memoryId);
        });

        // Store memory ID on marker for reference
        marker.memoryId = memory.id;

        return marker;
    }

    // Determine marker state
    getMarkerState(memory) {
        if (memory.completed) {
            return PIN_STATES.COMPLETED;
        }
        if (memory.unlocked) {
            return PIN_STATES.UNLOCKED;
        }
        return PIN_STATES.LOCKED;
    }

    // Handle marker click
    handleMarkerClick(memoryId) {
        // Always refresh memory state from state manager
        const memory = stateManager.getMemory(memoryId);

        if (!memory) {
            console.error(`Memory ${memoryId} not found!`);
            return;
        }

        if (!memory.unlocked && !memory.completed) {
            return;
        }

        openMemoryModal(memory);
    }

    // Update all markers (refresh states)
    updateMarkers() {
        const map = mapManager.getMap();
        if (!map) {
            return;
        }

        const memories = stateManager.getMemories();

        memories.forEach(memory => {
            const marker = this.markers.get(memory.id);
            if (!marker) {
                return;
            }

            const state = this.getMarkerState(memory);
            const newIcon = this.createRoseIcon(state);

            // Update marker icon
            marker.setIcon(newIcon);

            // Update opacity
            marker.setOpacity(memory.unlocked ? 1 : 0.6);

            // CRITICAL: To update interactivity, we must remove the marker and recreate it
            // Just changing options doesn't update the DOM's pointer-events style
            const isInteractive = memory.unlocked || memory.completed;

            if (marker.options.interactive !== isInteractive) {
                // Remove old marker and create new one with updated interactivity
                map.removeLayer(marker);

                const newMarker = this.createMarker(memory);
                newMarker.addTo(map);

                this.markers.set(memory.id, newMarker);
                this.markersData.set(memory.id, memory);
            }
        });
    }

    // Add bloom effect to a marker - DISABLED (no animations)
    addBloomEffect(marker) {
        // No animation - markers stay static
    }

    // Clear all markers from map
    clearMarkers() {
        const map = mapManager.getMap();
        if (!map) return;

        this.markers.forEach(marker => {
            map.removeLayer(marker);
        });

        this.markers.clear();
        this.markersData.clear();
    }

    // Get marker by memory ID
    getMarker(memoryId) {
        return this.markers.get(memoryId);
    }

    // Add sparkle effect to a marker
    addSparkle(memoryId) {
        const marker = this.markers.get(memoryId);
        if (!marker) return;

        const element = marker.getElement();
        if (!element) return;

        // Create sparkle element
        const sparkle = document.createElement('div');
        sparkle.className = 'marker-sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            background: #FFD700;
            border-radius: 50%;
            pointer-events: none;
            animation: sparkle 1s ease-out forwards;
            z-index: 1000;
        `;

        element.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }

    // Zoom to marker
    zoomToMarker(memoryId) {
        const memory = stateManager.getMemory(memoryId);
        if (!memory) return;

        mapManager.zoomToLocation(
            memory.position.lat,
            memory.position.lng,
            17
        );
    }
}

// Export singleton instance
export const pinManager = new PinManager();
