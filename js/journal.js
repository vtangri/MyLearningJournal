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

// ===== READ MORE BUTTON ANIMATION =====
const readMoreBtns = document.querySelectorAll('.read-more-btn');

readMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.journal-card');
        const week = card.querySelector('.badge-week').textContent;
        
        // You can add modal or navigation logic here
        console.log(`Opening full entry for ${week}`);
        
        // Add pulse animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
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