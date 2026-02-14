// Animation Effects

class AnimationManager {
    constructor() {
        this.petalsContainers = [];
    }

    // Initialize floating petals on a screen
    initializePetals(screenId, intensity = 'normal') {
        const screen = document.getElementById(screenId);
        if (!screen) return;

        const container = screen.querySelector('.petals-container');
        if (!container) return;

        this.petalsContainers.push(container);

        // Clear existing petals
        container.innerHTML = '';

        // Number of petals based on intensity
        const petalCount = intensity === 'intense' ? 20 : 10;

        for (let i = 0; i < petalCount; i++) {
            const petal = this.createPetal(i, petalCount);
            container.appendChild(petal);
        }
    }

    // Create a single petal element
    createPetal(index, total) {
        const petal = document.createElement('div');
        petal.className = 'petal';

        // Random properties for variety
        const size = 15 + Math.random() * 10;
        const duration = 8 + Math.random() * 4;
        const delay = (index / total) * 2;
        const drift = -50 + Math.random() * 100;

        petal.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --drift: ${drift}px;
        `;

        return petal;
    }

    // Create celebration confetti
    createCelebration(container) {
        if (!container) return;

        const colors = ['#F4A7B9', '#E63950', '#FFE4EC', '#FFD700', '#FF69B4'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'celebration-piece';

            const size = 8 + Math.random() * 6;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const startX = Math.random() * 100;
            const drift = -100 + Math.random() * 200;
            const duration = 2 + Math.random() * 2;
            const delay = Math.random() * 0.5;

            confetti.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${startX}%;
                --confetti-drift: ${drift}px;
                animation: confetti ${duration}s ease-out ${delay}s;
            `;

            container.appendChild(confetti);
        }

        // Clean up after animation
        setTimeout(() => {
            container.innerHTML = '';
        }, 4000);
    }

    // Trigger bloom animation on element
    triggerBloom(element) {
        if (!element) return;

        element.classList.remove('bloom');
        void element.offsetWidth; // Trigger reflow
        element.classList.add('bloom');

        setTimeout(() => {
            element.classList.remove('bloom');
        }, 1200);
    }

    // Add sparkle particles around element
    addSparkles(element, count = 5) {
        if (!element) return;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-particle';

                const angle = (Math.PI * 2 * i) / count;
                const distance = 30 + Math.random() * 20;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                sparkle.style.cssText = `
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background: #FFD700;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    animation: sparkle 0.8s ease-out;
                    --sparkle-x: ${x}px;
                    --sparkle-y: ${y}px;
                `;

                element.appendChild(sparkle);

                setTimeout(() => {
                    sparkle.remove();
                }, 800);
            }, i * 100);
        }
    }

    // Fade transition between screens
    async fadeTransition(fromScreen, toScreen, duration = 600) {
        if (fromScreen) {
            fromScreen.style.transition = `opacity ${duration}ms`;
            fromScreen.style.opacity = '0';
        }

        await new Promise(resolve => setTimeout(resolve, duration / 2));

        if (fromScreen) {
            fromScreen.style.display = 'none';
        }

        if (toScreen) {
            toScreen.style.display = 'flex';
            toScreen.style.opacity = '0';
            toScreen.style.transition = `opacity ${duration}ms`;

            requestAnimationFrame(() => {
                toScreen.style.opacity = '1';
            });
        }

        await new Promise(resolve => setTimeout(resolve, duration / 2));
    }

    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
        if (!element) return;

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Pulse animation
    pulse(element, duration = 600) {
        if (!element) return;

        element.style.transition = `transform ${duration / 2}ms ease-out`;
        element.style.transform = 'scale(1.1)';

        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration / 2);
    }

    // Clear all petals
    clearPetals() {
        this.petalsContainers.forEach(container => {
            container.innerHTML = '';
        });
        this.petalsContainers = [];
    }
}

// Export singleton instance
export const animationManager = new AnimationManager();

// Add custom sparkle keyframe if not in CSS
if (!document.querySelector('#sparkle-animation')) {
    const style = document.createElement('style');
    style.id = 'sparkle-animation';
    style.textContent = `
        @keyframes sparkle {
            0% {
                opacity: 0;
                transform: translate(calc(-50% + var(--sparkle-x, 0px)), calc(-50% + var(--sparkle-y, 0px))) scale(0);
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translate(calc(-50% + var(--sparkle-x, 0px)), calc(-50% + var(--sparkle-y, 0px))) scale(1.5);
            }
        }
    `;
    document.head.appendChild(style);
}
