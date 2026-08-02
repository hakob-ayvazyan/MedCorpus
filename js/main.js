// ===== PRELOADER =====
const preloader = document.getElementById('preloader');

if (preloader) {
    // Show preloader briefly on page load, then fade out
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 600);
    });

    // Fallback: hide preloader after 3 seconds even if load event already fired
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }, 3000);

    // Show preloader when navigating to another internal page
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Only intercept internal .html links (not anchors, not external)
        const isInternal = href.endsWith('.html') || href.startsWith('index.html');
        if (!isInternal) return;

        // Don't intercept links with target="_blank"
        if (link.target === '_blank') return;

        // Prevent default to show preloader, then navigate
        e.preventDefault();
        preloader.classList.remove('hidden');
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });
}

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close nav on link click
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

// ===== HEADER SCROLL SHADOW =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== FADE-IN ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ===== REGULATION PAGES: SHOW ALL CONTENT IMMEDIATELY =====
// On regulation pages, show all fade-in elements right away
// so users don't need to scroll to reveal content
if (window.location.pathname.includes('reglament-')) {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
    });
}

// ===== LECTURE PAGES: SHOW ALL CONTENT IMMEDIATELY =====
// On lecture pages, show all fade-in elements right away
// so users don't need to scroll to reveal content
if (window.location.pathname.includes('lekciya-')) {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
    });
}

// ===== LIGHTBOX (lecture photos) =====
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox) {
    // Open lightbox on photo thumbnail click
    document.querySelectorAll('.lecture-doc__photo').forEach(photo => {
        photo.addEventListener('click', function() {
            const fullSrc = this.dataset.full || this.querySelector('img').src;
            lightboxImage.src = fullSrc;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });
}

// ===== IRYOJUTSU FILTER =====
const filterButtons = document.querySelectorAll('.filter-btn');
const jutsuCards = document.querySelectorAll('.iryojutsu-card');

if (filterButtons.length && jutsuCards.length) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            jutsuCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const rank = card.dataset.rank;
                    if (rank === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }

                // Re-trigger fade-in for visible cards
                setTimeout(() => {
                    card.classList.add('visible');
                }, 50);
            });
        });
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath) {
        link.classList.add('active');
    }
});

// ===== MEMBER MODAL =====
const modalOverlay = document.getElementById('memberModal');
const modalClose = document.getElementById('modalClose');

