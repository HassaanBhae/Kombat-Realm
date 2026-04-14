// ─── UI Elements ────────────────────────────────────────────────
const cards  = document.querySelectorAll('.cs-card');
const popup  = document.getElementById('stat-popup');
const spName = document.getElementById('sp-name');
const spType = document.getElementById('sp-type');
const spBars = document.getElementById('sp-bars');

// ─── Stat Config ─────────────────────────────────────────────────
const STATS = [
    { key: 'hp',  label: 'HP'      },
    { key: 'atk', label: 'ATK'     },
    { key: 'def', label: 'DEF'     },
    { key: 'spd', label: 'Speed'   },
    { key: 'sp',  label: 'Special' },
];

function fillColor(val) {
    if (val >= 80) return 'high';
    if (val >= 50) return 'mid';
    return 'low';
}

// ─── Build Stat Bars ─────────────────────────────────────────────
function buildBars(card) {
    spBars.innerHTML = '';
    STATS.forEach(({ key, label }) => {
        const val = parseInt(card.dataset[key], 10);
        const row = document.createElement('div');
        row.className = 'sp-row';
        row.innerHTML = `
            <div class="sp-label-row">
                <span class="sp-label">${label}</span>
                <span class="sp-val">${val}</span>
            </div>
            <div class="sp-track">
                <div class="sp-fill ${fillColor(val)}" style="width:${val}%"></div>
            </div>`;
        spBars.appendChild(row);
    });
}

// ─── Smart Popup Positioning ──────────────────────────────────────
function positionPopup(card) {
    const win  = document.getElementById('2player-window');
    const winR = win.getBoundingClientRect();
    const cardR = card.getBoundingClientRect();
    const pw = 180, ph = 210;

    let left = cardR.right - winR.left + 10;
    let top  = cardR.top  - winR.top;

    if (left + pw > winR.width - 10)  left = cardR.left - winR.left - pw - 10;
    if (top + ph  > winR.height - 10) top  = winR.height - ph - 10;
    if (top < 10) top = 10;

    popup.style.left = left + 'px';
    popup.style.top  = top  + 'px';
}

// ─── Card Events ─────────────────────────────────────────────────
let hideTimer = null;

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        clearTimeout(hideTimer);
        spName.textContent = card.dataset.name;
        spType.textContent = card.dataset.type;
        buildBars(card);
        positionPopup(card);
        popup.classList.add('visible');
    });

    card.addEventListener('mouseleave', () => {
        hideTimer = setTimeout(() => popup.classList.remove('visible'), 80);
    });

    card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});
