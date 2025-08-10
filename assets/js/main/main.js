// Updated Main JavaScript for the restructured project
class PortfolioMain {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupComponents());
        } else {
            this.setupComponents();
        }
    }
    
    setupComponents() {
        // Initialize Navigation Component
        if (window.NavigationComponent) {
            this.components.navigation = new NavigationComponent('header');
        }
        
        // Initialize Projects Scroll Component (for home page)
        if (window.ProjectsScrollComponent) {
            this.components.projectsScroll = new ProjectsScrollComponent();
        }
        
        // Page-specific component initialization
        this.initializePageComponents();
        
        // Global features
        this.setupScrollAnimations();
        this.setupLazyLoading();
        this.setupSmoothScrolling();
    }
    
    initializePageComponents() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'index':
                this.initHomePage();
                break;
            case 'about':
                this.initAboutPage();
                break;
            case 'projects':
                this.initProjectsPage();
                break;
            case 'gallery':
                this.initGalleryPage();
                break;
            case 'contact':
                this.initContactPage();
                break;
        }
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename === '' || filename === 'index.html') {
            return 'index';
        }
        
        return filename.replace('.html', '');
    }
    
    initHomePage() {
        // Hero section animations
        this.animateHeroSection();
        
        // Statistics counter animation
        this.animateCounters();
        
        // Featured projects carousel
        this.setupFeaturedProjects();
        
        // Client testimonials slider
        this.setupTestimonials();
        
        // Gallery stack view
        this.setupGalleryStack();
    }
    
    initAboutPage() {
        // Team member cards animations
        this.animateTeamCards();
        
        // Statistics animation
        this.animateCounters();
        
        // Timeline animations
        this.animateTimeline();
        
        // Skills progress bars
        this.animateSkillBars();
    }
    
    initProjectsPage() {
        // Initialize Projects Filter Component
        if (window.ProjectsFilterComponent) {
            this.components.projectsFilter = new ProjectsFilterComponent('.projects-grid');
        }
    }
    
    initGalleryPage() {
        // Initialize Gallery Component
        if (window.GalleryComponent) {
            this.components.gallery = new GalleryComponent('.gallery-grid', {
                lightbox: true,
                filterButtons: true
            });
        }
    }
    
    initContactPage() {
        // Initialize Form Component
        if (window.FormComponent) {
            this.components.contactForm = new FormComponent('#contact-form');
        }
        
        // Initialize map if available
        this.initializeMap();
        
        // FAQ accordion
        this.setupFAQ();
    }
    
    animateHeroSection() {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;
        
        const title = hero.querySelector('.hero-title');
        const subtitle = hero.querySelector('.hero-subtitle');
        const cta = hero.querySelector('.hero-cta');
        
        // Animate elements with staggered delays
        if (title) {
            setTimeout(() => {
                title.classList.add('animate-fade-in-up');
            }, 200);
        }
        
        if (subtitle) {
            setTimeout(() => {
                subtitle.classList.add('animate-fade-in-up');
            }, 400);
        }
        
        if (cta) {
            setTimeout(() => {
                cta.classList.add('animate-fade-in-up');
            }, 600);
        }
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        // Use Intersection Observer for animation trigger
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    setupFeaturedProjects() {
        const projectsContainer = document.querySelector('.featured-projects');
        if (!projectsContainer) return;
        
        const projects = projectsContainer.querySelectorAll('.project-card');
        let currentProject = 0;
        
        const showProject = (index) => {
            projects.forEach((project, i) => {
                if (i === index) {
                    project.classList.add('active');
                } else {
                    project.classList.remove('active');
                }
            });
        };
        
        // Auto-rotate projects
        setInterval(() => {
            currentProject = (currentProject + 1) % projects.length;
            showProject(currentProject);
        }, 5000);
        
        // Initial show
        if (projects.length > 0) {
            showProject(0);
        }
    }
    
    setupTestimonials() {
        const testimonialsContainer = document.querySelector('.testimonials-slider');
        if (!testimonialsContainer) return;
        
        const testimonials = testimonialsContainer.querySelectorAll('.testimonial');
        const dots = testimonialsContainer.querySelectorAll('.slider-dot');
        let currentTestimonial = 0;
        
        const showTestimonial = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                showTestimonial(index);
            });
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 6000);
        
        // Initial show
        if (testimonials.length > 0) {
            showTestimonial(0);
        }
    }
    
    animateTeamCards() {
        const teamCards = document.querySelectorAll('.team-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-fade-in-up');
                    }, index * 100);
                }
            });
        });
        
        teamCards.forEach(card => observer.observe(card));
    }
    
    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-in');
                }
            });
        });
        
        timelineItems.forEach(item => observer.observe(item));
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const percentage = entry.target.dataset.percentage;
                    entry.target.style.width = percentage + '%';
                    entry.target.classList.add('animated');
                }
            });
        });
        
        skillBars.forEach(bar => observer.observe(bar));
    }
    
    initializeMap() {
        const mapContainer = document.querySelector('#contact-map');
        if (!mapContainer) return;
        
        // Simple placeholder map (replace with actual map integration)
        mapContainer.innerHTML = `
            <div class="map-placeholder bg-gray-200 h-full flex items-center justify-center text-gray-500">
                <div class="text-center">
                    <i class="fas fa-map-marker-alt text-4xl mb-2"></i>
                    <p>Interactive Map</p>
                    <p class="text-sm">123 Business Street, City, State 12345</p>
                </div>
            </div>
        `;
    }
    
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');
            
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Close all FAQ items
                faqItems.forEach(faq => {
                    faq.classList.remove('open');
                    faq.querySelector('.faq-answer').style.maxHeight = '0';
                    faq.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                });
                
                // Toggle current item
                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }
    
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.dataset.animate;
                    entry.target.classList.add(`animate-${animation}`);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(el => observer.observe(el));
    }
    
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupGalleryStack() {
        const galleryStack = document.querySelector('#gallery-stack');
        if (!galleryStack) return;
        
        const slides = galleryStack.querySelectorAll('.gallery-slide');
        const prevBtn = document.querySelector('#gallery-prev');
        const nextBtn = document.querySelector('#gallery-next');
        const indicators = document.querySelectorAll('.gallery-indicator');
        
        let currentSlide = 0;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.opacity = i === index ? '1' : '0';
                slide.style.transform = i === index ? 'translateX(0)' : 'translateX(20px)';
            });
            
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active-indicator', i === index);
            });
        };
        
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };
        
        const prevSlide = () => {
            currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
        };
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Auto-slide every 5 seconds
        setInterval(nextSlide, 5000);
        
        // Initialize
        showSlide(0);
    }
    
    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize the portfolio when DOM is ready
new PortfolioMain();
