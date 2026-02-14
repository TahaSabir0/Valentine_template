// Interactive Map Management with Leaflet.js

import { config } from '../data.js';

class MapManager {
    constructor() {
        this.mapElement = document.getElementById('garden-map');
        this.map = null;
        this.zoomInBtn = document.getElementById('zoom-in-btn');
        this.zoomOutBtn = document.getElementById('zoom-out-btn');
        this.resetBtn = document.getElementById('reset-zoom-btn');
        this.isDevMode = false;
    }

    // Initialize Leaflet map
    initialize() {
        if (!this.mapElement || typeof L === 'undefined') {
            console.warn('Leaflet not available or map element not found');
            return;
        }

        // Create Leaflet map
        this.map = L.map(this.mapElement, {
            center: [config.map.center.lat, config.map.center.lng],
            zoom: config.map.zoom,
            minZoom: config.map.minZoom,
            maxZoom: config.map.maxZoom,
            zoomControl: false, // We'll add custom zoom controls
            attributionControl: true
        });

        // Add tile layer (OpenStreetMap)
        L.tileLayer(config.map.tileLayer, {
            attribution: config.map.attribution,
            maxZoom: config.map.maxZoom
        }).addTo(this.map);

        // Add custom zoom controls
        this.setupControls();

        // Check for dev mode
        this.checkDevMode();

        // Invalidate size to ensure proper rendering
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);
    }

    // Setup zoom control buttons
    setupControls() {
        this.zoomInBtn?.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn?.addEventListener('click', () => this.zoomOut());
        this.resetBtn?.addEventListener('click', () => this.resetView());
    }

    // Zoom in
    zoomIn() {
        if (!this.map) return;
        this.map.zoomIn();
    }

    // Zoom out
    zoomOut() {
        if (!this.map) return;
        this.map.zoomOut();
    }

    // Reset view to initial center and zoom
    resetView() {
        if (!this.map) return;
        this.map.setView([config.map.center.lat, config.map.center.lng], config.map.zoom);
    }

    // Zoom to specific location
    zoomToLocation(lat, lng, zoomLevel = 17) {
        if (!this.map) return;
        this.map.flyTo([lat, lng], zoomLevel, {
            animate: true,
            duration: 1.5
        });
    }

    // Get current map center
    getCenter() {
        if (!this.map) return null;
        const center = this.map.getCenter();
        return { lat: center.lat, lng: center.lng };
    }

    // Get current zoom level
    getZoom() {
        return this.map ? this.map.getZoom() : config.map.zoom;
    }

    // Check for dev mode
    checkDevMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const devMode = urlParams.get('dev') === 'true' || config.enableDevMode;

        if (devMode) {
            this.enableDevMode();
        }
    }

    // Enable development mode (click to get coordinates)
    enableDevMode() {
        this.isDevMode = true;

        const indicator = document.getElementById('dev-mode-indicator');
        const coordinates = document.getElementById('dev-coordinates');

        if (indicator) {
            indicator.removeAttribute('hidden');
        }

        // Add click handler to map
        if (this.map) {
            this.map.on('click', (e) => {
                const { lat, lng } = e.latlng;

                if (coordinates) {
                    coordinates.innerHTML = `
                        <div>Lat: ${lat.toFixed(14)}</div>
                        <div>Lng: ${lng.toFixed(14)}</div>
                        <div style="margin-top: 4px; font-size: 11px; color: #666;">
                            { lat: ${lat.toFixed(14)}, lng: ${lng.toFixed(14)} }
                        </div>
                    `;
                }

                // Add temporary marker
                this.addTempMarker(lat, lng);
            });
        }
    }

    // Add temporary marker for dev mode
    addTempMarker(lat, lng) {
        const marker = L.marker([lat, lng], {
            opacity: 0.7
        }).addTo(this.map);

        // Remove after 3 seconds
        setTimeout(() => {
            this.map.removeLayer(marker);
        }, 3000);
    }

    // Get map instance (for use by other modules)
    getMap() {
        return this.map;
    }

    // Destroy map instance
    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }
}

// Export singleton instance
export const mapManager = new MapManager();
