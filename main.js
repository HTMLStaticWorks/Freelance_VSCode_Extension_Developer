/* ==========================================================================
   VSCode Dev Portfolio - Main Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Initialize Systems
    initTheme();
    initNavigation();
    initCounters();
    initBackToTop();
});

/* --- Navigation System --- */
function initNavigation() {
    window.navigateTo = (sectionId) => {
        const sections = document.querySelectorAll('.page-section');
        const targetSection = document.getElementById(sectionId);
        
        if (!targetSection) return;

        // Current active section
        const currentSection = document.querySelector('.page-section.active');
        if (currentSection) {
            currentSection.classList.remove('active');
            currentSection.style.display = 'none';
            currentSection.style.opacity = '1'; // Reset for consistency
            currentSection.style.transform = 'none';
        }
        
        // Show new section immediately
        targetSection.style.display = 'block';
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'none';
        targetSection.classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'auto' });
        
        // Update Nav Links
        updateNavLinks(sectionId);

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    };

    function updateNavLinks(activeId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('onclick')?.includes(activeId)) {
                link.classList.add('text-accent-cyan');
                link.classList.remove('text-gray-300');
            } else {
                link.classList.remove('text-accent-cyan');
                link.classList.add('text-gray-300');
            }
        });
    }
}

/* --- Theme Management --- */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
    }
    updateThemeUI();
}

function updateThemeUI() {
    const isLight = document.documentElement.classList.contains('light-mode');
    const icons = document.querySelectorAll('#dark-icon');
    
    icons.forEach(icon => {
        icon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
    });
    
    // Refresh Lucide icons for the new theme
    lucide.createIcons();
}

/* --- Theme & RTL Toggles --- */
window.toggleDarkMode = () => {
    document.documentElement.classList.toggle('light-mode');
    const isLight = document.documentElement.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeUI();
};

window.toggleRTL = () => {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    document.documentElement.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
};

window.toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
};

/* --- 3D Card Tilt Effect (Removed) --- */
window.tiltCard = () => {};
window.resetTilt = () => {};

/* --- Counters --- */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.innerText = counter.getAttribute('data-target');
    });
}

/* --- Back to Top System --- */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('opacity-0', 'translate-y-10');
            backToTopBtn.classList.add('opacity-100', 'translate-y-0');
        } else {
            backToTopBtn.classList.add('opacity-0', 'translate-y-10');
            backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --- Typing Effect (Removed) --- */
function initTypingEffect() {}

/* --- GSAP Animations (Removed) --- */
function initAnimations() {}

/* --- Dashboard Interactivity (Simplified) --- */
function initDashboard() {
    // Dashboard is now static, no animation needed
}

// Ensure navigateTo is globally accessible if it was initialized in DOMContentLoaded
// (Actually it already is assigned to window.navigateTo inside initNavigation)

