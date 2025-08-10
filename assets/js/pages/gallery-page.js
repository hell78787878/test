// Enhanced Gallery Component for the new gallery page
class GalleryPageComponent {
    constructor() {
        this.currentFilter = 'all';
        this.galleryItems = [];
        this.init();
    }
    
    init() {
        this.setupGalleryItems();
        this.setupFilters();
        this.setupZoomModal();
    }
    
    setupGalleryItems() {
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        
        this.galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openZoomModal(item);
            });
        });
    }
    
    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active', 'bg-primary', 'text-white'));
                filterBtns.forEach(b => b.classList.add('text-primary', 'hover:bg-primary', 'hover:text-white'));
                
                btn.classList.remove('text-primary', 'hover:bg-primary', 'hover:text-white');
                btn.classList.add('active', 'bg-primary', 'text-white');
                
                // Apply filter
                const filter = btn.dataset.filter;
                this.filterGallery(filter);
            });
        });
    }
    
    filterGallery(filter) {
        this.currentFilter = filter;
        
        this.galleryItems.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px) scale(0.9)';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px) scale(0.9)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    setupZoomModal() {
        const modal = document.getElementById('zoom-modal');
        const closeBtn = document.getElementById('close-zoom');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeZoomModal();
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeZoomModal();
                }
            });
        }
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                this.closeZoomModal();
            }
        });
    }
    
    openZoomModal(item) {
        const modal = document.getElementById('zoom-modal');
        const zoomContent = document.getElementById('zoom-content');
        const zoomTitle = document.getElementById('zoom-title');
        const zoomDescription = document.getElementById('zoom-description');
        
        if (!modal || !zoomContent) return;
        
        // Get item data
        const title = item.dataset.title || 'Image';
        const description = item.dataset.description || '';
        const itemContent = item.querySelector('div');
        
        // Clone the content for zoom view
        const clonedContent = itemContent.cloneNode(true);
        clonedContent.className = 'w-[80vw] h-[70vh] max-w-4xl rounded-xl overflow-hidden shadow-2xl transform scale-110';
        
        // Remove hover effects from cloned content
        const hoverOverlay = clonedContent.querySelector('.absolute');
        if (hoverOverlay) {
            hoverOverlay.remove();
        }
        
        // Update modal content
        zoomContent.innerHTML = '';
        zoomContent.appendChild(clonedContent);
        zoomTitle.textContent = title;
        zoomDescription.textContent = description;
        
        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            clonedContent.style.transform = 'scale(1)';
        }, 10);
    }
    
    closeZoomModal() {
        const modal = document.getElementById('zoom-modal');
        const zoomContent = document.getElementById('zoom-content');
        
        if (!modal) return;
        
        // Animate out
        modal.style.opacity = '0';
        if (zoomContent.firstChild) {
            zoomContent.firstChild.style.transform = 'scale(0.9)';
        }
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            
            // Restore body scroll
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Public methods for external use
    addGalleryItem(data) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        const itemHTML = `
            <div class="gallery-item cursor-pointer group" data-category="${data.category}" data-title="${data.title}" data-description="${data.description}">
                <div class="aspect-square ${data.gradient} rounded-lg overflow-hidden shadow-lg">
                    <div class="w-full h-full flex items-center justify-center text-white relative">
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <i class="fas fa-search-plus text-2xl"></i>
                        </div>
                        <div class="text-center">
                            <i class="${data.icon} text-4xl mb-2"></i>
                            <p class="text-sm">${data.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        galleryGrid.insertAdjacentHTML('beforeend', itemHTML);
        this.setupGalleryItems(); // Reinitialize
    }
    
    getVisibleItems() {
        return this.galleryItems.filter(item => item.style.display !== 'none');
    }
    
    getCurrentFilter() {
        return this.currentFilter;
    }
}

// Initialize gallery page component when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on gallery page
    if (document.querySelector('.gallery-grid')) {
        window.galleryPageComponent = new GalleryPageComponent();
    }
});

// Export for use in other modules
window.GalleryPageComponent = GalleryPageComponent;
