//Ui Elemnts
const leaves = document.querySelectorAll(".leaf");
const leavesAll = document.getElementById("leaves");
const slideshow = document.getElementById("slideshow");
const loader = document.getElementById("loader");
const loadingBar = document.getElementById("loadingBar");
const innerBar = document.getElementById("innerBar");
const playButton = document.getElementById("playButton");
const bg = document.querySelector("body");
const audioBg = document.getElementById('background-audio');
const slideDoorAudio = document.getElementById('slideDoor-audio');
const items = document.querySelectorAll('.menu-item');
const overlay = document.getElementById('blur-overlay');

//Load The Images Before Hand
let imagesLoaded = 0;
let counter = 0;
// let barWidth = "1.756%";
// innerBar.style.width += barWidth;


for (let i = 1; i <= 57; i++) {
    const img = document.createElement('img');
    img.src = `./images/png-bg/frame-${i}.png`;
    img.alt = `Image ${i}`;
    img.style.zIndex = "100";
    
    // Scaling logic
    //Scaling With respect to Width of the Screen
 
    const width = screen.width;
    if (width >= 1400) {
        img.style.transform = "scale(1.3)";
    } else if (width >= 1300) {
        img.style.transform = "scale(1.4)";
    } else if (width >= 1200) {
        img.style.transform = "scale(1.5)";
    } else if (width >= 1100) {
        img.style.transform = "scale(1.6)";
    } else if (width >= 1000) {
        img.style.transform = "scale(1.7)";
    } else if (width >= 900) {
        img.style.transform = "scale(1.8)";
    } else if (width >= 800) {
        img.style.transform = "scale(1.9)";
    } else if (width >= 700) {
        img.style.transform = "scale(2)";
    } else if (width >= 600) {
        img.style.transform = "scale(2.1)";
    } else if (width >= 500) {
        img.style.transform = "scale(2.2)";
    } else if (width >= 400) {
        img.style.transform = "scale(2.3)";
    } else if (width >= 300) {
        img.style.transform = "scale(2.4)";
    } else {
        img.style.transform = "scale(1.3)";
    }
    slideshow.append(img);
    img.onload = () => {
        imagesLoaded++;
        finnerBar();
        if (imagesLoaded === 57) {
            // playAudio();
            loadingBar.style.opacity = "0";
            loadingBar.style.display = "none";
            playButton.style.display = "flex";
            // functionPlayButton();
            console.log("Called StartMenu");
        }
    };
}
playButton.addEventListener("click", () => {
    functionPlayButton();
});
function functionPlayButton(){
    playButton.style.display = "none";
    playAudio();
    startMenu();
}
functionPlayButton();
playButton.style.display = "none";


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
function finnerBar(){
    console.log("innerBar called!");
    let barWidth = 1.756; // percentage value as a number
    let currentWidth = parseFloat(innerBar.style.width) || 0; // get current width, default to 0 if not set
    let newWidth = currentWidth + barWidth; // add the new width
    innerBar.style.width = newWidth + '%'; // set the new width
}
function startMenu(){
    leavesAll.style.display = "block";  
    bg.style.backdropFilter = "none";
    bg.style.filter = "none";
    loadingBar.style.opacity = "0";
    loadingBar.style.display = "none";
};
let currentIndex = 0; 

//Grab The loaded Images
const images = document.querySelectorAll('.slideshow img'); 

//TO Show images
function showNextImage(intervalId) {
    images[currentIndex].classList.remove('active'); 
    currentIndex = (currentIndex + 1) % images.length; 
    images[currentIndex].classList.add('active'); 
    if(currentIndex === 56) {
            console.log("Finished Gif!",currentIndex);
            // choice.style.opacity = "1";
            clearInterval(intervalId);
            return;
    }
}

//Call The Splash Screen
function splashScreen(){
    leaves.forEach(leaf => {
        leaf.style.zIndex = "1";
    });
    playSlideDoorAudio();
    const intervalId = setInterval(() => showNextImage(intervalId), 30); 
}
//OVERLAY BLUE
items.forEach((item, index) => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.menu-window')
            .forEach(w => w.classList.remove('active'));

        windows[index].classList.add('active');

        overlay.classList.add('active'); // enable blur
    });
});
// document.querySelectorAll('.menu-window').forEach(win => {
//     win.addEventListener('click', () => {
//         win.classList.remove('active');
//         overlay.classList.remove('active');
//     });
// });
//---------------------------------------
const windows = {
    0: document.getElementById('arcade-window'),
    1: document.getElementById('2player-window'),
    2: document.getElementById('settings-window'),
    3: document.getElementById('credits-window')
};
// document.querySelectorAll('.menu-window').forEach(win => {
//     win.addEventListener('click', () => {
//         win.classList.remove('active');
//     });
// });
items.forEach((item, index) => {
    item.addEventListener('click', () => {
        // close all
        document.querySelectorAll('.menu-window')
            .forEach(w => w.classList.remove('active'));

        // open selected
        windows[index].classList.add('active');
    });
});
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-window')
      .forEach(w => w.classList.remove('active'));

    overlay?.classList.remove('active');
  });
});
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

// Click on a key box → start rebind
document.addEventListener('click', (e) => {
  const box = e.target.closest('.kb-box');
  if (box) {
    startListening(box);
  } else {
    stopListening();
  }
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

// Visual press effect
document.addEventListener('mousedown', (e) => {
  const box = e.target.closest('.kb-box');
  if (box) box.classList.add('pressed');
});
document.addEventListener('mouseup', () => {
  document.querySelectorAll('.kb-box.pressed').forEach(b => b.classList.remove('pressed'));
});

// Reset button
document.getElementById('reset-btn').addEventListener('click', () => {
  Object.assign(keys, DEFAULTS);
  stopListening();
  render();
});

// Init
render();

/* ─── Audio Toggles ─── */
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

// Close button
// document.getElementById('close-btn').addEventListener('click', () => {
//   document.getElementById('settings-window').classList.remove('active');
//   overlay.classList.remove('active');

// });



const cards   = document.querySelectorAll('.cs-card');
const popup   = document.getElementById('stat-popup');
const spName  = document.getElementById('sp-name');
const spType  = document.getElementById('sp-type');
const spBars  = document.getElementById('sp-bars');

const STATS = [
  { key: 'hp',  label: 'HP'    },
  { key: 'atk', label: 'ATK'   },
  { key: 'def', label: 'DEF'   },
  { key: 'spd', label: 'Speed' },
  { key: 'sp',  label: 'Special'},
];

function fillColor(val) {
  if (val >= 80) return 'high';
  if (val >= 50) return 'mid';
  return 'low';
}

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

function positionPopup(card) {
  const win   = document.getElementById('2player-window');
  const winR  = win.getBoundingClientRect();
  const cardR = card.getBoundingClientRect();
  const pw    = 180;
  const ph    = 210;

  let left = cardR.right - winR.left + 10;
  let top  = cardR.top  - winR.top;

  if (left + pw > winR.width - 10) {
    left = cardR.left - winR.left - pw - 10;
  }
  if (top + ph > winR.height - 10) {
    top = winR.height - ph - 10;
  }
  if (top < 10) top = 10;

  popup.style.left = left + 'px';
  popup.style.top  = top  + 'px';
}

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

