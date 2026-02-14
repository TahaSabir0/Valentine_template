// Memory Modal Management

import { stateManager } from './state.js';
import { MEDIA_TYPES, KEYBOARD_SHORTCUTS } from './config.js';
import { Carousel } from './carousel.js';

class ModalManager {
    constructor() {
        this.modal = document.getElementById('memory-modal');
        this.backdrop = this.modal?.querySelector('.modal-backdrop');
        this.closeBtn = document.getElementById('modal-close-btn');
        this.title = document.getElementById('modal-title');
        this.caption = document.getElementById('modal-caption');
        this.mediaContainer = document.getElementById('media-container');
        this.carouselElement = document.getElementById('carousel');
        this.videoPlayer = document.getElementById('video-player');
        this.video = document.getElementById('memory-video');

        this.currentMemory = null;
        this.carousel = null;
        this.focusTrap = null;

        // Proposal state (minimal - only for memory 10 detection)
        this.proposalMemoryAccepted = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close button
        this.closeBtn?.addEventListener('click', () => this.close());

        // Backdrop click
        this.backdrop?.addEventListener('click', () => this.close());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen()) return;

            if (e.key === KEYBOARD_SHORTCUTS.ESCAPE) {
                this.close();
            }
        });
    }

    // Open modal with memory data
    open(memory) {
        if (!this.modal) return;

        this.currentMemory = memory;

        // Reset modal state for all memories
        this.resetModalState();

        // Check if this is the special proposal memory
        if (memory.specialType === 'proposal') {
            this.loadProposalMemory();
        } else {
            // Set content for normal memories
            this.title.textContent = memory.title || `Memory ${memory.id}`;
            this.caption.textContent = memory.caption;

            // Load media
            if (memory.mediaType === MEDIA_TYPES.IMAGES) {
                this.loadImages(memory.media);
            } else if (memory.mediaType === MEDIA_TYPES.VIDEO) {
                this.loadVideo(memory.media[0]);
            }
        }

        // Show modal
        this.modal.removeAttribute('hidden');
        document.body.classList.add('modal-open');

        // Set up focus trap
        this.setupFocusTrap();

        // Focus close button (or proposal button for memory 10)
        setTimeout(() => {
            if (memory.specialType === 'proposal') {
                const inputFieldBtn = document.getElementById('proposal-input-btn');
                inputFieldBtn?.focus();
            } else {
                this.closeBtn?.focus();
            }
        }, 100);
    }

    // Reset modal to clean state
    resetModalState() {
        // Reset title/caption visibility
        this.title.style.display = '';
        this.caption.style.display = '';
        this.closeBtn.style.display = '';

        // Remove proposal-modal class
        this.modal.querySelector('.modal-content')?.classList.remove('proposal-modal');

        // Clear any existing proposal content
        const existingProposal = document.getElementById('proposal-container');
        if (existingProposal) {
            existingProposal.remove();
        }
        const existingError = document.getElementById('proposal-error-container');
        if (existingError) {
            existingError.remove();
        }

        // Reset proposal state
        this.proposalMemoryAccepted = false;
    }

    // Load images (create carousel)
    loadImages(images) {
        // Hide video, show carousel
        this.videoPlayer?.setAttribute('hidden', '');
        this.carouselElement?.removeAttribute('hidden');

        // Initialize carousel
        this.carousel = new Carousel(this.carouselElement, images);
    }

    // Load video
    loadVideo(videoSrc) {
        // Hide carousel, show video
        this.carouselElement?.setAttribute('hidden', '');
        this.videoPlayer?.removeAttribute('hidden');

        if (this.video) {
            this.video.src = videoSrc;
            this.video.load();
        }
    }

    // ============================================================
    // PROPOSAL MEMORY - Two-step flow
    // Step 1: Error 404 with "Access Input Field" button
    // Step 2: Actual proposal with hamster + yes/no buttons
    // ============================================================

    // Load Step 1: Error 404 screen
    loadProposalMemory() {
        // Hide title/caption (we'll set our own)
        this.title.style.display = 'none';
        this.caption.style.display = 'none';
        this.closeBtn.style.display = 'none';

        // Hide both carousel and video
        this.carouselElement?.setAttribute('hidden', '');
        this.videoPlayer?.setAttribute('hidden', '');

        // Add proposal-modal class to hide close button
        this.modal.querySelector('.modal-content')?.classList.add('proposal-modal');

        // Reset proposal state
        this.proposalAccepted = false;
        this.noButtonMoved = false;

        // Create error 404 container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'proposal-container';
        errorContainer.id = 'proposal-error-container';

        // Create the error 404 content
        errorContainer.innerHTML = `
            <div class="proposal-question">Error 404</div>
            <p style="text-align: center; color: #666; margin-bottom: 2rem;">This question requires user input to be generated.</p>
            <button id="proposal-input-btn" class="proposal-btn proposal-btn-yes">Access Input Field</button>
        `;

        // Clear media container and add error
        this.mediaContainer.innerHTML = '';
        this.mediaContainer.appendChild(errorContainer);

        // Set up button handler - navigate to final screen
        const inputBtn = document.getElementById('proposal-input-btn');
        inputBtn?.addEventListener('click', () => this.goToFinalScreen());
    }

    // Navigate to final screen (where the actual proposal is)
    goToFinalScreen() {
        // Close modal
        this.close();

        // Navigate to final screen (proposal is embedded there)
        window.RoseGarden.app.showFinalScreen();
    }

    // ============================================================
    // MODAL CLOSE
    // ============================================================

    // Close modal
    close() {
        if (!this.modal || !this.currentMemory) {
            return;
        }

        // Reset modal styling (in case it was proposal)
        this.title.style.display = '';
        this.caption.style.display = '';
        this.closeBtn.style.display = '';
        this.modal.querySelector('.modal-content')?.classList.remove('proposal-modal');

        // Mark memory as completed if not already
        // For proposal memory (id 10), only mark complete if they said yes
        const isProposal = this.currentMemory.specialType === 'proposal';
        if (!this.currentMemory.completed && !isProposal) {
            stateManager.markMemoryComplete(this.currentMemory.id);
        } else if (!this.currentMemory.completed) {
            stateManager.markMemoryComplete(this.currentMemory.id);
        }

        // Clean up media
        if (this.carousel) {
            this.carousel.destroy();
            this.carousel = null;
        }

        if (this.video) {
            this.video.pause();
            this.video.src = '';
        }

        // Hide modal
        this.modal.setAttribute('hidden', '');
        document.body.classList.remove('modal-open');

        // Remove focus trap
        this.removeFocusTrap();

        this.currentMemory = null;
    }

    // Check if modal is open
    isOpen() {
        return this.modal && !this.modal.hasAttribute('hidden');
    }

    // Focus trap for accessibility
    setupFocusTrap() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.focusTrap = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        this.modal.addEventListener('keydown', this.focusTrap);
    }

    removeFocusTrap() {
        if (this.focusTrap) {
            this.modal.removeEventListener('keydown', this.focusTrap);
            this.focusTrap = null;
        }
    }
}

// Export singleton instance
const modalManager = new ModalManager();

export function openMemoryModal(memory) {
    modalManager.open(memory);
}

export function closeMemoryModal() {
    modalManager.close();
}