if (modalOverlay) {
    function fillModal(data) {
        document.getElementById('modalName').textContent = data.name || '—';
        document.getElementById('modalKanji').textContent = data.kanji || '—';
        document.getElementById('modalRank').textContent = data.rank || '—';
        document.getElementById('modalPosition').textContent = data.position || '—';
        document.getElementById('modalClan').textContent = data.clan || '—';
        document.getElementById('modalDiscordName').textContent = data.discord ? '@' + data.discord : '—';

        // Note row - show only if note exists
        const noteRow = document.getElementById('modalNoteRow');
        const noteEl = document.getElementById('modalNote');
        if (data.note) {
            noteEl.textContent = data.note;
            noteRow.style.display = 'flex';
        } else {
            noteRow.style.display = 'none';
        }
    }

    // Open modal on table row click
    document.querySelectorAll('.composition-table tbody tr:not(.vacant-row)').forEach(row => {
        row.addEventListener('click', function() {
            fillModal({
                name: this.dataset.name,
                rank: this.dataset.rank,
                position: this.dataset.position,
                clan: this.dataset.clan,
                note: this.dataset.note,
                discord: this.dataset.discord,
                kanji: ''
            });
            modalOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // Open modal on leadership card click
    document.querySelectorAll('.leadership-card').forEach(card => {
        card.addEventListener('click', function() {
            fillModal({
                name: this.dataset.name,
                rank: this.dataset.rank,
                position: this.dataset.position,
                clan: this.dataset.clan,
                note: this.dataset.note || '',
                discord: this.dataset.discord,
                kanji: this.dataset.kanji
            });
            modalOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
            closeModal();
        }
    });
}

// ===== RANK COLORS FOR TECHNIQUE MODAL =====
const rankColors = {
    'S': { bg: '#ffd700', color: '#1a1a1a' },
    'A': { bg: '#e53935', color: 'white' },
    'B': { bg: '#1b5e20', color: 'white' },
    'C': { bg: '#546e7a', color: 'white' }
};

// ===== TECHNIQUE IMAGE MAP =====
const techniqueImages = {
    'Забота о чакре': 'images/chakra-care.jpg',
    'Мягкое извлечение': 'images/soft-extraction.jpg',
    'Паралич (Мед Стан)': 'images/paralysis.jpg',
    'Ядовитое облако': 'images/poison-cloud.jpg',
    'Мистическая ладонь': 'images/mystic-palm.jpg',
    'Стимуляция клеток': 'images/cell-stimulation.jpg',
    'Нарушающий удар': 'images/disrupting-blow.jpg',
    'Регенерация клеток': 'images/cell-regeneration.jpg',
    'Стиль боя: Тайдзюцу Медика': 'images/med-taijutsu.jpg',
    'Багровая морось': 'images/crimson-mist.jpg',
    'Расцветающая вишня': 'images/cherry-blossom.jpg',
    'Небесный болевой удар': 'images/heavenly-pain.jpg',
    'Стиль боя: Скальпель Чакры': 'images/chakra-scalpel.jpg',
    'Нервный разрыв': 'images/nerve-rupture.jpg',
    'Перекрёстный разрез': 'images/cross-slash.jpg',
    'Инверсивная техника мистической ладони': 'images/inverse-mystic-palm.jpg',
    'Камао Бьякуган Буттай Но Джутсу': 'images/byakugan-surgery.jpg'
};

// ===== TECHNIQUE MODAL =====
const techModal = document.getElementById('techniqueModal');
const techModalClose = document.getElementById('techniqueModalClose');

if (techModal) {
    function openTechModal(data) {
        document.getElementById('techModalName').textContent = data.name || '—';
        document.getElementById('techModalNameJp').textContent = data.nameJp || '—';

        // Image
        const imgEl = document.getElementById('techModalImage');
        if (imgEl) {
            const src = techniqueImages[data.name];
            if (src) {
                imgEl.src = src;
                imgEl.style.display = 'block';
            } else {
                imgEl.style.display = 'none';
            }
        }

        // Rank
        const rankEl = document.getElementById('techModalRank');
        const rank = data.rank || 'C';
        rankEl.textContent = rank;
        const rc = rankColors[rank] || { bg: '#546e7a', color: 'white' };
        rankEl.style.background = rc.bg;
        rankEl.style.color = rc.color;

        // Type badge
        const typeEl = document.getElementById('techModalType');
        if (data.type === 'mechanical') {
            typeEl.className = 'technique-modal__type-badge technique-modal__type-badge--mechanical';
            typeEl.innerHTML = '<i class="fas fa-notes-medical"></i> Медицинская';
        } else if (data.type === 'taijutsu') {
            typeEl.className = 'technique-modal__type-badge technique-modal__type-badge--mechanical';
            typeEl.innerHTML = '<i class="fas fa-hand-fist"></i> Тайдзюцу';
        } else if (data.type === 'scalpel') {
            typeEl.className = 'technique-modal__type-badge technique-modal__type-badge--mechanical';
            typeEl.innerHTML = '<i class="fas fa-scalpel"></i> Скальпель';
        } else {
            typeEl.className = 'technique-modal__type-badge technique-modal__type-badge--roleplay';
            typeEl.innerHTML = '<i class="fas fa-masks-theater"></i> Ролевая';
        }

        // Description
        document.getElementById('techModalDesc').textContent = data.desc || '';

        // Details
        const detailsContainer = document.getElementById('techModalDetails');
        detailsContainer.innerHTML = '';
        if (data.details && Array.isArray(data.details)) {
            data.details.forEach(d => {
                const div = document.createElement('div');
                div.className = 'technique-modal__detail';
                div.innerHTML = `<i class="fas ${d.icon}"></i> <strong>${d.label}:</strong> ${d.value}`;
                detailsContainer.appendChild(div);
            });
        }

        techModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    // Open modal on technique card click
    document.querySelectorAll('.technique-card').forEach(card => {
        card.addEventListener('click', function() {
            let details = [];
            try {
                details = JSON.parse(this.dataset.details || '[]');
            } catch(e) {
                details = [];
            }

            openTechModal({
                name: this.dataset.name,
                nameJp: this.dataset.nameJp,
                type: this.dataset.type,
                rank: this.dataset.rank,
                desc: this.dataset.desc,
                details: details
            });
        });
    });

    // Close modal
    function closeTechModal() {
        techModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    techModalClose.addEventListener('click', closeTechModal);

    techModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeTechModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && techModal.classList.contains('open')) {
            closeTechModal();
        }
    });
}
