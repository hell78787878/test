// Projects Filter Component JavaScript
class ProjectsFilterComponent {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.options = {
            animationDuration: 300,
            showAll: true,
            defaultFilter: 'all',
            ...options
        };
        
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = this.options.defaultFilter;
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        this.setupProjects();
        this.setupFilters();
        this.setupSearch();
        this.applyFilter(this.currentFilter);
    }
    
    setupProjects() {
        this.projects = Array.from(this.container.querySelectorAll('.project-card'));
        this.filteredProjects = [...this.projects];
        
        // Add hover effects and interactions
        this.projects.forEach((project, index) => {
            // Add animation delay for staggered entrance
            project.style.animationDelay = `${index * 0.1}s`;
            
            // Setup project card interactions
            this.setupProjectCard(project);
        });
    }
    
    setupProjectCard(project) {
        const viewBtn = project.querySelector('.view-project');
        const githubBtn = project.querySelector('.github-link');
        const demoBtn = project.querySelector('.demo-link');
        
        // View project details
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProjectDetails(project);
            });
        }
        
        // External links
        if (githubBtn) {
            githubBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(githubBtn.href, '_blank');
            });
        }
        
        if (demoBtn) {
            demoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(demoBtn.href, '_blank');
            });
        }
        
        // Hover effects
        project.addEventListener('mouseenter', () => {
            this.animateProjectHover(project, true);
        });
        
        project.addEventListener('mouseleave', () => {
            this.animateProjectHover(project, false);
        });
    }
    
    setupFilters() {
        const filterContainer = document.querySelector('.project-filters');
        if (!filterContainer) return;
        
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Apply filter
                const filter = button.dataset.filter;
                this.applyFilter(filter);
            });
        });
    }
    
    setupSearch() {
        const searchInput = document.querySelector('#project-search');
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                this.searchProjects(e.target.value);
            }, 300);
        });
        
        // Clear search
        const clearBtn = document.querySelector('.search-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.searchProjects('');
            });
        }
    }
    
    applyFilter(filter) {
        this.currentFilter = filter;
        
        this.projects.forEach((project, index) => {
            const categories = project.dataset.category ? project.dataset.category.split(' ') : [];
            const technologies = project.dataset.technologies ? project.dataset.technologies.split(' ') : [];
            
            let shouldShow = false;
            
            if (filter === 'all') {
                shouldShow = true;
            } else {
                shouldShow = categories.includes(filter) || technologies.includes(filter);
            }
            
            if (shouldShow) {
                this.showProject(project, index);
            } else {
                this.hideProject(project);
            }
        });
        
        this.updateProjectCount();
    }
    
    searchProjects(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        this.projects.forEach((project, index) => {
            const title = project.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const description = project.querySelector('.project-description')?.textContent.toLowerCase() || '';
            const technologies = project.dataset.technologies?.toLowerCase() || '';
            
            const shouldShow = !term || 
                title.includes(term) || 
                description.includes(term) || 
                technologies.includes(term);
            
            if (shouldShow && (this.currentFilter === 'all' || this.matchesFilter(project))) {
                this.showProject(project, index);
            } else {
                this.hideProject(project);
            }
        });
        
        this.updateProjectCount();
    }
    
    matchesFilter(project) {
        const categories = project.dataset.category ? project.dataset.category.split(' ') : [];
        const technologies = project.dataset.technologies ? project.dataset.technologies.split(' ') : [];
        
        return categories.includes(this.currentFilter) || technologies.includes(this.currentFilter);
    }
    
    showProject(project, index = 0) {
        project.classList.remove('hidden', 'project-hidden');
        project.style.display = 'block';
        
        // Animate in with stagger
        setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'translateY(0) scale(1)';
        }, index * 50);
    }
    
    hideProject(project) {
        project.style.opacity = '0';
        project.style.transform = 'translateY(20px) scale(0.95)';
        
        setTimeout(() => {
            project.style.display = 'none';
            project.classList.add('hidden', 'project-hidden');
        }, this.options.animationDuration);
    }
    
    animateProjectHover(project, isHovering) {
        const image = project.querySelector('.project-image img');
        const overlay = project.querySelector('.project-overlay');
        const content = project.querySelector('.project-content');
        
        if (isHovering) {
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
            if (overlay) {
                overlay.style.opacity = '1';
            }
            if (content) {
                content.style.transform = 'translateY(-5px)';
            }
        } else {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            if (overlay) {
                overlay.style.opacity = '0';
            }
            if (content) {
                content.style.transform = 'translateY(0)';
            }
        }
    }
    
    showProjectDetails(project) {
        const modal = this.createProjectModal(project);
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Setup close events
        const closeBtn = modal.querySelector('.modal-close');
        const modalOverlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => this.closeProjectModal(modal));
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeProjectModal(modal);
            }
        });
        
        // Keyboard close
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeProjectModal(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
    }
    
    createProjectModal(project) {
        const title = project.querySelector('.project-title')?.textContent || '';
        const description = project.querySelector('.project-description')?.textContent || '';
        const image = project.querySelector('.project-image img');
        const technologies = project.dataset.technologies?.split(' ') || [];
        const githubLink = project.querySelector('.github-link')?.href || '';
        const demoLink = project.querySelector('.demo-link')?.href || '';
        
        const modal = document.createElement('div');
        modal.className = 'project-modal fixed inset-0 z-50 flex items-center justify-center p-4';
        
        modal.innerHTML = `
            <div class="modal-overlay absolute inset-0 bg-black bg-opacity-75"></div>
            <div class="modal-content bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-y-auto relative transform scale-95 opacity-0 transition-all duration-300">
                <button class="modal-close absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="modal-body">
                    ${image ? `
                        <div class="modal-image">
                            <img src="${image.src}" alt="${image.alt}" class="w-full h-64 object-cover">
                        </div>
                    ` : ''}
                    
                    <div class="p-6">
                        <h2 class="text-3xl font-bold mb-4">${title}</h2>
                        <p class="text-gray-600 mb-6">${description}</p>
                        
                        ${technologies.length > 0 ? `
                            <div class="mb-6">
                                <h3 class="text-lg font-semibold mb-3">Technologies Used</h3>
                                <div class="flex flex-wrap gap-2">
                                    ${technologies.map(tech => `
                                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${tech}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="flex space-x-4">
                            ${githubLink ? `
                                <a href="${githubLink}" target="_blank" class="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">
                                    <i class="fab fa-github"></i>
                                    <span>View Code</span>
                                </a>
                            ` : ''}
                            
                            ${demoLink ? `
                                <a href="${demoLink}" target="_blank" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                                    <i class="fas fa-external-link-alt"></i>
                                    <span>Live Demo</span>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    closeProjectModal(modal) {
        const content = modal.querySelector('.modal-content');
        content.style.transform = 'scale(0.95)';
        content.style.opacity = '0';
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    updateProjectCount() {
        const visibleProjects = this.projects.filter(project => 
            !project.classList.contains('project-hidden')
        );
        
        const countElement = document.querySelector('.project-count');
        if (countElement) {
            countElement.textContent = `${visibleProjects.length} project${visibleProjects.length !== 1 ? 's' : ''} found`;
        }
    }
    
    // Public methods
    addProject(projectData) {
        const projectHTML = `
            <div class="project-card" data-category="${projectData.category}" data-technologies="${projectData.technologies}">
                <div class="project-image relative overflow-hidden rounded-lg">
                    <img src="${projectData.image}" alt="${projectData.title}" class="w-full h-48 object-cover">
                    <div class="project-overlay absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 flex items-center justify-center">
                        <button class="view-project bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
                
                <div class="project-content p-4">
                    <h3 class="project-title text-xl font-semibold mb-2">${projectData.title}</h3>
                    <p class="project-description text-gray-600 mb-4">${projectData.description}</p>
                    
                    <div class="flex justify-between items-center">
                        ${projectData.githubLink ? `<a href="${projectData.githubLink}" class="github-link text-gray-600 hover:text-gray-900"><i class="fab fa-github"></i></a>` : ''}
                        ${projectData.demoLink ? `<a href="${projectData.demoLink}" class="demo-link text-blue-600 hover:text-blue-800"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        this.container.insertAdjacentHTML('beforeend', projectHTML);
        this.setupProjects(); // Reinitialize
    }
    
    removeProject(index) {
        if (this.projects[index]) {
            this.projects[index].remove();
            this.setupProjects(); // Reinitialize
        }
    }
    
    getFilteredProjects() {
        return this.projects.filter(project => 
            !project.classList.contains('project-hidden')
        );
    }
}

// Export for use in other modules
window.ProjectsFilterComponent = ProjectsFilterComponent;
