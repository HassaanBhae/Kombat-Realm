// ─── UI Elements ────────────────────────────────────────────────
const items   = document.querySelectorAll('.menu-item');
const overlay = document.getElementById('blur-overlay');

const windows = {
    0: document.getElementById('arcade-window'),
    1: document.getElementById('2player-window'),
    2: document.getElementById('settings-window'),
    3: document.getElementById('credits-window'),
    4: document.getElementById('character-select-window'),
};

// ─── Open Window on Menu Item Click ─────────────────────────────
items.forEach((item, index) => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.menu-window')
            .forEach(w => w.classList.remove('active'));

            if(index == 0 || index == 1){
            windows[4].classList.add('active');
            }else{
            windows[index].classList.add('active');

            }
        overlay.classList.add('active');
    });
});

// ─── Close Buttons ───────────────────────────────────────────────
// NOTE: restartCredits() is defined in credits.js — load that file first
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.menu-window')
            .forEach(w => w.classList.remove('active'));

        restartCredits();
        overlay?.classList.remove('active');
    });
});
// ─── UI Elements ───────────────────────────────────────────────
const leaves      = document.querySelectorAll(".leaf");
const leavesAll   = document.getElementById("leaves");
const slideshow   = document.getElementById("slideshow");
const loadingBar  = document.getElementById("loadingBar");
const innerBar    = document.getElementById("innerBar");
const playButton  = document.getElementById("playButton");
const bg          = document.querySelector("body");
const audioBg     = document.getElementById('background-audio');
const slideDoorAudio = document.getElementById('slideDoor-audio');

// ─── Image Preloader ────────────────────────────────────────────
let imagesLoaded = 0;

for (let i = 1; i <= 57; i++) {
    const img = document.createElement('img');
    img.src = `./images/png-bg/frame-${i}.png`;
    img.alt = `Image ${i}`;
    img.style.zIndex = "100";

    // Scale image based on screen width
    const width = screen.width;
    if      (width >= 1400) img.style.transform = "scale(1.3)";
    else if (width >= 1300) img.style.transform = "scale(1.4)";
    else if (width >= 1200) img.style.transform = "scale(1.5)";
    else if (width >= 1100) img.style.transform = "scale(1.6)";
    else if (width >= 1000) img.style.transform = "scale(1.7)";
    else if (width >= 900)  img.style.transform = "scale(1.8)";
    else if (width >= 800)  img.style.transform = "scale(1.9)";
    else if (width >= 700)  img.style.transform = "scale(2)";
    else if (width >= 600)  img.style.transform = "scale(2.1)";
    else if (width >= 500)  img.style.transform = "scale(2.2)";
    else if (width >= 400)  img.style.transform = "scale(2.3)";
    else if (width >= 300)  img.style.transform = "scale(2.4)";
    else                    img.style.transform = "scale(1.3)";

    slideshow.append(img);

    img.onload = () => {
        imagesLoaded++;
        finnerBar();
        if (imagesLoaded === 57) {
            loadingBar.style.opacity = "0";
            loadingBar.style.display = "none";
            playButton.style.display = "flex";
            console.log("All frames loaded — showing play button");
        }
    };
}

// ─── Loading Bar ────────────────────────────────────────────────
function finnerBar() {
    const barWidth   = 1.756;
    const current    = parseFloat(innerBar.style.width) || 0;
    innerBar.style.width = (current + barWidth) + '%';
}

// ─── Play Button ────────────────────────────────────────────────
playButton.addEventListener("click", () => functionPlayButton());

function functionPlayButton() {
    playButton.style.display = "none";
    playAudio();
    startMenu();
}

// Auto-start (remove these two lines if you want the button to always show)
functionPlayButton();
playButton.style.display = "none";

// ─── Audio ──────────────────────────────────────────────────────
function playAudio() {
    console.log("Playing BGAudio!");
    audioBg.muted = false;
    audioBg.play();
}

function playSlideDoorAudio() {
    console.log("Playing SlideDoorAudio!");
    audioBg.muted = true;
    audioBg.pause();
    slideDoorAudio.muted = false;
    slideDoorAudio.play();
}

// ─── Start Menu ─────────────────────────────────────────────────
function startMenu() {
    leavesAll.style.display    = "block";
    bg.style.backdropFilter    = "none";
    bg.style.filter            = "none";
    loadingBar.style.opacity   = "0";
    loadingBar.style.display   = "none";
}

// ─── Splash Screen ──────────────────────────────────────────────
const images = document.querySelectorAll('.slideshow img');
let currentIndex = 0;

function showNextImage(intervalId) {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
    if (currentIndex === 56) {
        console.log("Finished splash animation");
        clearInterval(intervalId);
    }
}

function splashScreen() {
    leaves.forEach(leaf => leaf.style.zIndex = "1");
    playSlideDoorAudio();
    const intervalId = setInterval(() => showNextImage(intervalId), 30);
}
