// Main JavaScript functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initGallery();
    initContactForm();
    initAnimations();
    initMobileMenu();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const header = document.getElementById('header');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Header scroll effect
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        // Toggle icon
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenuIcon.classList.remove('fa-times');
            mobileMenuIcon.classList.add('fa-bars');
        } else {
            mobileMenuIcon.classList.remove('fa-bars');
            mobileMenuIcon.classList.add('fa-times');
        }
    });

    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            mobileMenuIcon.classList.remove('fa-times');
            mobileMenuIcon.classList.add('fa-bars');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenuIcon.classList.remove('fa-times');
            mobileMenuIcon.classList.add('fa-bars');
        }
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe all sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });

    // Parallax effect for hero section (optional)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.getElementById('home');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Gallery functionality
function initGallery() {
    const galleryItems = document.querySelectorAll('#gallery .aspect-square');
    
    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
        <div class="gallery-content">
            <span class="gallery-close">&times;</span>
            <div class="gallery-image"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.gallery-close');
    const imageContainer = overlay.querySelector('.gallery-image');

    // Add click events to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Create a placeholder image element (in real implementation, you'd use actual images)
            const img = document.createElement('div');
            img.className = 'w-full h-96 md:h-[600px] rounded-lg';
            img.style.background = item.style.background || item.classList.toString().includes('red') ? 'linear-gradient(to bottom right, #f87171, #dc2626)' : 
                                 item.classList.toString().includes('blue') ? 'linear-gradient(to bottom right, #60a5fa, #2563eb)' :
                                 item.classList.toString().includes('green') ? 'linear-gradient(to bottom right, #4ade80, #16a34a)' :
                                 'linear-gradient(to bottom right, #fbbf24, #d97706)';
            
            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeLightbox();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Basic validation
        if (!validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(function() {
            // Reset form
            form.reset();
            removeValidationClasses();
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    function validateForm(data) {
        let isValid = true;
        
        // Remove previous validation classes
        removeValidationClasses();

        // Validate name
        if (!data.name || data.name.trim().length < 2) {
            showFieldError('name', 'Name must be at least 2 characters long');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate subject
        if (!data.subject || data.subject.trim().length < 3) {
            showFieldError('subject', 'Subject must be at least 3 characters long');
            isValid = false;
        }

        // Validate message
        if (!data.message || data.message.trim().length < 10) {
            showFieldError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        field.classList.add('form-error');
        
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function removeValidationClasses() {
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.classList.remove('form-error', 'form-success');
        });

        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Animation initialization
function initAnimations() {
    // Add animation classes to elements as they come into view
    const animatedElements = document.querySelectorAll('.hover-lift, .card-hover');
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                entry.target.classList.add('animate-fade-in');
            }
        });
    });

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Utility functions
function debounce(func, wait) {
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

function throttle(func, limit) {
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

// Performance optimized scroll listener
const optimizedScrollListener = throttle(function() {
    // Scroll-based animations and effects
    const scrollTop = window.pageYOffset;
    
    // Update scroll progress indicator (if needed)
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / docHeight) * 100;
    
    // You can add a progress bar here if desired
}, 16); // 60fps

window.addEventListener('scroll', optimizedScrollListener);

// Service Worker registration (for PWA features if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js'); // Uncomment if you add a service worker
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You can send errors to an analytics service here
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        // Pause animations or reduce activity
    } else {
        // Resume animations
    }
});
