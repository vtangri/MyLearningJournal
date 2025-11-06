// ===== WEEK PROGRESS TRACKER =====
const currentWeek = 14;
const totalWeeks = 14;
const progressFill = document.getElementById('progressFill');
const currentWeekDisplay = document.getElementById('currentWeek');

// Animate progress bar
const animateProgress = () => {
    const percentage = (currentWeek / totalWeeks) * 100;
    setTimeout(() => {
        progressFill.style.width = percentage + '%';
    }, 500);
};

animateProgress();

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('searchInput');
const journalCards = document.querySelectorAll('.journal-card');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    journalCards.forEach(card => {
        const title = card.querySelector('.journal-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.journal-excerpt').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag'))
            .map(tag => tag.textContent.toLowerCase())
            .join(' ');
        
        const matchesSearch = title.includes(searchTerm) || 
                            excerpt.includes(searchTerm) || 
                            tags.includes(searchTerm);
        
        if (matchesSearch) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
});

// ===== SORT FUNCTIONALITY =====
const sortFilter = document.getElementById('sortFilter');
const journalGrid = document.getElementById('journalGrid');

sortFilter.addEventListener('change', (e) => {
    const sortValue = e.target.value;
    const cardsArray = Array.from(journalCards);
    
    cardsArray.sort((a, b) => {
        const weekA = parseInt(a.querySelector('.badge-week').textContent.match(/\d+/)[0]);
        const weekB = parseInt(b.querySelector('.badge-week').textContent.match(/\d+/)[0]);
        
        if (sortValue === 'newest') {
            return weekB - weekA;
        } else {
            return weekA - weekB;
        }
    });
    
    // Clear and re-append sorted cards
    journalGrid.innerHTML = '';
    cardsArray.forEach(card => {
        journalGrid.appendChild(card);
    });
    
    // Re-animate cards
    cardsArray.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeIn 0.5s ease ${index * 0.05}s both`;
        }, 10);
    });
});

// ===== COLLAPSIBLE JOURNAL EXCERPTS =====
const COLLAPSED_MAX_HEIGHT = 88; // px ~ 4 lines depending on styles

const prepareExcerpt = (card) => {
    const excerpt = card.querySelector('.journal-excerpt');
    if (!excerpt) return;
    excerpt.style.overflow = 'hidden';
    excerpt.style.transition = 'max-height 240ms ease';
    excerpt.style.maxHeight = COLLAPSED_MAX_HEIGHT + 'px';
    excerpt.style.cursor = 'pointer';
    excerpt.setAttribute('title', 'Click to expand/collapse');
    card.dataset.expanded = 'false';
    excerpt.addEventListener('click', () => toggleCard(card));
};

document.querySelectorAll('.journal-card').forEach(prepareExcerpt);

const toggleCard = (card, btn) => {
    const excerpt = card.querySelector('.journal-excerpt');
    if (!excerpt) return;
    const expanded = card.dataset.expanded === 'true';
    if (expanded) {
        excerpt.style.maxHeight = COLLAPSED_MAX_HEIGHT + 'px';
        card.dataset.expanded = 'false';
        if (btn) btn.textContent = 'Read Full Entry →';
    } else {
        // set to full height smoothly
        excerpt.style.maxHeight = excerpt.scrollHeight + 'px';
        card.dataset.expanded = 'true';
        if (btn) btn.textContent = 'Collapse ↑';
    }
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    }
};

const readMoreBtns = document.querySelectorAll('.read-more-btn');

readMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.journal-card');
        toggleCard(card, btn);
    });
});

// ===== TAG FILTER (Optional Enhancement) =====
const tags = document.querySelectorAll('.tag');

tags.forEach(tag => {
    tag.addEventListener('click', () => {
        const tagText = tag.textContent.toLowerCase();
        searchInput.value = tagText;
        searchInput.dispatchEvent(new Event('input'));
        
        // Scroll to top of results
        journalGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    // Add hover cursor
    tag.style.cursor = 'pointer';
});

// ===== CARD ENTRANCE ANIMATION =====
const observeJournalCards = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    journalCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
};

observeJournalCards();

// ===== WEEKLY STATS (Optional) =====
const calculateStats = () => {
    const totalHours = Array.from(journalCards).reduce((total, card) => {
        const hoursText = card.querySelector('.meta-item')?.textContent;
        const hours = parseInt(hoursText?.match(/\d+/)?.[0] || 0);
        return total + hours;
    }, 0);
    
    console.log(`Total learning hours: ${totalHours}`);
};

calculateStats();

// ===== JOURNAL FORM: VALIDATION, STORAGE, RENDERING =====
const JOURNAL_STORAGE_KEY = 'journalEntries';

const getStoredEntries = () => {
    try {
        const raw = sessionStorage.getItem(JOURNAL_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
};

const setStoredEntries = (entries) => {
    sessionStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
};

const wordCount = (text) => {
    return (text || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
};

const createCardFromEntry = (entry) => {
    const article = document.createElement('article');
    article.className = 'journal-card';

    const dateLabel = new Date(entry.journalDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    article.innerHTML = `
        <div class="journal-badge">
            <span class="badge-week">Week ${entry.weekOfJournal}</span>
            <span class="badge-date">${dateLabel}</span>
        </div>
        <h2 class="journal-title">${entry.journalName}</h2>
        <div class="journal-tags">
            ${entry.technologies.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <p class="journal-excerpt">
            <strong>${entry.taskName}:</strong> ${entry.taskDescription}
        </p>
        <div class="journal-meta">
            <span class="meta-item">📝 Added this session</span>
        </div>
        <button class="read-more-btn">Read Full Entry →</button>
    `;

    return article;
};

const bindReadMoreButtons = (scope) => {
    scope.querySelectorAll('.journal-card').forEach(prepareExcerpt);
    scope.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.journal-card');
            toggleCard(card, btn);
        });
    });
};

const renderStoredEntries = () => {
    const grid = document.getElementById('journalGrid');
    if (!grid) return;
    const entries = getStoredEntries();
    if (!entries.length) return;

    entries.forEach((entry, index) => {
        const card = createCardFromEntry(entry);
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        grid.appendChild(card);
        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    });

    bindReadMoreButtons(grid);
};

const bindJournalForm = () => {
    const form = document.getElementById('journalForm');
    if (!form) return;

    const weekEl = document.getElementById('weekOfJournal');
    const nameEl = document.getElementById('journalName');
    const dateEl = document.getElementById('journalDate');
    const taskNameEl = document.getElementById('taskName');
    const descEl = document.getElementById('taskDescription');
    const techGroup = document.getElementById('technologies');
    const errorEl = document.getElementById('formError');
    const successEl = document.getElementById('formSuccess');

    const showError = (msg) => {
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
        }
        if (successEl) successEl.style.display = 'none';
    };

    const showSuccess = (msg) => {
        if (successEl) {
            successEl.textContent = msg;
            successEl.style.display = 'block';
        }
        if (errorEl) errorEl.style.display = 'none';
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const weekOfJournal = parseInt(weekEl.value, 10);
        const journalName = nameEl.value.trim();
        const journalDate = dateEl.value;
        const taskName = taskNameEl.value.trim();
        const taskDescription = descEl.value.trim();
        const technologies = Array.from(techGroup.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);

        // Validation rules
        if (!Number.isFinite(weekOfJournal) || weekOfJournal < 1) {
            return showError('Please enter a valid Week number (1 or higher).');
        }
        if (!journalName) {
            return showError('Please provide your Journal Name.');
        }
        if (!journalDate) {
            return showError('Please select a Journal Date.');
        }
        if (!taskName) {
            return showError('Please enter a Journal Task Name.');
        }
        if (wordCount(taskDescription) < 10) {
            return showError('Description must contain at least 10 words.');
        }
        if (technologies.length === 0) {
            return showError('Select at least one technology used.');
        }

        const newEntry = { weekOfJournal, journalName, journalDate, taskName, taskDescription, technologies };

        const entries = getStoredEntries();
        entries.push(newEntry);
        setStoredEntries(entries);

        // Render card immediately
        const grid = document.getElementById('journalGrid');
        const card = createCardFromEntry(newEntry);
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        grid.appendChild(card);
        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        bindReadMoreButtons(card);

        showSuccess('Journal entry added for this session.');
        form.reset();
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderStoredEntries();
        bindJournalForm();
    });
} else {
    renderStoredEntries();
    bindJournalForm();
}