// Projects page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initProjectFilters();
    initProjectModal();
});

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

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
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.classList.add('animate-fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('animate-fade-in');
                }
            });
        });
    });
}

function initProjectModal() {
    // This would handle opening project details in a modal
    // For now, it's a placeholder for future functionality
    const detailButtons = document.querySelectorAll('.project-card button');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            // Future: Open project details modal
            console.log('Project details would open here');
        });
    });
}
