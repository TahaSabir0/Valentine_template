// Main Application Entry Point

import { router } from './router.js';
import { stateManager } from './state.js';
import { pinManager } from './pins.js';
import { progressManager } from './progress.js';
import { mapManager } from './map.js';
import { animationManager } from './animations.js';
import { SCREENS, EVENTS } from './config.js';
import { landing, finalMessage } from '../data.js';

class App {
    constructor() {
        this.initialized = false;

        // Proposal state
        this.proposalAccepted = false;
        this.fireworksRunning = false;
        this.fireworksParticles = [];
        this.fireworksCanvas = null;
        this.fireworksCtx = null;

        // Initialize fireworks
        this.initFireworks();
    }

    // Populate all dynamic HTML text from data.js
    populateHTML() {
        // Landing screen
        const titleEl = document.getElementById('landing-title');
        const descEl = document.getElementById('landing-description');
        const subEl = document.getElementById('landing-subtitle');
        const startBtn = document.getElementById('start-btn');
        if (titleEl) titleEl.textContent = landing.title;
        if (descEl) descEl.textContent = landing.description;
        if (subEl) subEl.textContent = landing.subtitle;
        if (startBtn) startBtn.textContent = landing.buttonText;

        // Final / proposal screen
        const finalTitle = document.getElementById('final-title');
        const finalBody = document.getElementById('final-body');
        const finalQuestion = document.getElementById('final-question');
        const yesBtn = document.getElementById('proposal-yes-btn');
        const noBtn = document.getElementById('proposal-no-btn');
        const successTitle = document.getElementById('final-success-title');
        const sadImg = document.getElementById('proposal-sad-img');
        const happyImg = document.getElementById('proposal-happy-img');

        if (finalTitle) finalTitle.textContent = finalMessage.title;
        if (finalBody) {
            finalBody.innerHTML = '';
            finalMessage.body.forEach(text => {
                const p = document.createElement('p');
                p.textContent = text;
                finalBody.appendChild(p);
            });
        }
        if (finalQuestion) finalQuestion.textContent = finalMessage.question;
        if (yesBtn) yesBtn.textContent = finalMessage.yesButton;
        if (noBtn) noBtn.textContent = finalMessage.noButton;
        if (successTitle) successTitle.textContent = finalMessage.successTitle;
        if (sadImg) sadImg.src = finalMessage.sadImage;
        if (happyImg) happyImg.src = finalMessage.happyImage;
    }

    // Initialize application
    async init() {
        try {
            if (this.initialized) {
                return;
            }

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Populate HTML from data.js (before anything else renders)
            this.populateHTML();

            // Initialize components
            this.setupEventListeners();
            this.setupStateListeners();

            // Initialize animations
            animationManager.initializePetals(SCREENS.LANDING);
            animationManager.initializePetals(SCREENS.MAP);

            // Show landing screen
            await router.navigateTo(SCREENS.LANDING, true);

            this.initialized = true;
        } catch (error) {
            console.error('FATAL ERROR during initialization:', error);
        }
    }

