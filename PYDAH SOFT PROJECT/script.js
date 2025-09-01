// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('themeToggle');
const colorButtons = document.querySelectorAll('.color-btn');
const video = document.getElementById('showcase-video');
const playPauseBtn = document.getElementById('playPauseBtn');
const downloadBtn = document.getElementById('downloadBtn');
const contactForm = document.getElementById('contactForm');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';
let currentColor = localStorage.getItem('color') || 'green';

// Initialize theme
function initializeTheme() {
    // Set the theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
    // Set the color while preserving the theme
    document.body.className = `${currentColor}-color`;
    // Update toggle button icon
    const themeIcon = currentTheme === 'dark' ? 'fa-sun' : 'fa-moon';
    themeToggle.innerHTML = `<i class="fas ${themeIcon}"></i>`;
    
    // Log for debugging
    console.log('Theme initialized:', { currentTheme, currentColor });
}

// Call initialize on page load
document.addEventListener('DOMContentLoaded', initializeTheme);
// Also call it immediately in case the script loads after DOMContentLoaded
initializeTheme();

// Hamburger Menu Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(8px, 8px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : '';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.style = '');
    }
});

// Close menu when clicking on a navigation link and implement smooth scrolling
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Close the mobile menu
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.style = '');
        
        // Implement smooth scrolling for navigation links
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get the header height to offset the scroll position
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    // Toggle theme
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme in DOM and localStorage
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Update button icon
    const themeIcon = currentTheme === 'dark' ? 'fa-sun' : 'fa-moon';
    themeToggle.innerHTML = `<i class="fas ${themeIcon}"></i>`;
    
    // Log for debugging
    console.log('Theme toggled:', { currentTheme, currentColor });
});

// Color Theme Switcher
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const color = button.dataset.color;
        document.body.className = `${color}-color`;
        localStorage.setItem('color', color);
    });
});

// Solution Cards Interaction
document.querySelectorAll('.solution-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('i');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
    });

    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('i');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}-error`);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    document.getElementById(inputId).classList.add('error');
}

function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}-error`);
    errorElement.style.display = 'none';
    document.getElementById(inputId).classList.remove('error');
}

function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'flex';
    successMessage.style.opacity = '0';
    setTimeout(() => {
        successMessage.style.opacity = '1';
    }, 10);
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Clear previous errors
    ['name', 'email', 'message'].forEach(clearError);
    
    // Validation
    let hasError = false;
    
    if (name.length < 2) {
        showError('name', 'Please enter a valid name (at least 2 characters)');
        hasError = true;
    }
    
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        hasError = true;
    }
    
    if (message.length < 10) {
        showError('message', 'Please enter a message (at least 10 characters)');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Show loading state
    submitBtn.classList.add('loading');
    
    // Simulate form submission with delay
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        submitBtn.classList.remove('loading');
        contactForm.reset();
        showSuccessMessage();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            const successMessage = document.getElementById('success-message');
            successMessage.style.opacity = '0';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 300);
        }, 5000);
        
    } catch (error) {
        submitBtn.classList.remove('loading');
        alert('An error occurred. Please try again.');
    }
});

// Real-time validation
const inputs = contactForm.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        clearError(input.id);
    });
    
    input.addEventListener('blur', () => {
        if (input.id === 'name' && input.value.trim().length < 2) {
            showError('name', 'Please enter a valid name (at least 2 characters)');
        } else if (input.id === 'email' && !validateEmail(input.value.trim())) {
            showError('email', 'Please enter a valid email address');
        } else if (input.id === 'message' && input.value.trim().length < 10) {
            showError('message', 'Please enter a message (at least 10 characters)');
        }
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navLinks.classList.remove('active');
    }
});

// Initialize theme toggle icon
themeToggle.innerHTML = themeSettings.theme === 'dark' ? 
    '<i class="fas fa-sun"></i>' : 
    '<i class="fas fa-moon"></i>';

// Scroll Animation
const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.visibility = 'visible';
        }
    });
};

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.animate').forEach(element => {
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    observer.observe(element);
});
