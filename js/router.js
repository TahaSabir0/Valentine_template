// Screen Router & Transitions

import { SCREENS } from './config.js';

class Router {
    constructor() {
        this.currentScreen = null;
        this.screens = new Map();

        // Cache screen elements
        Object.values(SCREENS).forEach(screenId => {
            const element = document.getElementById(screenId);
            if (element) {
                this.screens.set(screenId, element);
            }
        });
    }

    // Navigate to a screen
    async navigateTo(screenId, immediate = false) {
        if (!this.screens.has(screenId)) {
            console.error(`Screen ${screenId} not found`);
            return;
        }

        const nextScreen = this.screens.get(screenId);

        // If there's a current screen, hide it
        if (this.currentScreen) {
            const currentElement = this.screens.get(this.currentScreen);
            if (currentElement && !immediate) {
                await this.hideScreen(currentElement);
            } else if (currentElement) {
                currentElement.classList.remove('active');
            }
        }

        // Show next screen
        if (immediate) {
            this.showScreenImmediate(nextScreen);
        } else {
            await this.showScreen(nextScreen);
        }

        this.currentScreen = screenId;

        // Update body class for modal management
        if (screenId === SCREENS.LANDING || screenId === SCREENS.FINAL) {
            document.body.classList.remove('modal-open');
        }
    }

    // Show screen with animation
    showScreen(element) {
        return new Promise(resolve => {
            element.classList.add('active');
            element.style.display = 'flex';

            // Wait for animation
            setTimeout(() => {
                resolve();
            }, 600);
        });
    }

    // Show screen immediately
    showScreenImmediate(element) {
        element.classList.add('active');
        element.style.display = 'flex';
    }

    // Hide screen with animation
    hideScreen(element) {
        return new Promise(resolve => {
            element.classList.add('exiting');

            setTimeout(() => {
                element.classList.remove('active', 'exiting');
                element.style.display = 'none';
                resolve();
            }, 250);
        });
    }

    // Get current screen
    getCurrentScreen() {
        return this.currentScreen;
    }
}

// Export singleton instance
export const router = new Router();