    // Setup UI event listeners
    setupEventListeners() {
        // Start button on landing screen
        const startBtn = document.getElementById('start-btn');
        startBtn?.addEventListener('click', () => {
            this.startExperience();
        });

        // Proposal yes button (on final screen)
        const proposalYesBtn = document.getElementById('proposal-yes-btn');
        proposalYesBtn?.addEventListener('click', () => {
            this.handleProposalYes();
        });

        // Proposal no button - runs away on hover (desktop) and click (mobile)
        const proposalNoBtn = document.getElementById('proposal-no-btn');
        proposalNoBtn?.addEventListener('mouseenter', () => this.moveNoButton());
        proposalNoBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.moveNoButton();
        });

        // Old final-yes-btn (kept for compatibility, but not used in new flow)
        const finalYesBtn = document.getElementById('final-yes-btn');
        finalYesBtn?.addEventListener('click', () => {
            this.handleFinalYes();
        });

        // Dev mode reset button
        const devResetBtn = document.getElementById('dev-reset-btn');
        devResetBtn?.addEventListener('click', () => {
            if (confirm('Reset all progress? This will clear all completed memories.')) {
                this.reset();
            }
        });
    }

    // Setup state event listeners
    setupStateListeners() {
        // Listen for all memories completed
        stateManager.on(EVENTS.ALL_COMPLETE, () => {
            setTimeout(() => {
                this.showFinalScreen();
            }, 1500);
        });
    }

    // Start the memory exploration
    async startExperience() {
        // Reset all progress when starting fresh from landing page
        stateManager.reset();

        // Navigate to map screen
        await router.navigateTo(SCREENS.MAP);

        // Initialize map first, wait for it to be ready, then render markers
        setTimeout(() => {
            mapManager.initialize();

            // Wait a bit for map tiles to load, then render markers
            setTimeout(() => {
                pinManager.renderMarkers();
                progressManager.initialize();
            }, 500);
        }, 300);
    }

    // Show final reveal screen (now contains the proposal)
    async showFinalScreen() {
        // Reset proposal state
        this.proposalAccepted = false;

        // Reset proposal card class
        const proposalCard = document.getElementById('proposal-card');
        if (proposalCard) {
            proposalCard.classList.remove('proposal-accepted');
        }

        // Show question state, hide success state
        const questionState = document.getElementById('proposal-question-state');
        const successState = document.getElementById('proposal-success-state');
        if (questionState) {
            questionState.classList.remove('hidden');
            questionState.style.display = '';
        }
        if (successState) successState.style.display = 'none';

        // Reset hamster
        const hamster = document.getElementById('proposal-hamster');
        if (hamster) {
            hamster.classList.remove('happy');
            const hamsterImg = hamster.querySelector('img');
            if (hamsterImg) {
                hamsterImg.src = finalMessage.sadImage;
            }
        }

        // Reset no button back into its original container
        const noBtn = document.getElementById('proposal-no-btn');
        const btnContainer = document.querySelector('#proposal-question-state .proposal-buttons');
        if (noBtn && btnContainer && noBtn.parentElement !== btnContainer) {
            btnContainer.appendChild(noBtn);
        }
        if (noBtn) {
            noBtn.style.position = '';
            noBtn.style.top = '';
            noBtn.style.left = '';
            noBtn.style.zIndex = '';
            noBtn.style.margin = '';
        }

        // Initialize petals for final screen
        animationManager.initializePetals(SCREENS.FINAL, 'intense');

        // Navigate to final screen (content is already in HTML)
        await router.navigateTo(SCREENS.FINAL);

        // Trigger animations after screen is visible
        const finalContent = document.querySelector('#final-screen .final-content');
        if (finalContent) {
            // Force reflow and add ready class
            void finalContent.offsetHeight;
            finalContent.classList.add('ready');
        }
    }

    // Move the no button to a random visible spot on screen
    moveNoButton() {
        const noBtn = document.getElementById('proposal-no-btn');
        if (!noBtn) return;

        // Measure button while it's still in normal flow
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;

        // Current position for minimum-distance check
        const rect = noBtn.getBoundingClientRect();
        const curX = rect.left;
        const curY = rect.top;

        // Move button to document.body so position:fixed works correctly
        // (CSS transforms on ancestors create a new containing block that traps fixed elements)
        if (noBtn.parentElement !== document.body) {
            document.body.appendChild(noBtn);
        }

        noBtn.style.position = 'fixed';
        noBtn.style.zIndex = '10000';
        noBtn.style.margin = '0';

        // Use visualViewport for accurate mobile dimensions (accounts for keyboard, zoom)
        const vw = (window.visualViewport?.width ?? window.innerWidth);
        const vh = (window.visualViewport?.height ?? window.innerHeight);

        // Safe margin from screen edges
        const margin = 16;

        // Available range for the button's top-left corner
        const maxX = Math.max(margin, vw - btnWidth - margin);
        const maxY = Math.max(margin, vh - btnHeight - margin);

        // Pick a new position that's at least 80px away from current
        let newX, newY;
        let tries = 0;
        do {
            newX = margin + Math.random() * (maxX - margin);
            newY = margin + Math.random() * (maxY - margin);
            tries++;
        } while (
            tries < 20 &&
            Math.hypot(newX - curX, newY - curY) < 80
        );

        // Final clamp to guarantee on-screen
        newX = Math.max(margin, Math.min(maxX, newX));
        newY = Math.max(margin, Math.min(maxY, newY));

        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
    }

    // Handle proposal yes button - show success and fireworks
    handleProposalYes() {
        if (this.proposalAccepted) return;
        this.proposalAccepted = true;

        // Add success class to card (controls visibility via CSS)
        const proposalCard = document.getElementById('proposal-card');
        if (proposalCard) {
            proposalCard.classList.add('proposal-accepted');
        }

        // Hide question state, show success state
        const questionState = document.getElementById('proposal-question-state');
        const successState = document.getElementById('proposal-success-state');
        if (questionState) {
            questionState.classList.add('hidden');
            questionState.style.display = 'none';
        }
        if (successState) {
            successState.style.display = 'block';
        }

        // Make hamster happy
        const hamster = document.getElementById('proposal-hamster');
        if (hamster) {
            hamster.classList.add('happy');
            // Update hamster image to happy one
            const hamsterImg = hamster.querySelector('img');
            if (hamsterImg) {
                hamsterImg.src = finalMessage.happyImage;
            }
        }

        // Start fireworks
        this.startFireworks();

        // Mark memory 10 as complete
        stateManager.markMemoryComplete(10);

        // Create celebration
        const celebrationContainer = document.getElementById('celebration');
        if (celebrationContainer) {
            celebrationContainer.removeAttribute('hidden');
            animationManager.createCelebration(celebrationContainer);
        }

        // Reset roses after a delay so the user can experience it again
        setTimeout(() => {
            stateManager.reset();
            // Re-render markers with fresh state after reset
            pinManager.renderMarkers();
            progressManager.initialize();
        }, 5000);
    }

    // Handle final "Yes" button click (old method, kept for compatibility)
    handleFinalYes() {
        this.handleProposalYes();
    }

    // Show success message after "Yes" (old method, not used in new flow)
    showSuccessMessage() {
        const finalContent = document.querySelector('.final-content');
        if (!finalContent) return;

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';

        const innerDiv = document.createElement('div');
        innerDiv.className = 'success-message-inner';
        innerDiv.innerHTML = `
            <h2>I knew you'd say yes! 💗</h2>
        `;

        successDiv.appendChild(innerDiv);
        document.body.appendChild(successDiv);

        // Trigger celebration again
        setTimeout(() => {
            const celebrationContainer = document.getElementById('celebration');
            if (celebrationContainer) {
                animationManager.createCelebration(celebrationContainer);
            }
        }, 1000);
    }

    // ============================================================
    // FIREWORKS EFFECT
    // ============================================================

    initFireworks() {
        const canvas = document.getElementById('fireworks');
        if (!canvas) return;

        this.fireworksCanvas = canvas;
        this.fireworksCtx = canvas.getContext('2d');

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Start animation loop
        this.animateFireworks();
    }

    createParticle(x, y) {
        const colors = ['#ec4899', '#f43f5e', '#fb7185', '#fda4af', '#fce7f3', '#ffd700', '#ff6b6b', '#ff1493'];
        return {
            x: x,
            y: y,
            color: colors[Math.floor(Math.random() * colors.length)],
            radius: Math.random() * 3 + 1,
            velocity: {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            },
            alpha: 1,
            decay: Math.random() * 0.015 + 0.005
        };
    }

    createFirework() {
        if (!this.fireworksCanvas) return;
        const x = Math.random() * this.fireworksCanvas.width;
        const y = Math.random() * this.fireworksCanvas.height * 0.5;
        for (let i = 0; i < 50; i++) {
            this.fireworksParticles.push(this.createParticle(x, y));
        }
    }

    animateFireworks() {
        if (!this.fireworksCanvas || !this.fireworksCtx) return;

        // Clear canvas
        this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);

        // Update and draw particles
        this.fireworksParticles = this.fireworksParticles.filter(p => p.alpha > 0);

        this.fireworksParticles.forEach(p => {
            this.fireworksCtx.beginPath();
            this.fireworksCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.fireworksCtx.fillStyle = p.color;
            this.fireworksCtx.globalAlpha = p.alpha;
            this.fireworksCtx.fill();

            p.x += p.velocity.x;
            p.y += p.velocity.y;
            p.velocity.y += 0.05; // gravity
            p.alpha -= p.decay;
        });

        this.fireworksCtx.globalAlpha = 1;

        // Create new fireworks randomly
        if (this.fireworksRunning && Math.random() < 0.05) {
            this.createFirework();
        }

        requestAnimationFrame(() => this.animateFireworks());
    }

    startFireworks() {
        if (!this.fireworksRunning) {
            this.fireworksRunning = true;
            this.fireworksCanvas?.classList.add('active');

            // Create initial burst
            for (let i = 0; i < 5; i++) {
                setTimeout(() => this.createFirework(), i * 300);
            }
        }
    }

    stopFireworks() {
        this.fireworksRunning = false;
        this.fireworksParticles = [];
        this.fireworksCanvas?.classList.remove('active');
        if (this.fireworksCtx) {
            this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);
        }
    }

    // Reset application (for testing)
    reset() {
        // Stop fireworks
        this.stopFireworks();

        // Reset proposal state
        this.proposalAccepted = false;

        // Reset proposal card class
        const proposalCard = document.getElementById('proposal-card');
        if (proposalCard) {
            proposalCard.classList.remove('proposal-accepted');
        }

        // Reset proposal UI
        const questionState = document.getElementById('proposal-question-state');
        const successState = document.getElementById('proposal-success-state');
        if (questionState) {
            questionState.classList.remove('hidden');
            questionState.style.display = '';
        }
        if (successState) successState.style.display = 'none';

        // Reset hamster
        const hamster = document.getElementById('proposal-hamster');
        if (hamster) {
            hamster.classList.remove('happy');
            const hamsterImg = hamster.querySelector('img');
            if (hamsterImg) {
                hamsterImg.src = finalMessage.sadImage;
            }
        }

        // Reset no button position
        const noBtn = document.getElementById('proposal-no-btn');
        if (noBtn) {
            noBtn.style.position = '';
            noBtn.style.top = '';
            noBtn.style.left = '';
            noBtn.style.zIndex = '';
            noBtn.style.margin = '';
        }

        // Reset app state
        stateManager.reset();
        router.navigateTo(SCREENS.LANDING);
        pinManager.renderMarkers();
        progressManager.initialize();
    }
}

// Create and initialize app
const app = new App();
app.init();

// Expose app globally for debugging
window.RoseGarden = {
    app,
    router,
    state: stateManager,
    pins: pinManager,
    progress: progressManager,
    map: mapManager,
    animations: animationManager,
    reset: () => app.reset()
};
