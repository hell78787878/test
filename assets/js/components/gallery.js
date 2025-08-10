// Gallery Component JavaScript
class GalleryComponent {
    constructor(gallerySelector, options = {}) {
        this.gallery = document.querySelector(gallerySelector);
        this.options = {
            lightbox: true,
            filterButtons: true,
            autoplay: false,
            autoplayDelay: 3000,
            ...options
        };
        
        this.currentImageIndex = 0;
        this.images = [];
        this.filteredImages = [];
        this.lightboxOpen = false;
        
        if (this.gallery) {
            this.init();
        }
    }
    
    init() {
        this.setupGallery();
        if (this.options.lightbox) {
            this.createLightbox();
        }
        if (this.options.filterButtons) {
            this.setupFilters();
        }
        this.setupKeyboardEvents();
    }
    
    setupGallery() {
        // Get all gallery items
        this.images = Array.from(this.gallery.querySelectorAll('.gallery-item'));
        this.filteredImages = [...this.images];
        
        // Add click events to images
        this.images.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.options.lightbox) {
                    this.openLightbox(index);
                }
            });
            
            // Add lazy loading
            const img = item.querySelector('img');
            if (img && img.dataset.src) {
                this.lazyLoadImage(img);
            }
        });
    }
    
    setupFilters() {
        const filterContainer = document.querySelector('.filter-buttons');
        if (!filterContainer) return;
        
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter images
                const filter = button.dataset.filter;
                this.filterImages(filter);
            });
        });
    }
    
    filterImages(filter) {
        this.images.forEach((item, index) => {
            const categories = item.dataset.category ? item.dataset.category.split(' ') : [];
            
            if (filter === 'all' || categories.includes(filter)) {
                item.style.display = 'block';
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50 * index);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }, 200);
            }
        });
        
        // Update filtered images array for lightbox
        this.filteredImages = this.images.filter(item => 
            !item.classList.contains('hidden')
        );
    }
    
    createLightbox() {
        const lightboxHTML = `
            <div id="lightbox" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden items-center justify-center">
                <div class="relative max-w-4xl max-h-full p-4">
                    <!-- Close button -->
                    <button class="absolute top-4 right-4 text-white text-2xl z-60 hover:text-gray-300 transition-colors"
                            id="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <!-- Navigation arrows -->
                    <button class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors"
                            id="lightbox-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <button class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors"
                            id="lightbox-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    
                    <!-- Image container -->
                    <div class="flex items-center justify-center">
                        <img id="lightbox-image" class="max-w-full max-h-full object-contain" src="" alt="">
                    </div>
                    
                    <!-- Image counter -->
                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                        <span id="lightbox-counter"></span>
                    </div>
                    
                    <!-- Image description -->
                    <div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white text-center max-w-2xl">
                        <h3 id="lightbox-title" class="text-xl font-semibold mb-2"></h3>
                        <p id="lightbox-description" class="text-sm opacity-80"></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightbox-image');
        this.lightboxTitle = document.getElementById('lightbox-title');
        this.lightboxDescription = document.getElementById('lightbox-description');
        this.lightboxCounter = document.getElementById('lightbox-counter');
        
        this.setupLightboxEvents();
    }
    
    setupLightboxEvents() {
        // Close button
        document.getElementById('lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });
        
        // Navigation buttons
        document.getElementById('lightbox-prev').addEventListener('click', () => {
            this.navigateLightbox(-1);
        });
        
        document.getElementById('lightbox-next').addEventListener('click', () => {
            this.navigateLightbox(1);
        });
        
        // Click outside to close
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Touch events for mobile
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        
        this.lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.lightbox.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.navigateLightbox(1); // Swipe left, next image
                    } else {
                        this.navigateLightbox(-1); // Swipe right, prev image
                    }
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.lightboxOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    this.navigateLightbox(1);
                    break;
            }
        });
    }
    
    openLightbox(index) {
        const visibleImages = this.filteredImages;
        if (visibleImages.length === 0) return;
        
        // Find the index in visible images
        const clickedImage = this.images[index];
        const visibleIndex = visibleImages.indexOf(clickedImage);
        
        if (visibleIndex === -1) return;
        
        this.currentImageIndex = visibleIndex;
        this.updateLightboxContent();
        
        this.lightbox.classList.remove('hidden');
        this.lightbox.classList.add('flex');
        this.lightboxOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            this.lightbox.style.opacity = '1';
        }, 10);
    }
    
    closeLightbox() {
        this.lightbox.style.opacity = '0';
        
        setTimeout(() => {
            this.lightbox.classList.add('hidden');
            this.lightbox.classList.remove('flex');
            this.lightboxOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
        }, 200);
    }
    
    navigateLightbox(direction) {
        const visibleImages = this.filteredImages;
        if (visibleImages.length <= 1) return;
        
        this.currentImageIndex += direction;
        
        if (this.currentImageIndex >= visibleImages.length) {
            this.currentImageIndex = 0;
        } else if (this.currentImageIndex < 0) {
            this.currentImageIndex = visibleImages.length - 1;
        }
        
        this.updateLightboxContent();
    }
    
    updateLightboxContent() {
        const visibleImages = this.filteredImages;
        const currentItem = visibleImages[this.currentImageIndex];
        
        if (!currentItem) return;
        
        const img = currentItem.querySelector('img');
        const title = currentItem.dataset.title || img.alt || '';
        const description = currentItem.dataset.description || '';
        
        // Update image
        this.lightboxImage.src = img.src || img.dataset.src;
        this.lightboxImage.alt = img.alt;
        
        // Update content
        this.lightboxTitle.textContent = title;
        this.lightboxDescription.textContent = description;
        this.lightboxCounter.textContent = `${this.currentImageIndex + 1} / ${visibleImages.length}`;
        
        // Show/hide navigation arrows
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        if (visibleImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }
    
    lazyLoadImage(img) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove('lazy');
                    observer.unobserve(image);
                }
            });
        });
        
        observer.observe(img);
    }
    
    // Public methods
    addImage(imageData) {
        const imageHTML = `
            <div class="gallery-item" data-category="${imageData.category}" data-title="${imageData.title}" data-description="${imageData.description}">
                <div class="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer">
                    <img src="${imageData.src}" alt="${imageData.alt}" class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <i class="fas fa-expand text-white text-2xl"></i>
                    </div>
                </div>
            </div>
        `;
        
        this.gallery.insertAdjacentHTML('beforeend', imageHTML);
        this.setupGallery(); // Reinitialize
    }
    
    removeImage(index) {
        if (this.images[index]) {
            this.images[index].remove();
            this.setupGallery(); // Reinitialize
        }
    }
}

// Export for use in other modules
window.GalleryComponent = GalleryComponent;
