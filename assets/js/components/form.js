// Form Component JavaScript
class FormComponent {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.setupValidation();
        this.setupSubmission();
        this.setupRealTimeValidation();
    }
    
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('form-error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    setupRealTimeValidation() {
        const emailInputs = this.form.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value) {
                    this.validateField(input);
                }
            });
        });
    }
    
    setupSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let isValid = true;
        let message = '';

        // Remove previous validation state
        this.clearFieldValidation(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = `${this.getFieldLabel(field)} is required`;
        }
        
        // Specific field validations
        if (value) {
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        message = 'Please enter a valid email address';
                    }
                    break;
                    
                case 'tel':
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
                    if (cleanPhone.length < 10 || !phoneRegex.test(cleanPhone)) {
                        isValid = false;
                        message = 'Please enter a valid phone number';
                    }
                    break;
            }
            
            // Text length validation
            if (field.tagName === 'TEXTAREA' && value.length < 10) {
                isValid = false;
                message = 'Message must be at least 10 characters long';
            }
            
            if ((name === 'firstName' || name === 'lastName') && value.length < 2) {
                isValid = false;
                message = 'This field must be at least 2 characters long';
            }
        }

        // Apply validation state
        if (isValid) {
            field.classList.add('form-success', 'border-green-500');
            field.classList.remove('form-error', 'border-red-500');
        } else {
            field.classList.add('form-error', 'border-red-500');
            field.classList.remove('form-success', 'border-green-500');
            this.showFieldError(field, message);
        }

        return isValid;
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Validate checkboxes
        const requiredCheckboxes = this.form.querySelectorAll('input[type="checkbox"][required]');
        requiredCheckboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                this.showFieldError(checkbox, 'This field is required');
                isValid = false;
            }
        });

        return isValid;
    }
    
    async handleSubmit() {
        if (!this.validateForm()) {
            this.showNotification('Please correct the errors below', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Simulate API call (replace with actual endpoint)
            await this.submitData(data);
            
            // Success handling
            this.form.reset();
            this.clearAllValidation();
            this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            
        } catch (error) {
            this.showNotification('There was an error sending your message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async submitData(data) {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data submitted:', data);
                resolve();
            }, 2000);
        });
    }
    
    setLoadingState(loading) {
        if (!this.submitBtn) return;
        
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<span class="spinner"></span>Sending Message...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = 'Send Message';
        }
    }
    
    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace(' *', '') : field.name;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message text-red-500 text-sm mt-1';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    clearFieldValidation(field) {
        field.classList.remove('form-error', 'form-success', 'border-red-500', 'border-green-500');
        field.classList.add('border-gray-300');
        this.clearFieldError(field);
    }
    
    clearAllValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.clearFieldValidation(field));
    }
    
    showNotification(message, type) {
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
                <button class="ml-4 text-white hover:text-gray-200 notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }
    
    removeNotification(notification) {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }
}

// Export for use in other modules
window.FormComponent = FormComponent;
