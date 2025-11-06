// ===== REUSABLE NAV INJECTION =====
const injectNavigation = () => {
    const navHost = document.getElementById('nav');
    if (!navHost) return;

    const navTemplate = `
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <span class="logo-icon">📚</span>
                <span class="logo-text">LearnJournal</span>
            </div>
            <ul class="nav-menu">
                <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="journal.html" class="nav-link">Journal</a></li>
                <li class="nav-item"><a href="projects.html" class="nav-link">Projects</a></li>
                <li class="nav-item"><a href="about.html" class="nav-link">About</a></li>
            </ul>
            <button class="theme-toggle" id="themeToggle">
                <span class="theme-icon">🌙</span>
            </button>
            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>`;

    navHost.innerHTML = navTemplate;
};

// Ensure nav is injected before we bind nav-related listeners
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavigation);
} else {
    injectNavigation();
}

// ===== THEME TOGGLE =====
const body = document.body;
const getThemeToggleEl = () => document.getElementById('themeToggle');
const getThemeIconEl = () => document.querySelector('.theme-icon');

// Load saved theme or default to dark mode
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.add('light-mode');
}

const bindThemeToggle = () => {
    const themeToggle = getThemeToggleEl();
    const themeIcon = getThemeIconEl();
    if (!themeToggle || !themeIcon) return;

    // Initialize icon on load
    themeIcon.textContent = body.classList.contains('light-mode') ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        themeIcon.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindThemeToggle);
} else {
    bindThemeToggle();
}

// ===== MOBILE NAVIGATION =====
const bindMobileNav = () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindMobileNav);
} else {
    bindMobileNav();
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.intro-card, .recent-card, .profile-card');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
};

// Initialize scroll animations when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbarScrollEffect = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 0) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', navbarScrollEffect);
} else {
    navbarScrollEffect();
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== CURSOR EFFECTS (Optional Enhancement) =====
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    cursor.style.cssText = `
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    // Show only on desktop
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 4 + 'px';
            cursor.style.top = e.clientY - 4 + 'px';
        });
        
        // Scale cursor on hover
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
};

// Initialize cursor effect
createCursorEffect();

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== ACTIVE NAV LINK =====
const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setActiveNavLink);
} else {
    setActiveNavLink();
}

// ===== LIVE DATE ON HOMEPAGE =====
const renderCurrentDate = () => {
    const dateEl = document.getElementById('currentDate');
    if (!dateEl) return;
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString(undefined, options);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCurrentDate);
} else {
    renderCurrentDate();
}

// ===== LIVE CLOCK WITH BOX TICKER =====
const startLiveClock = () => {
    const hEl = document.getElementById('clockHours');
    const mEl = document.getElementById('clockMinutes');
    const sEl = document.getElementById('clockSeconds');
    if (!hEl || !mEl || !sEl) return;

    const setTime = () => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const updateBox = (el, val) => {
            if (el.textContent !== val) {
                el.textContent = val;
                // subtle tick animation
                const parent = el.parentElement;
                if (parent) {
                    parent.style.transition = 'transform 120ms ease';
                    parent.style.transform = 'scale(0.97)';
                    setTimeout(() => {
                        parent.style.transform = 'scale(1)';
                    }, 120);
                }
            }
        };
        updateBox(hEl, hh);
        updateBox(mEl, mm);
        updateBox(sEl, ss);
    };

    // Align tick to the second
    setTime();
    const msToNextSecond = 1000 - (Date.now() % 1000);
    setTimeout(() => {
        setTime();
        setInterval(setTime, 1000);
    }, msToNextSecond);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLiveClock);
} else {
    startLiveClock();
}

// ===== STATS COUNTER ANIMATION =====
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.ceil(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const hasPlus = text.includes('+');
                
                stat.textContent = '0';
                animateCounter(stat, number);
                
                if (hasPlus) {
                    setTimeout(() => {
                        stat.textContent = number + '+';
                    }, 2000);
                }
            });
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

const profileStats = document.querySelector('.profile-stats');
if (profileStats) {
    statsObserver.observe(profileStats);
}

// ===== CONSOLE MESSAGE =====
console.log('%c🎨 Welcome to Learning Journal!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #8b5cf6; font-size: 14px;');

// ===== PROJECTS: COLLAPSIBLE DESCRIPTIONS =====
const bindProjectCollapsibles = () => {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;
    const COLLAPSED = 72; // px
    cards.forEach(card => {
        const desc = card.querySelector('.project-description');
        if (!desc) return;
        desc.style.overflow = 'hidden';
        desc.style.transition = 'max-height 240ms ease';
        desc.style.maxHeight = COLLAPSED + 'px';
        desc.style.cursor = 'pointer';
        desc.setAttribute('title', 'Click to expand/collapse');
        card.dataset.expanded = 'false';

        const title = card.querySelector('.project-title');
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'overlay-btn secondary';
        toggle.textContent = 'Expand ↓';
        toggle.style.marginTop = '8px';
        const footer = card.querySelector('.project-footer');
        if (footer) footer.parentElement.insertBefore(toggle, footer);
        else card.querySelector('.project-content')?.appendChild(toggle);

        const doToggle = () => {
            const expanded = card.dataset.expanded === 'true';
            if (expanded) {
                desc.style.maxHeight = COLLAPSED + 'px';
                card.dataset.expanded = 'false';
                toggle.textContent = 'Expand ↓';
            } else {
                desc.style.maxHeight = desc.scrollHeight + 'px';
                card.dataset.expanded = 'true';
                toggle.textContent = 'Collapse ↑';
            }
            toggle.style.transform = 'scale(0.97)';
            setTimeout(() => { toggle.style.transform = 'scale(1)'; }, 120);
        };

        if (title) title.style.cursor = 'pointer';
        title?.addEventListener('click', doToggle);
        desc.addEventListener('click', doToggle);
        toggle.addEventListener('click', doToggle);
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindProjectCollapsibles);
} else {
    bindProjectCollapsibles();
}