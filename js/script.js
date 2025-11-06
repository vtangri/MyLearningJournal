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
            <div class="nav-actions">
                <div class="location-display" id="locationDisplay" style="display: none;">
                    <span class="location-icon" id="locationIcon" title="Click to view map">📍</span>
                    <div class="location-info">
                        <span class="location-city" id="locationCity">Loading...</span>
                        <span class="location-address" id="locationAddress"></span>
                    </div>
                </div>
                <button class="theme-toggle" id="themeToggle">
                    <span class="theme-icon">🌙</span>
                </button>
            </div>
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

// Load saved theme immediately (before DOM ready) to prevent flash
const loadTheme = () => {
    // Try to use StorageAPI if available, otherwise fallback to localStorage
    let savedTheme = 'dark';
    if (window.StorageAPI) {
        savedTheme = window.StorageAPI.getTheme();
    } else {
        // Fallback for when StorageAPI hasn't loaded yet
        try {
            savedTheme = localStorage.getItem('theme') || 'dark';
        } catch (e) {
            savedTheme = 'dark';
        }
    }
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
    }
};

// Load theme immediately
loadTheme();

// Also load theme after StorageAPI is available
if (window.StorageAPI) {
    loadTheme();
} else {
    // Wait for StorageAPI to load
    const checkStorageAPI = setInterval(() => {
        if (window.StorageAPI) {
            loadTheme();
            clearInterval(checkStorageAPI);
        }
    }, 50);
    // Stop checking after 2 seconds
    setTimeout(() => clearInterval(checkStorageAPI), 2000);
}

const bindThemeToggle = () => {
    const themeToggle = getThemeToggleEl();
    const themeIcon = getThemeIconEl();
    if (!themeToggle || !themeIcon) return;

    // Initialize icon on load
    const updateIcon = () => {
        themeIcon.textContent = body.classList.contains('light-mode') ? '☀️' : '🌙';
    };
    updateIcon();

    // Remove any existing listeners by cloning the element
    const newToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newToggle, themeToggle);
    const newIcon = document.querySelector('.theme-icon');

    newToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        
        // Save theme preference using StorageAPI if available, otherwise localStorage
        if (window.StorageAPI) {
            window.StorageAPI.saveTheme(isLight ? 'light' : 'dark');
        } else {
            try {
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            } catch (e) {
                console.error('Failed to save theme preference:', e);
            }
        }
        
        // Update icon
        if (newIcon) {
            newIcon.textContent = isLight ? '☀️' : '🌙';
        }
        
        // Animation
        newToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            newToggle.style.transform = 'rotate(0deg)';
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

