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
const API_BASE_URL = 'http://localhost:8000/api';

// Fetch entries from JSON file via API
const fetchEntriesFromJSON = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/entries`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.entries || [];
    } catch (error) {
        console.error('Error fetching entries:', error);
        // Fallback: try to fetch directly from JSON file
        try {
            const response = await fetch('backend/reflections.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.error('Fallback fetch also failed:', e);
        }
        return [];
    }
};

// Save entry to JSON file via API
const saveEntryToJSON = async (entry) => {
    try {
        const response = await fetch(`${API_BASE_URL}/save-entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving entry:', error);
        throw error;
    }
};

// Delete entry from JSON file via API
const deleteEntryFromJSON = async (entryId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/entry/${entryId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting entry:', error);
        throw error;
    }
};

// Update entry counter display
const updateEntryCounter = (count) => {
    const counterEl = document.getElementById('totalEntries');
    if (counterEl) {
        counterEl.textContent = count;
    }
};

// Show success modal
const showSuccessModal = (message) => {
    const modal = document.getElementById('journal-modal');
    const modalMessage = document.getElementById('journal-modal-message');
    const closeBtn = document.getElementById('journal-modal-close');

    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.classList.remove('hidden');

        const closeModal = () => {
            modal.classList.add('hidden');
        };

        if (closeBtn) {
            closeBtn.onclick = closeModal;
        }

        modal.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
    }
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

const renderStoredEntries = async () => {
    const grid = document.getElementById('journalGrid');
    if (!grid) return;

    // Show loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.textContent = 'Loading journal entries...';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.padding = '2rem';
    loadingDiv.style.color = '#888';
    grid.appendChild(loadingDiv);

    try {
        const entries = await fetchEntriesFromJSON();

        // Remove loading message
        loadingDiv.remove();

        if (!entries.length) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-message';
            emptyDiv.innerHTML = `
                <p style="text-align: center; padding: 2rem; color: #888;">
                    No journal entries yet. Add your first entry below! 📝
                </p>
            `;
            grid.appendChild(emptyDiv);
            return;
        }

        // Reverse entries to show newest first
        const reversedEntries = [...entries].reverse();

        reversedEntries.forEach((entry, index) => {
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
        updateEntryCounter(entries.length);
    } catch (error) {
        loadingDiv.textContent = 'Error loading entries. Please make sure the API server is running.';
        loadingDiv.style.color = '#dc2626';
        console.error('Failed to render entries:', error);
    }
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

    form.addEventListener('submit', async (e) => {
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

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            // Save to backend
            const result = await saveEntryToJSON(newEntry);

            // Add the returned entry (with ID and timestamp) to the grid
            const grid = document.getElementById('journalGrid');

            // Remove empty message if it exists
            const emptyMsg = grid.querySelector('.empty-message');
            if (emptyMsg) emptyMsg.remove();

            const card = createCardFromEntry(result.entry);
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            // Prepend to show newest first (at the top)
            grid.prepend(card);

            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
            bindReadMoreButtons(card);

            // Update counter
            updateEntryCounter(result.totalEntries);

            showSuccess('✅ Journal entry saved successfully!');
            form.reset();

            // Show modal
            showSuccessModal('Your journal entry has been saved to reflections.json');
        } catch (error) {
            showError(`Failed to save entry: ${error.message}. Make sure the API server is running (python3 backend/api.py)`);
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
};

// ===== EXPORT FUNCTIONALITY =====
const bindExportButton = () => {
    const exportBtn = document.getElementById('exportBtn');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', async () => {
        try {
            const entries = await fetchEntriesFromJSON();

            if (entries.length === 0) {
                alert('No entries to export!');
                return;
            }

            // Create downloadable JSON file
            const dataStr = JSON.stringify(entries, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            // Create download link
            const link = document.createElement('a');
            link.href = url;
            const timestamp = new Date().toISOString().split('T')[0];
            link.download = `journal-entries-${timestamp}.json`;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            URL.revokeObjectURL(url);

            showSuccessModal(`Successfully exported ${entries.length} journal entries!`);
        } catch (error) {
            alert('Failed to export entries: ' + error.message);
        }
    });
};

// ===== DATE FILTER FUNCTIONALITY =====
let allEntries = []; // Store all entries for filtering

const bindDateFilter = () => {
    const applyBtn = document.getElementById('applyDateFilter');
    const clearBtn = document.getElementById('clearFilters');
    const startDateInput = document.getElementById('filterStartDate');
    const endDateInput = document.getElementById('filterEndDate');

    if (!applyBtn || !clearBtn) return;

    applyBtn.addEventListener('click', () => {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (!startDate && !endDate) {
            alert('Please select at least one date to filter');
            return;
        }

        const grid = document.getElementById('journalGrid');
        const cards = Array.from(grid.querySelectorAll('.journal-card'));

        cards.forEach(card => {
            const dateEl = card.querySelector('.badge-date');
            if (!dateEl) return;

            const cardDateText = dateEl.textContent.trim();
            const cardDate = new Date(cardDateText);

            let show = true;

            if (startDate) {
                const start = new Date(startDate);
                if (cardDate < start) show = false;
            }

            if (endDate) {
                const end = new Date(endDate);
                if (cardDate > end) show = false;
            }

            card.style.display = show ? 'block' : 'none';
        });
    });

    clearBtn.addEventListener('click', () => {
        startDateInput.value = '';
        endDateInput.value = '';

        const grid = document.getElementById('journalGrid');
        const cards = Array.from(grid.querySelectorAll('.journal-card'));

        cards.forEach(card => {
            card.style.display = 'block';
        });

        // Also clear search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderStoredEntries();
        bindJournalForm();
        bindExportButton();
        bindDateFilter();
    });
} else {
    renderStoredEntries();
    bindJournalForm();
    bindExportButton();
    bindDateFilter();
}