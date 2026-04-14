// ─── UI Elements ────────────────────────────────────────────────
const cards  = document.querySelectorAll('.cs-card');
const hoverWindow = document.getElementById('hover-window');
const hwImg = document.getElementById('hw-img');

const hwHp = document.getElementById('hw-hp');
const hwAtk = document.getElementById('hw-atk');
const hwDef = document.getElementById('hw-def');
const hwSpd = document.getElementById('hw-spd');
const hwSp  = document.getElementById('hw-sp');


//On Click Outline
cards.forEach(card => {

    card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
    card.addEventListener('mouseenter', (e) => {
        console.log("Hovered");
        const rect = card.getBoundingClientRect();
        console.log('rect: ', rect);
        let right = rect.right;
        let top = rect.top;

        // fill data
        hwImg.src = card.dataset.img;
        hwHp.textContent = card.dataset.hp;
        hwAtk.textContent = card.dataset.atk;
        hwDef.textContent = card.dataset.def;
        hwSpd.textContent = card.dataset.spd;
        hwSp.textContent  = card.dataset.sp;

        // position near card
        hoverWindow.style.left = rect.left-rect.width + "px";
        hoverWindow.style.top  = rect.top-rect.height + "px";
        // hoverWindow.style.width = rect.width + "px";

        hoverWindow.classList.add('visible');
    });

    // card.addEventListener('mouseleave', () => {
    //     hoverWindow.classList.remove('visible');
    // });
});

