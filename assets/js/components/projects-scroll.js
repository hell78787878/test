// Projects Scroll Animation Component
class ProjectsScrollComponent {
    constructor() {
        this.container = document.getElementById('projects-container');
        this.projectCards = document.querySelectorAll('.project-card');
        this.indicators = document.querySelectorAll('.indicator-dot');
        this.projectsSection = document.getElementById('projects');
        
        this.currentProject = 0;
        this.totalProjects = this.projectCards.length;
        this.isScrolling = false;
        this.scrollThreshold = 100; // Minimum scroll distance to trigger change
        this.lastScrollY = 0;
        
        this.init();
    }
    
    init() {
        if (!this.container || this.projectCards.length === 0) return;
        
        this.setupScrollListener();
        this.setupIndicatorClicks();
        this.updateActiveProject(0);
    }
    
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        if (!this.projectsSection) return;
        
        const sectionRect = this.projectsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const currentScrollY = window.scrollY;
        
        // Check if we're in the projects section
        if (sectionRect.top <= 200 && sectionRect.bottom >= windowHeight * 0.5) {
            // Calculate scroll progress within the section
            const sectionHeight = this.projectsSection.offsetHeight;
            const scrollProgress = Math.max(0, Math.min(1, 
                (currentScrollY - this.projectsSection.offsetTop + 200) / (sectionHeight - windowHeight)
            ));
            
            // Determine which project should be active based on scroll progress
            const targetProject = Math.min(
                Math.floor(scrollProgress * (this.totalProjects + 0.5)), 
                this.totalProjects - 1
            );
            
            // Only update if we've scrolled enough and the project has changed
            if (Math.abs(currentScrollY - this.lastScrollY) > this.scrollThreshold || 
                targetProject !== this.currentProject) {
                
                if (!this.isScrolling) {
                    this.isScrolling = true;
                    this.updateActiveProject(targetProject);
                    
                    // Debounce the scrolling flag
                    setTimeout(() => {
                        this.isScrolling = false;
                    }, 300);
                }
            }
            
            this.lastScrollY = currentScrollY;
        }
    }
    
    updateActiveProject(projectIndex) {
        if (projectIndex < 0 || projectIndex >= this.totalProjects) return;
        
        // Update cards
        this.projectCards.forEach((card, index) => {
            card.classList.remove('active', 'prev');
            
            if (index === projectIndex) {
                card.classList.add('active');
            } else if (index < projectIndex) {
                card.classList.add('prev');
            }
        });
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === projectIndex);
        });
        
        this.currentProject = projectIndex;
        
        // Add a subtle animation effect
        this.animateProjectTransition();
    }
    
    animateProjectTransition() {
        const activeCard = this.projectCards[this.currentProject];
        if (activeCard) {
            // Add a subtle bounce effect
            activeCard.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                activeCard.style.transform = 'translateY(0)';
            }, 200);
        }
    }
    
    setupIndicatorClicks() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                // Calculate target scroll position for this project
                const sectionTop = this.projectsSection.offsetTop;
                const sectionHeight = this.projectsSection.offsetHeight;
                const targetScrollY = sectionTop + (sectionHeight * (index / this.totalProjects)) - 200;
                
                // Smooth scroll to target position
                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth'
                });
                
                // Update immediately for better UX
                setTimeout(() => {
                    this.updateActiveProject(index);
                }, 100);
            });
        });
    }
    
    // Public method to go to specific project
    goToProject(index) {
        if (index >= 0 && index < this.totalProjects) {
            this.updateActiveProject(index);
        }
    }
    
    // Public method to go to next project
    nextProject() {
        const nextIndex = (this.currentProject + 1) % this.totalProjects;
        this.goToProject(nextIndex);
    }
    
    // Public method to go to previous project
    prevProject() {
        const prevIndex = this.currentProject === 0 ? this.totalProjects - 1 : this.currentProject - 1;
        this.goToProject(prevIndex);
    }
}

// Export for use in other modules
window.ProjectsScrollComponent = ProjectsScrollComponent;
