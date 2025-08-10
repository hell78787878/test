// Gallery page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilters();
    initGalleryLightbox();
});

function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'text-primary', 'bg-blue-50');
                btn.classList.add('text-gray-600');
            });
            
            this.classList.add('active', 'text-primary', 'bg-blue-50');
            this.classList.remove('text-gray-600');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.add('animate-fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate-fade-in');
                }
            });
        });
    });
}

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create enhanced lightbox overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 opacity-0 invisible transition-all duration-300';
    overlay.innerHTML = `
        <div class="gallery-content relative max-w-4xl max-h-full p-4">
            <button class="gallery-close absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors duration-300">&times;</button>
            <div class="gallery-image-container bg-white rounded-lg overflow-hidden shadow-2xl">
                <div class="gallery-image w-full h-96 md:h-[500px]"></div>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2 gallery-title"></h3>
                    <p class="text-gray-600 gallery-description"></p>
                    <div class="flex items-center justify-between mt-4">
                        <span class="text-sm text-gray-500 gallery-category"></span>
                        <div class="flex space-x-2">
                            <button class="gallery-prev bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">‹ Prev</button>
                            <button class="gallery-next bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">Next ›</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.gallery-close');
    const imageContainer = overlay.querySelector('.gallery-image');
    const titleElement = overlay.querySelector('.gallery-title');
    const descriptionElement = overlay.querySelector('.gallery-description');
    const categoryElement = overlay.querySelector('.gallery-category');
    const prevBtn = overlay.querySelector('.gallery-prev');
    const nextBtn = overlay.querySelector('.gallery-next');

    let currentIndex = 0;
    let visibleItems = [];

    // Gallery data
    const galleryData = [
        { title: "E-Commerce Platform", description: "Modern e-commerce solution with advanced features", category: "projects" },
        { title: "Team Meeting", description: "Strategic planning session with our development team", category: "team" },
        { title: "Modern Workspace", description: "Our contemporary office design promoting creativity", category: "office" },
        { title: "Company Event", description: "Annual company celebration and team building", category: "events" },
        { title: "Mobile App Design", description: "User interface design for mobile application", category: "projects" },
        { title: "Brainstorming Session", description: "Creative collaboration for new project ideas", category: "team" },
        { title: "Reception Area", description: "Welcoming entrance area with modern aesthetics", category: "office" },
        { title: "Product Launch", description: "Exciting launch event for our latest product", category: "events" },
        { title: "Web Application", description: "Custom web application development showcase", category: "projects" },
        { title: "Team Collaboration", description: "Cross-functional team working together", category: "team" },
        { title: "Conference Room", description: "Professional meeting space with latest technology", category: "office" },
        { title: "Team Building", description: "Fun activities to strengthen team bonds", category: "events" },
        { title: "Brand Identity", description: "Complete brand identity design project", category: "projects" },
        { title: "Code Review", description: "Developers reviewing code quality together", category: "team" },
        { title: "Break Area", description: "Relaxing space for team members to unwind", category: "office" },
        { title: "Annual Celebration", description: "Celebrating another successful year together", category: "events" }
    ];

    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    }

    function showLightbox(index) {
        updateVisibleItems();
        const item = visibleItems[index];
        const itemIndex = Array.from(galleryItems).indexOf(item);
        const data = galleryData[itemIndex];
        
        if (data) {
            // Copy the background gradient to the lightbox
            const computedStyle = window.getComputedStyle(item);
            imageContainer.style.background = computedStyle.background;
            
            titleElement.textContent = data.title;
            descriptionElement.textContent = data.description;
            categoryElement.textContent = data.category.charAt(0).toUpperCase() + data.category.slice(1);
            
            overlay.classList.add('opacity-100', 'visible');
            overlay.classList.remove('opacity-0', 'invisible');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        overlay.classList.add('opacity-0', 'invisible');
        overlay.classList.remove('opacity-100', 'visible');
        document.body.style.overflow = '';
    }

    function showNext() {
        updateVisibleItems();
        currentIndex = (currentIndex + 1) % visibleItems.length;
        showLightbox(currentIndex);
    }

    function showPrev() {
        updateVisibleItems();
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        showLightbox(currentIndex);
    }

    // Add click events to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            updateVisibleItems();
            currentIndex = visibleItems.indexOf(item);
            showLightbox(currentIndex);
        });
    });

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (overlay.classList.contains('opacity-100')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
                case 'ArrowLeft':
                    showPrev();
                    break;
            }
        }
    });
}