// ===== JOURNAL FORM HANDLING (index.html) =====
const initJournalForm = () => {
    const form = document.getElementById('journal-form');
    if (!form) return;

    const titleInput = document.getElementById('entry-title');
    const contentInput = document.getElementById('entry-content');
    const dateInput = document.getElementById('entry-date');
    const saveBtn = document.getElementById('save-entry');
    const copyBtn = document.getElementById('copy-entry');
    const charCount = document.getElementById('char-count');
    const feedback = document.getElementById('form-feedback');
    const entriesList = document.getElementById('entries-list');
    const noEntries = document.getElementById('no-entries');

    // Set default date to today
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Character counter
    if (contentInput && charCount) {
        contentInput.addEventListener('input', () => {
            charCount.textContent = contentInput.value.length;
        });
    }

    // Setup form validation
    if (window.ValidationAPI) {
        window.ValidationAPI.setupFormValidation(form);
    }

    // Theme is already loaded by the main theme toggle handler above
    // This section is for journal form specific functionality only

    // Render saved entries
    const renderEntries = async () => {
        if (!entriesList) return;

        if (!window.StorageAPI) {
            console.error('StorageAPI not available');
            return;
        }

        try {
            const entries = await window.StorageAPI.getEntries();
            
            if (entries.length === 0) {
                if (noEntries) noEntries.style.display = 'block';
                entriesList.innerHTML = '';
                return;
            }

            if (noEntries) noEntries.style.display = 'none';

            entriesList.innerHTML = entries.map(entry => `
                <article class="journal-card" data-entry-id="${entry.id}">
                    <div class="journal-badge">
                        <span class="badge-week">Entry</span>
                        <span class="badge-date">${new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <h2 class="journal-title">${entry.title}</h2>
                    <p class="journal-excerpt">${entry.content}</p>
                    <div class="journal-meta">
                        <span class="meta-item">📝 Saved</span>
                        <button class="copy-entry-btn" data-entry-id="${entry.id}">Copy</button>
                        <button class="delete-entry-btn" data-entry-id="${entry.id}">Delete</button>
                    </div>
                </article>
            `).join('');

            // Bind copy and delete buttons
            entriesList.querySelectorAll('.copy-entry-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const entryId = e.target.dataset.entryId;
                    const entry = entries.find(e => e.id == entryId);
                    if (entry && window.ClipboardAPI) {
                        await window.ClipboardAPI.copyEntry(entry);
                    }
                });
            });

            entriesList.querySelectorAll('.delete-entry-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const entryId = e.target.dataset.entryId;
                    if (window.StorageAPI) {
                        await window.StorageAPI.deleteEntry(entryId);
                        renderEntries();
                    }
                });
            });
        } catch (error) {
            console.error('Error rendering entries:', error);
        }
    };

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!window.ValidationAPI || !window.StorageAPI) {
            console.error('Required APIs not available');
            return;
        }

        // Validate form
        if (!window.ValidationAPI.validateForm(form)) {
            window.ValidationAPI.showModal('Validation Error', 'Please fill in all required fields correctly.', 'error');
            return;
        }

        // Get form data
        const entry = {
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            date: dateInput.value || new Date().toISOString().split('T')[0],
            id: Date.now(),
            timestamp: Date.now()
        };

        // Show loading state
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
        }

        try {
            // Save entry
            await window.StorageAPI.saveEntry(entry);

            // Show success feedback
            if (feedback) {
                feedback.textContent = 'Entry saved successfully!';
                feedback.className = 'feedback success';
                setTimeout(() => {
                    feedback.textContent = '';
                    feedback.className = 'feedback';
                }, 3000);
            }

            // Show success modal
            window.ValidationAPI.showModal('Success!', 'Your journal entry has been saved successfully!', 'success');

            // Show notification
            if (window.NotificationsAPI) {
                await window.NotificationsAPI.notifyEntrySaved(entry);
            }

            // Show copy button
            if (copyBtn) {
                copyBtn.style.display = 'inline-block';
                copyBtn.onclick = async () => {
                    if (window.ClipboardAPI) {
                        await window.ClipboardAPI.copyEntry(entry);
                    }
                };
            }

            // Reset form
            form.reset();
            if (charCount) charCount.textContent = '0';
            if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

            // Re-render entries
            await renderEntries();
        } catch (error) {
            console.error('Error saving entry:', error);
            if (feedback) {
                feedback.textContent = 'Error saving entry. Please try again.';
                feedback.className = 'feedback error';
            }
            window.ValidationAPI.showModal('Error', 'Failed to save entry. Please try again.', 'error');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Entry';
            }
        }
    });

    // Modal close handler
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    if (modal && modalClose) {
        modalClose.addEventListener('click', () => {
            if (window.ValidationAPI) {
                window.ValidationAPI.hideModal();
            }
        });

        const modalOverlay = modal.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                if (window.ValidationAPI) {
                    window.ValidationAPI.hideModal();
                }
            });
        }
    }

    // Initialize
    renderEntries();
};

// Initialize journal form when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJournalForm);
} else {
    initJournalForm();
}

// ===== INITIALIZE THIRD-PARTY APIS =====
const initThirdPartyAPIs = () => {
    // Initialize Maps API
    const mapContainer = document.getElementById('map-container');
    if (mapContainer && window.MapsAPI) {
        window.MapsAPI.displayLocation(mapContainer);
    }

    // Initialize Music API (old section)
    const musicWidget = document.getElementById('music-widget');
    if (musicWidget && window.MusicAPI) {
        window.MusicAPI.displayPlaylist(musicWidget);
    }

    // Initialize Twitter API
    const twitterFeed = document.getElementById('twitter-feed');
    const twitterSearchBtn = document.getElementById('twitter-search-btn');
    const twitterSearchInput = document.getElementById('twitter-search-input');
    
    if (twitterFeed && window.TwitterAPI) {
        // Load default tweets
        window.TwitterAPI.displayTweets(twitterFeed, 'webdev');
        
        // Search button handler
        if (twitterSearchBtn && twitterSearchInput) {
            twitterSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const keyword = twitterSearchInput.value.trim() || 'webdev';
                if (keyword) {
                    window.TwitterAPI.displayTweets(twitterFeed, keyword);
                }
            });
            
            // Enter key handler
            twitterSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const keyword = twitterSearchInput.value.trim() || 'webdev';
                    if (keyword) {
                        window.TwitterAPI.displayTweets(twitterFeed, keyword);
                    }
                }
            });
        }
    }

    // Initialize Spotify API (new section)
    const spotifyPlaylists = document.getElementById('spotify-playlists');
    if (spotifyPlaylists && window.MusicAPI) {
        window.MusicAPI.displayPlaylist(spotifyPlaylists);
    }
};

// Initialize third-party APIs when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThirdPartyAPIs);
} else {
    initThirdPartyAPIs();
}

