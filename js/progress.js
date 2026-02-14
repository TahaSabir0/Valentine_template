// Progress Bar Management

import { stateManager } from './state.js';
import { EVENTS } from './config.js';

class ProgressManager {
    constructor() {
        this.fillElement = document.getElementById('progress-fill');
        this.counterElement = document.getElementById('progress-counter');
        this.subtitleElement = document.getElementById('progress-subtitle');

        // Listen for progress updates
        stateManager.on(EVENTS.PROGRESS_UPDATE, (data) => {
            this.updateProgress(data);
        });

        stateManager.on(EVENTS.STATE_CHANGE, ({ reset }) => {
            if (reset) {
                this.initialize();
            }
        });
    }

    // Initialize progress bar
    initialize() {
        const progress = stateManager.getProgress();
        const total = stateManager.getMemories().length;
        const percentage = stateManager.getProgressPercentage();
        const subtitle = stateManager.getProgressSubtitle();

        this.setProgress(percentage, false);
        this.setCounter(progress, total);
        this.setSubtitle(subtitle);
    }

    // Update progress bar
    updateProgress({ count, percentage, subtitle }) {
        const total = stateManager.getMemories().length;

        this.setProgress(percentage, true);
        this.setCounter(count, total);
        this.setSubtitle(subtitle);
    }

    // Set progress fill width
    setProgress(percentage, animate = true) {
        if (!this.fillElement) return;

        if (animate) {
            // Trigger reflow to restart animation
            this.fillElement.style.transition = 'none';
            this.fillElement.style.width = this.fillElement.style.width;
            void this.fillElement.offsetWidth;
            this.fillElement.style.transition = '';
        }

        this.fillElement.style.width = `${percentage}%`;

        // Update ARIA attributes
        const progressBar = this.fillElement.parentElement;
        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', Math.round(percentage / 10));
        }
    }

    // Set counter text
    setCounter(count, total) {
        if (!this.counterElement) return;
        this.counterElement.textContent = `${count}/${total}`;
    }

    // Set subtitle text
    setSubtitle(text) {
        if (!this.subtitleElement) return;
        this.subtitleElement.textContent = text;
    }

    // Animate counter increment
    animateCounter(from, to, total) {
        if (!this.counterElement) return;

        const duration = 600;
        const steps = to - from;
        const stepDuration = duration / steps;

        let current = from;
        const interval = setInterval(() => {
            current++;
            this.counterElement.textContent = `${current}/${total}`;

            if (current >= to) {
                clearInterval(interval);
            }
        }, stepDuration);
    }
}

// Export singleton instance
export const progressManager = new ProgressManager();
