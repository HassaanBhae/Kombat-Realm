// ─── Credits Animation ───────────────────────────────────────────
const creditsWindow = document.getElementById('credits-window');
const creditsInner  = creditsWindow.querySelector('.credits-inner');

function restartCredits() {
    console.log("Restarting Credits!");

    // Reset parent scroll animation
    creditsInner.style.animation = 'none';
    creditsInner.offsetHeight; // force reflow

    // Reset child animations
    creditsWindow.querySelectorAll('.credits-section, .credits-title')
        .forEach(el => {
            el.style.opacity  = '1';
            el.style.animation = 'none';
            el.offsetHeight;   // force reflow
            el.style.animation = '';
        });

    // Restart scroll
    setTimeout(() => {
        creditsInner.style.animation = 'scrollCredits 20s linear forwards';
    }, 10);
}