// ===== NAVBAR LOCATION DISPLAY =====
const initNavbarLocation = () => {
    const locationDisplay = document.getElementById('locationDisplay');
    const locationIcon = document.getElementById('locationIcon');
    const locationCity = document.getElementById('locationCity');
    const locationAddress = document.getElementById('locationAddress');
    
    if (!locationDisplay || !locationIcon || !locationCity || !locationAddress) return;

    let currentLocation = null;
    let currentAddress = null;

    // Get location and reverse geocode
    const getLocationAndAddress = async () => {
        try {
            // Get current position
            if (!window.GeolocationAPI) {
                console.warn('GeolocationAPI not available');
                return;
            }

            const position = await window.GeolocationAPI.getPosition();
            currentLocation = {
                lat: position.latitude,
                lng: position.longitude
            };

            // Reverse geocode to get address (using OpenStreetMap Nominatim API - free)
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}&zoom=18&addressdetails=1`,
                    {
                        headers: {
                            'User-Agent': 'LearningJournalApp/1.0'
                        }
                    }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    const address = data.address || {};
                    
                    // Build address string
                    const city = address.city || address.town || address.village || address.county || '';
                    const state = address.state || '';
                    const country = address.country || '';
                    
                    currentAddress = {
                        city: city,
                        state: state,
                        country: country,
                        full: data.display_name || ''
                    };

                    // Update display
                    locationCity.textContent = city || 'Unknown Location';
                    locationAddress.textContent = state ? `${state}, ${country}` : country || '';
                    locationDisplay.style.display = 'flex';
                } else {
                    throw new Error('Reverse geocoding failed');
                }
            } catch (error) {
                console.error('Reverse geocoding error:', error);
                // Fallback: show coordinates
                locationCity.textContent = `${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`;
                locationAddress.textContent = 'Location';
                locationDisplay.style.display = 'flex';
            }
        } catch (error) {
            console.error('Location error:', error);
            // Hide location display on error
            locationDisplay.style.display = 'none';
        }
    };

    // Create map modal
    const createMapModal = () => {
        // Check if modal already exists
        if (document.getElementById('location-map-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'location-map-modal';
        modal.className = 'modal hidden';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'location-modal-title');
        
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content location-modal-content">
                <div class="modal-header">
                    <h3 id="location-modal-title">Your Location</h3>
                    <button class="modal-close-btn" id="location-modal-close" aria-label="Close">×</button>
                </div>
                <div class="location-modal-body">
                    <div id="location-map-container" class="location-map-container"></div>
                    <div class="location-details" id="locationDetails">
                        <p class="location-full-address" id="locationFullAddress"></p>
                        <p class="location-coordinates" id="locationCoordinates"></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Close handlers
        const closeBtn = document.getElementById('location-modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => {
            modal.classList.add('hidden');
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', closeModal);

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    };

    // Show map in modal
    const showMapModal = async () => {
        if (!currentLocation) {
            await getLocationAndAddress();
        }

        if (!currentLocation) {
            alert('Unable to get your location. Please check your browser permissions.');
            return;
        }

        const modal = document.getElementById('location-map-modal');
        if (!modal) {
            createMapModal();
            // Wait a bit for modal to be created
            setTimeout(() => showMapModal(), 100);
            return;
        }

        const mapContainer = document.getElementById('location-map-container');
        const fullAddress = document.getElementById('locationFullAddress');
        const coordinates = document.getElementById('locationCoordinates');

        if (mapContainer) {
            // Clear previous map
            mapContainer.innerHTML = '';

            // Show modal
            modal.classList.remove('hidden');

            // Update address details
            if (fullAddress && currentAddress) {
                fullAddress.textContent = currentAddress.full || 'Address not available';
            }
            if (coordinates) {
                coordinates.textContent = `Coordinates: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`;
            }

            // Initialize map using MapsAPI
            if (window.MapsAPI) {
                try {
                    await window.MapsAPI.initMap(mapContainer, currentLocation);
                } catch (error) {
                    console.error('Map initialization error:', error);
                    // Fallback: show coordinates
                    mapContainer.innerHTML = `
                        <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                            <p>Map unavailable. Coordinates:</p>
                            <p><strong>${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}</strong></p>
                        </div>
                    `;
                }
            } else {
                // Fallback if MapsAPI not available
                mapContainer.innerHTML = `
                    <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                        <p>Map unavailable. Coordinates:</p>
                        <p><strong>${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}</strong></p>
                    </div>
                `;
            }
        }
    };

    // Click handler for location icon
    locationIcon.addEventListener('click', showMapModal);
    locationDisplay.addEventListener('click', (e) => {
        if (e.target === locationDisplay || e.target === locationCity || e.target === locationAddress) {
            showMapModal();
        }
    });

    // Initialize location on load
    getLocationAndAddress();
};

// Initialize navbar location when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for navigation to be injected
        setTimeout(initNavbarLocation, 100);
    });
} else {
    setTimeout(initNavbarLocation, 100);
}