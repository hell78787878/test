// Navigation Component JavaScript
class NavigationComponent {
    constructor() {
        this.header = document.getElementById('header');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupActiveNavigation();
    }
    
    setupMobileMenu() {
        if (!this.mobileMenuBtn || !this.mobileMenu) return;
        
        const mobileMenuIcon = this.mobileMenuBtn.querySelector('i');
        
        this.mobileMenuBtn.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('hidden');
            
            // Toggle icon
            if (this.mobileMenu.classList.contains('hidden')) {
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            } else {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-times');
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = this.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenu.classList.add('hidden');
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenuBtn.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.mobileMenu.classList.add('hidden');
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            }
        });
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only handle anchor links for smooth scrolling
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    setupScrollEffects() {
        if (!this.header) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('header-scrolled');
            } else {
                this.header.classList.remove('header-scrolled');
            }
        });
    }
    
    setupActiveNavigation() {
        if (!this.sections.length) return;
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPos = window.scrollY + 100;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active', 'text-primary', 'font-semibold');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active', 'text-primary', 'font-semibold');
                }
            });
        });
    }
}

// Export for use in other modules
window.NavigationComponent = NavigationComponent;
