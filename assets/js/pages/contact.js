// Contact page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initContactForm();
});

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', function() {
            const isOpen = !answer.classList.contains('hidden');
            
            if (isOpen) {
                // Close this FAQ
                answer.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            } else {
                // Close all other FAQs first
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    otherAnswer.classList.add('hidden');
                    otherIcon.style.transform = 'rotate(0deg)';
                });
                
                // Open this FAQ
                answer.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('form-error')) {
                validateField(this);
            }
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'message'];
        requiredFields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (!validateField(input)) {
                isValid = false;
            }
        });

        // Validate privacy checkbox
        const privacyCheckbox = form.querySelector('[name="privacy"]');
        if (!privacyCheckbox.checked) {
            showFieldError(privacyCheckbox, 'You must agree to the Privacy Policy and Terms of Service');
            isValid = false;
        }

        if (!isValid) {
            showNotification('Please correct the errors below', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner mr-2"></span>Sending Message...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(function() {
            // Reset form
            form.reset();
            removeAllValidationClasses();
            
            // Show success message
            showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Optional: Scroll to top or show confirmation section
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    });

    function validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let isValid = true;

        // Remove previous error state
        field.classList.remove('form-error', 'border-red-500');
        removeFieldError(field);

        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value || value.length < 2) {
                    showFieldError(field, 'This field must be at least 2 characters long');
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    showFieldError(field, 'Email address is required');
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
                break;
                
            case 'phone':
                if (value) {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
                    if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
                        showFieldError(field, 'Please enter a valid phone number');
                        isValid = false;
                    }
                }
                break;
                
            case 'message':
                if (!value) {
                    showFieldError(field, 'Message is required');
                    isValid = false;
                } else if (value.length < 10) {
                    showFieldError(field, 'Message must be at least 10 characters long');
                    isValid = false;
                }
                break;
        }

        if (isValid) {
            field.classList.add('border-green-500');
            field.classList.remove('border-gray-300');
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('form-error', 'border-red-500');
        field.classList.remove('border-gray-300', 'border-green-500');
        
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-red-500 text-sm mt-1';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function removeAllValidationClasses() {
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.classList.remove('form-error', 'border-red-500', 'border-green-500');
            field.classList.add('border-gray-300');
            removeFieldError(field);
        });
    }

    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}
