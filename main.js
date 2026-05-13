/* ==========================================================================
   VSCode Dev Portfolio - Main Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Initialize Theme
    initTheme();
    
    // Initialize Code Mesh Animation
    initCodeMesh();
    
    // Initialize GSAP Animations
    initAnimations();
    
    // Initialize Navigation
    initNavigation();
    
    // Initialize Components
    initCounters();
    initTypingEffect();
});

/* --- Three.js Particles Background --- */
/* --- Floating Code Mesh Animation --- */
function initCodeMesh() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const fragments = ['const', '=>', '{}', '<div>', 'export', 'import', 'async', 'await', '[]', '()', 'let', 'return'];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.text = fragments[Math.floor(Math.random() * fragments.length)];
            this.size = Math.random() * 10 + 8;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
            ctx.font = `${this.size}px monospace`;
            ctx.fillText(this.text, this.x, this.y);
        }
    }

    function init() {
        particles = [];
        const count = Math.floor((width * height) / 15000);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, i) => {
            p.update();
            p.draw();

            // Connect lines
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    init();
    animate();
}

/* --- Navigation System --- */
function initNavigation() {
    window.navigateTo = (sectionId) => {
        const sections = document.querySelectorAll('.page-section');
        const targetSection = document.getElementById(sectionId);
        
        if (!targetSection) return;

        // Animate out current active section
        const currentSection = document.querySelector('.page-section.active');
        if (currentSection) {
            gsap.to(currentSection, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                onComplete: () => {
                    currentSection.classList.remove('active');
                    currentSection.style.display = 'none';
                    
                    // Animate in new section
                    targetSection.style.display = 'block';
                    gsap.fromTo(targetSection, 
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                    );
                    targetSection.classList.add('active');
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Update Nav Links
                    updateNavLinks(sectionId);
                }
            });
        } else {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            gsap.to(targetSection, { opacity: 1, y: 0, duration: 0.5 });
        }

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

/* --- 3D Card Tilt Effect --- */
window.tiltCard = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

window.resetTilt = (card) => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
};

/* --- Counters --- */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;
                
                const updateCount = () => {
                    const inc = target / speed;
                    if (count < target) {
                        count += inc;
                        counter.innerText = target % 1 === 0 ? Math.ceil(count) : count.toFixed(1);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

/* --- Typing Effect --- */
function initTypingEffect() {
    const element = document.getElementById('hero-typing');
    if (!element) return;

    const words = ["VSCode Extension", "Language Server", "Debugger Tool", "Developer Experience"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const displayText = isDeleting 
            ? currentWord.substring(0, charIndex--) 
            : currentWord.substring(0, charIndex++);

        element.innerText = displayText;

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length + 1) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* --- GSAP Animations --- */
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections
    gsap.utils.toArray('.glass').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
}

/* --- Dashboard Interactivity --- */
function initDashboard() {
    // Animate bars on enter
    const bars = document.querySelectorAll('#dashboard .flex-1.bg-accent-cyan\\/20');
    bars.forEach((bar, i) => {
        const height = bar.style.height;
        bar.style.height = '0';
        gsap.to(bar, {
            height: height,
            duration: 1,
            delay: i * 0.1,
            ease: 'elastic.out(1, 0.5)'
        });
    });

    // Simulate logs
    const logContainer = document.querySelector('#dashboard .space-y-4.font-mono');
    if (logContainer && !logContainer.dataset.simulating) {
        logContainer.dataset.simulating = "true";
        const logEntries = [
            { time: '[12:47:10]', text: 'Scanning for updates...', color: 'text-accent-cyan' },
            { time: '[12:47:25]', text: 'New issue detected: #424', color: 'text-accent-rose' },
            { time: '[12:48:05]', text: 'Auto-reply sent to #424', color: 'text-accent-emerald' },
            { time: '[12:49:15]', text: 'Telemetry sync complete', color: 'text-accent-violet' }
        ];

        let logIndex = 0;
        setInterval(() => {
            const entry = logEntries[logIndex];
            const div = document.createElement('div');
            div.className = 'flex gap-2 opacity-0 transform -translate-x-2';
            div.innerHTML = `<span class="${entry.color}">${entry.time}</span><span class="text-gray-400">${entry.text}</span>`;
            logContainer.insertBefore(div, logContainer.lastElementChild);
            
            gsap.to(div, { opacity: 1, x: 0, duration: 0.5 });
            
            if (logContainer.children.length > 8) {
                logContainer.removeChild(logContainer.firstChild);
            }
            
            logIndex = (logIndex + 1) % logEntries.length;
        }, 5000);
    }
}

// Update navigateTo to include dashboard init
const originalNavigateTo = window.navigateTo;
window.navigateTo = (sectionId) => {
    originalNavigateTo(sectionId);
    if (sectionId === 'dashboard') {
        setTimeout(initDashboard, 600);
    }
};
