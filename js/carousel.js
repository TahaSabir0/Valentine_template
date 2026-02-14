// Image Carousel Component

import { KEYBOARD_SHORTCUTS } from './config.js';

export class Carousel {
    constructor(container, images) {
        this.container = container;
        this.images = images;
        this.currentIndex = 0;

        this.track = container.querySelector('.carousel-track');
        this.prevBtn = container.querySelector('.carousel-prev');
        this.nextBtn = container.querySelector('.carousel-next');
        this.dotsContainer = container.querySelector('.carousel-dots');

        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.renderSlides();
        this.renderDots();
        this.setupEventListeners();
        this.updateUI();
    }

    renderSlides() {
        if (!this.track) return;

        this.track.innerHTML = '';

        this.images.forEach((imageSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Memory image ${index + 1} of ${this.images.length}`;
            img.loading = index === 0 ? 'eager' : 'lazy';

            // Error handling
            img.addEventListener('error', () => {
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-family="sans-serif" font-size="16"%3EImage not found%3C/text%3E%3C/svg%3E';
            });

            slide.appendChild(img);
            this.track.appendChild(slide);
        });
    }

    renderDots() {
        if (!this.dotsContainer || this.images.length <= 1) {
            if (this.dotsContainer) {
                this.dotsContainer.style.display = 'none';
            }
            return;
        }

        this.dotsContainer.innerHTML = '';

        this.images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Go to image ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    setupEventListeners() {
        // Previous/Next buttons
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === KEYBOARD_SHORTCUTS.ARROW_LEFT) {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === KEYBOARD_SHORTCUTS.ARROW_RIGHT) {
                e.preventDefault();
                this.nextSlide();
            }
        });

        // Touch events for swipe
        this.track?.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.track?.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        }, { passive: true });

        this.track?.addEventListener('touchend', () => {
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left, go to next
                this.nextSlide();
            } else {
                // Swiped right, go to previous
                this.prevSlide();
            }
        }

        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    goToSlide(index) {
        if (index < 0 || index >= this.images.length) return;

        this.currentIndex = index;
        this.updateUI();
    }

    nextSlide() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateUI();
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateUI();
        }
    }

    updateUI() {
        // Update track position
        if (this.track) {
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }

        // Update buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }

        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.images.length - 1;
        }

        // Update dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                }
            });
        }

        // Hide controls if only one image
        if (this.images.length <= 1) {
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
        }
    }

    destroy() {
        // Clean up event listeners
        this.prevBtn?.removeEventListener('click', () => this.prevSlide());
        this.nextBtn?.removeEventListener('click', () => this.nextSlide());

        // Reset
        if (this.track) {
            this.track.innerHTML = '';
        }
        if (this.dotsContainer) {
            this.dotsContainer.innerHTML = '';
        }
    }
}
