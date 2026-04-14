// ─── Key Rebinding ───────────────────────────────────────────────
const DEFAULTS = {
    up:      'W',
    left:    'A',
    right:   'D',
    attack:  'J',
    block:   'S',
    special: 'L',
};

const keys = { ...DEFAULTS };
let listeningBox = null;

function getAllBoxes() {
    return document.querySelectorAll('.kb-box[id^="key-"]');
}

function actionFromBox(box) {
    return box.id.replace('key-', '');
}

function render() {
    getAllBoxes().forEach(box => {
        const action = actionFromBox(box);
        box.textContent = keys[action];
    });
}

function startListening(box) {
    if (listeningBox) stopListening(false);
    listeningBox = box;
    box.classList.add('listening');
    box.textContent = '...';
}

function stopListening(rerender = true) {
    if (!listeningBox) return;
    listeningBox.classList.remove('listening');
    listeningBox = null;
    if (rerender) render();
}

// Click a key box → start rebind
document.addEventListener('click', (e) => {
    const box = e.target.closest('.kb-box');
    if (box) startListening(box);
    else     stopListening();
});

// Keydown → assign or cancel
document.addEventListener('keydown', (e) => {
    if (!listeningBox) return;
    e.preventDefault();

    if (e.key === 'Escape') {
        stopListening();
        return;
    }

    let label = e.key.toUpperCase();
    if (label === ' ')              label = 'SPC';
    if (label.startsWith('ARROW')) label = label.replace('ARROW', '')[0];
    if (label.length > 4)          label = label.slice(0, 4);

    const action = actionFromBox(listeningBox);

    // Clear any conflicting binding
    Object.keys(keys).forEach(k => {
        if (keys[k] === label && k !== action) keys[k] = '—';
    });

    keys[action] = label;
    stopListening();
});

// Visual press effect on kb-boxes
document.addEventListener('mousedown', (e) => {
    const box = e.target.closest('.kb-box');
    if (box) box.classList.add('pressed');
});
document.addEventListener('mouseup', () => {
    document.querySelectorAll('.kb-box.pressed')
        .forEach(b => b.classList.remove('pressed'));
});

// Reset to defaults
document.getElementById('reset-btn').addEventListener('click', () => {
    Object.assign(keys, DEFAULTS);
    stopListening();
    render();
});

// Init key display
render();

// ─── Audio Toggles ───────────────────────────────────────────────
const audioState = {
    music: true,
    sfx:   true,
};

function applyToggleUI(btn, isOn) {
    btn.classList.toggle('on',  isOn);
    btn.classList.toggle('off', !isOn);
    btn.setAttribute('aria-pressed', isOn);
    btn.querySelector('.toggle-state-label').textContent = isOn ? 'ON' : 'OFF';
}

function setupToggle(btnId, stateKey) {
    const btn = document.getElementById(btnId);
    applyToggleUI(btn, audioState[stateKey]);

    btn.addEventListener('click', () => {
        audioState[stateKey] = !audioState[stateKey];
        applyToggleUI(btn, audioState[stateKey]);
    });
}

setupToggle('toggle-music', 'music');
setupToggle('toggle-sfx',   'sfx');
