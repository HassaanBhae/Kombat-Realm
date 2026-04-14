let canvas;
let context;
let x,y;

//Turn this to true to turn on Debugging Visualizer
let debug = false;
    // debug = true;
const globalCooldown = 10000;
let countdownDuration = 60;
let winnerDeclared = false;
let borderRight = window.innerWidth;
// <------------------ CHARACTER SELECT ------------------->
// let chosenCharacter = "samurai";
// let chosenCharacter = "kenji"; 
// let chosenCharacter = "knight";
// let chosenCharacter = "akaza";
// let chosenCharacter = "anakin"; 
// let chosenCharacter = "rambo";
// let chosenCharacter = "law";
let chosenCharacter = "death";
// <------------------ ENEMY SELECT ------------------->
// let chosenEnemy = "samurai";
// let chosenEnemy = "kenji";
// let chosenEnemy = "knight";
// let chosenEnemy = "akaza";
// let chosenEnemy = "anakin";
let chosenEnemy = "rambo";
// let chosenEnemy = "law";
// let chosenEnemy = "death";

scale = setScale();
scale = 1.3;
console.log('scale: ', scale);

//Character width and height
const width = 600 * scale; // Scaled width
console.log('Character width: ', width);
const height = 365 * scale; // Scaled height
console.log('Character height: ', height);
const effectOffset = 35* scale;

const bgElement = document.getElementById('background');

// Get container size
const containerWidth = bgElement.clientWidth;
const containerHeight = bgElement.clientHeight;

// Define intrinsic size of the background image (you must know this)
const imageNaturalWidth = 1808;  // Example intrinsic width
const imageNaturalHeight = 872;  // Example intrinsic height

const containerRatio = containerWidth / containerHeight;
const imageRatio = imageNaturalWidth / imageNaturalHeight;

let renderedWidth, renderedHeight;

if (imageRatio > containerRatio) {
// Image fills width
renderedWidth = containerWidth;
renderedHeight = containerWidth / imageRatio;
} else {
// Image fills height
renderedHeight = containerHeight;
renderedWidth = containerHeight * imageRatio;
}

// Get computed width and height
const bgWidth = renderedWidth;
const bgHeight = renderedHeight;

console.log('bgWidth:', bgWidth);
console.log('bgHeight:', bgHeight);


const keysPressed = new Set(); // Track keys pressed

let pMoveFCounter = 0;  // Keeps track of the current frame
let eMoveFCounter = 0;  // Keeps track of the current frame

let pAttackFCounter = 0;  // Keeps track of the current frame
let eAttackFCounter = 0;  // Keeps track of the current frame

//Effect counter for when hit while blocked
let effectOrangeFCounter = 0;

let pDeathFCounter = 0;
let eDeathFCounter = 0;

let pTakeHitFCounter = 0;
let eTakeHitFCounter = 0;

function User(name,x,y,dpa,maxHealth) {

    this.name = name;
    this.x = x;
    this.y = y;
    this.dpa = dpa;
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.blockCounter = 5;

    let isAttacking = false;
    let isTakingHit = false;
    let isBlocking = false;
    let hasBlocked = false;
    let cooldown = false;
    let dashCooldown = false;
    let isMoving = false;
    let isJumping = false; 
    let isFalling = false; 
    let isDashing = false; 
    let isDead = false;
    let isFlipped = false;
    let playingAnimation = false;

    let attackRange;
    let attackRangeS ;
    let attackRangeE ;
    let attackRangeT ;
    let attackRangeB ;

    let hitBoxXL;
    let hitBoxXR;
    let hitBoxYT;
    let hitBoxYB;

    let hitBoxCenter;
    let effectBoxX;
    let effectBoxY;

    
    this.attack = function(){
        if(!this.cooldown){
            this.isAttacking = true;
            this.cooldown = true;
        }

        setTimeout(() => {
            this.isAttacking = false;
            if (this === player) {     
                if(enemy.hitBoxXL >= player.attackRangeS && enemy.hitBoxXL <= player.attackRangeE){                        
                    if(enemy.hitBoxYB <= player.attackRangeB && enemy.hitBoxYB >= player.attackRangeT || enemy.hitBoxYT <= player.attackRangeB && enemy.hitBoxYT >= player.attackRangeT ){
                        console.log("Hit");
                        enemy.takeHit(player.dpa);       
                    }else{
                        console.log("missed Y");
                    }
                }
                else if(enemy.hitBoxXR >= player.attackRangeS && enemy.hitBoxXR <= player.attackRangeE){
                    if(enemy.hitBoxYB <= player.attackRangeB && enemy.hitBoxYB >= player.attackRangeT || enemy.hitBoxYT <= player.attackRangeB && enemy.hitBoxYT >= player.attackRangeT ){
                        console.log("Hit");
                        enemy.takeHit(player.dpa);       
                    }else{
                        console.log("missed Y");
                    }    
                }
                else{
                    console.log("Miss");
                }
            } 
            else if (this === enemy) {
                if(player.hitBoxXL <= enemy.attackRangeS && player.hitBoxXL >= enemy.attackRangeE){                        
                    if(player.hitBoxYB <= enemy.attackRangeB && player.hitBoxYB >= enemy.attackRangeT || player.hitBoxYT <= enemy.attackRangeB && player.hitBoxYT >= enemy.attackRangeT ){
                        console.log("Hit");
                        player.takeHit(enemy.dpa);       
                    }else{
                        console.log("missed Y");
                    }
                }
                else if(player.hitBoxXR <= enemy.attackRangeS && player.hitBoxXR >= enemy.attackRangeE){
                    console.log("Hit X");
                    if(player.hitBoxYB <= enemy.attackRangeB && player.hitBoxYB >= enemy.attackRangeT || player.hitBoxYT <= enemy.attackRangeB && player.hitBoxYT >= enemy.attackRangeT ){
                        console.log("Hit");
                        player.takeHit(enemy.dpa);       
                    }else{
                        console.log("missed Y");
                    }    
                }
                else{
                    console.log("Miss");
                }       
            }
        }, 200); //300 for knight //200 Overall
        setTimeout(() => {
            this.cooldown = false;
        }, 500); 
    }

    this.takeHit = function(dpa){
        if(!winnerDeclared && !this.isBlocking){
            console.log("Took a Hit!");
            this.isTakingHit = true;
            setTimeout(() => {                
                this.currentHealth -= dpa;

                console.log('player.currentHealth: ', player.currentHealth);
                console.log('enemy.currentHealth: ', enemy.currentHealth);

                healthBarEnemy.style.width = (enemy.currentHealth/enemy.maxHealth)*100 + '%';
                healthBarPlayer.style.width = (player.currentHealth/player.maxHealth)*100 + '%';
            }, 50);
            setTimeout(() => {
                this.isTakingHit = false;
                pTakeHitFCounter = 0;
                eTakeHitFCounter = 0;
            }, 400); 
        }else{
            console.log(this.name+" Blocked the Attack!");

            //TO DRAW BLOCKED EFFECT
            this.hasBlocked = true;
            setTimeout(() => {
                this.hasBlocked = false;
                //Reset Counter
                effectOrangeFCounter = 0;
            }, 200);


            this.blockCounter--;
            this.block();//to check status and unblock if blockCounter is 0
        }
    }
    //To check block limit
    this.block = function(){
        
        if(this.blockCounter > 0 && !this.isMoving){
            this.isBlocking = true;
            console.log(this.name+" Is Blocking!"+this.isBlocking+":"+this.blockCounter);
        }else{
            this.isBlocking = false;
            console.log(this.name+" Can't Block!:"+this.blockCounter);
        }
    }


    this.jump = function(){
        this.isJumping = true; // Set jumping state
        let counter = 0;
        const intervalId = setInterval(() => {
            if (counter < 50) { // Number of upward moves for the jump
                this.y -= 6; // Move up gradually
                counter++;
            } else {
                clearInterval(intervalId); // Stop the upward movement
                console.log("CAlling Fall()");
                this.fall(); // Start falling back down
            }
        }, 1);
    }


    this.fall = function(){
        console.log('Falling!');
        this.isFalling = true;
        let fallCounter = 0;
        const fallIntervalId = setInterval(() => {
            if (fallCounter < 50) { // Number of downward moves
                this.y += 6; // Move down gradually
                fallCounter++;
            } else {
                clearInterval(fallIntervalId); // Stop the downward movement
                this.isJumping = false; // Reset jumping state
                this.isFalling = false;
            }
        }, 1);
    }


    this.dash = function(){
        // If dash is on cooldown, return early
        if (this.isDashing === true || this.dashCooldown === true) {
            console.log(this.name+" is in CoolDown!");
            return;
        }
        this.isDashing = true; // Set dashing state
        this.dashCooldown = true;
        this.playingAnimation=true;
        
        if (this === player) {            
            this.x += 70*scale; // Move player position to the right
        } 
        else if (this === enemy) {
            this.x -= 70*scale; // Move player position to the left
        }
        resetCoolDown(this.name);
        this.attack();
        setTimeout(() => {
            startCoolDown(this.name);
            if (this === player) {            
                this.x -= 70*scale; // Move back player to the left
            } 
            else if (this === enemy) {
                this.x += 70*scale; // Move back player to the right
            }
            this.playingAnimation = false; // Animation ends
        }, 250);
        setTimeout(() => {
            this.isDashing = false; // Reset cooldown after 3 seconds
        }, 400);
    }

}
// player spawn locator
// let eXSpawn = Math.floor(bgWidth/3);
// let pXSpawn = Math.floor(bgWidth/3);
let eXSpawn = bgWidth-(width/1.3);
let pXSpawn = 0 - 140;
//Why 140? Because widht/1.3 is 461 for enemy so for
//the other side 461-600 = 139 or 140


let eYSpawn = bgHeight-height;
let pYSpawn = bgHeight-height;

//Character Select Init
//Format = (player or enemy , xcord , ycord , damage , health )
const player = new User('player',pXSpawn,pYSpawn,25,100);
const enemy = new User('enemy',eXSpawn,eYSpawn,25,100);

window.onload = init;

function init() {
    canvas = document.getElementById('canvas');

    background = document.getElementById('background');
    ///Fix For Phone Screen where height gets locked but not the IWdth
    if(window.innerWidth >= 1301){
        background.style.backgroundSize = window.innerWidth+"px"+" "+window.innerHeight+"px";
    }
    console.log('window.innerWidth: ', window.innerWidth);
    console.log('window.innerHEight: ', window.innerHeight);

    pAttackRange = document.getElementById('attackRangeP');
    eAttackRange = document.getElementById('attackRangeE');
    playerHitBoxBox = document.getElementById('playerHitBoxBox');
    pEnemyHitBoxBox = document.getElementById('enemyHitBoxBox');
    hitBoxCords = document.querySelectorAll('.hitBoxCords');
    indicator = document.getElementById("indicator");


    time = document.getElementById("time");
    resultIndicator = document.getElementById("resultIndicator");

    context = canvas.getContext('2d');

    healthBarPlayer =  document.getElementById("healthBarPlayer");
    healthBarEnemy = document.getElementById("healthBarEnemy");
    
    specialBar1 = document.getElementById('specialBar1');
    specialBar2 = document.getElementById('specialBar2');

    glareClassP = document.querySelector('.glareP');
    glareClassP.style.display = "none"; // Removes from layout
    glareClassE = document.querySelector('.glareE');
    glareClassE.style.display = "none"; // Removes from layout

    //Load Effect Frames
    effectOrangeF = document.querySelectorAll(".hitOrange");
    effectYellowF = document.querySelectorAll(".hitYellow");

    //LOAD FRAMES CHARACTER
    if(chosenCharacter === "samurai"){
        pIdle = document.querySelector(".samuraiIdle");
        pAttackF =  document.querySelectorAll(".samuraiAttack");
        pFallF = document.querySelector(".samuraiFall");
        pMoveF = document.querySelectorAll(".samuraiRun");
        pTakeHitF = document.querySelectorAll(".samuraiTakeHit");
        pDeathF = document.querySelectorAll(".samuraiDeath");
        pBlockF = document.querySelector(".samuraiBlock");
        
    }else if(chosenCharacter === "knight"){
        pIdle = document.querySelector(".knightIdle");
        pAttackF = document.querySelectorAll(".knightAttack");
        pFallF = document.querySelector(".knightFall");
        pMoveF = document.querySelectorAll(".knightRun");
        pTakeHitF = document.querySelectorAll(".knightTakeHit");
        pDeathF = document.querySelectorAll(".knightDeath");
        pBlockF = document.querySelector(".knightBlock");
    }else if(chosenCharacter === "kenji"){
        pIdle = document.querySelector(".kenjiIdle");
        pAttackF =  document.querySelectorAll(".kenjiAttack");
        pFallF = document.querySelector(".kenjiFall");
        pMoveF = document.querySelectorAll(".kenjiRun");
        pTakeHitF = document.querySelectorAll(".kenjiTakeHit");
        pDeathF = document.querySelectorAll(".kenjiDeath");
        pBlockF = document.querySelector(".kenjiBlock");
    }else if(chosenCharacter === "akaza"){
        pIdle = document.querySelector(".akazaIdle");
        pAttackF = document.querySelectorAll(".akazaAttack");
        pFallF = document.querySelector(".akazaFall");
        pMoveF = document.querySelectorAll(".akazaRun");
        pTakeHitF = document.querySelectorAll(".akazaTakeHit");
        pDeathF = document.querySelectorAll(".akazaDeath");
        pBlockF = document.querySelector(".akazaBlock");
    }else if(chosenCharacter === "anakin"){
        pIdle = document.querySelector(".anakinIdle");
        pAttackF = document.querySelectorAll(".anakinAttack");
        pFallF = document.querySelector(".anakinFall");
        pMoveF = document.querySelectorAll(".anakinRun");
        pTakeHitF = document.querySelectorAll(".anakinTakeHit");
        pDeathF = document.querySelectorAll(".anakinDeath");
        pBlockF = document.querySelector(".anakinBlock");
    }else if(chosenCharacter === "rambo"){
        pIdle = document.querySelector(".ramboIdle");
        pAttackF = document.querySelectorAll(".ramboAttack");
        pFallF = document.querySelector(".ramboFall");
        pMoveF = document.querySelectorAll(".ramboRun");
        pTakeHitF = document.querySelectorAll(".ramboTakeHit");
        pDeathF = document.querySelectorAll(".ramboDeath");
        pBlockF = document.querySelector(".ramboBlock");
    }else if(chosenCharacter === "law"){
        pIdle = document.querySelector(".lawIdle");
        pAttackF = document.querySelectorAll(".lawAttack");
        pFallF = document.querySelector(".lawFall");
        pMoveF = document.querySelectorAll(".lawRun");
        pTakeHitF = document.querySelectorAll(".lawTakeHit");
        pDeathF = document.querySelectorAll(".lawDeath");
        pBlockF = document.querySelector(".lawBlock");
    }else if(chosenCharacter === "death"){
        pIdle = document.querySelector(".deathIdle");
        pAttackF = document.querySelectorAll(".deathAttack");
        pFallF = document.querySelector(".deathFall");
        pMoveF = document.querySelectorAll(".deathRun");
        pTakeHitF = document.querySelectorAll(".deathTakeHit");
        pDeathF = document.querySelectorAll(".deathDeath");
        pBlockF = document.querySelector(".deathBlock");
    }
    //LOAD FRAMES ENEMY
    if(chosenEnemy === "kenji"){
        eIdle = document.querySelector(".kenjiIdle");
        eAttackF =  document.querySelectorAll(".kenjiAttack");
        eFallF = document.querySelector(".kenjiFall");
        eMoveF = document.querySelectorAll(".kenjiRun");
        eTakeHitF = document.querySelectorAll(".kenjiTakeHit");
        eDeathF = document.querySelectorAll(".kenjiDeath");
        eBlockF = document.querySelector(".kenjiBlock");
        console.log("LOADED ENEMY kenji");
        
    }else if(chosenEnemy === "samurai"){
        eIdle = document.querySelector(".samuraiIdle");
        eAttackF =  document.querySelectorAll(".samuraiAttack");
        eFallF = document.querySelector(".samuraiFall");
        eMoveF = document.querySelectorAll(".samuraiRun");
        eTakeHitF = document.querySelectorAll(".samuraiTakeHit");
        eDeathF = document.querySelectorAll(".samuraiDeath");
        eBlockF = document.querySelector(".knightBlock");
        console.log("LOADED ENEMY samurai");
        
    }
    else if(chosenEnemy === "akaza"){
        eIdle = document.querySelector(".akazaIdle");
        eAttackF =  document.querySelectorAll(".akazaAttack");
        eFallF = document.querySelector(".akazaFall");
        eMoveF = document.querySelectorAll(".akazaRun");
        eTakeHitF = document.querySelectorAll(".akazaTakeHit");
        eDeathF = document.querySelectorAll(".akazaDeath");
        eBlockF = document.querySelector(".akazaBlock");
        console.log("LOADED ENEMY akaza");
    }
    else if(chosenEnemy === "knight"){
        eIdle = document.querySelector(".knightIdle");
        eAttackF =  document.querySelectorAll(".knightAttack");
        eFallF = document.querySelector(".knightFall");
        eMoveF = document.querySelectorAll(".knightRun");
        eTakeHitF = document.querySelectorAll(".knightTakeHit");
        eDeathF = document.querySelectorAll(".knightDeath");
        eBlockF = document.querySelector(".knightBlock");
        console.log("LOADED ENEMY knight");
    }
    else if(chosenEnemy === "anakin"){
        eIdle = document.querySelector(".anakinIdle");
        eAttackF =  document.querySelectorAll(".anakinAttack");
        eFallF = document.querySelector(".anakinFall");
        eMoveF = document.querySelectorAll(".anakinRun");
        eTakeHitF = document.querySelectorAll(".anakinTakeHit");
        eDeathF = document.querySelectorAll(".anakinDeath");
        eBlockF = document.querySelector(".anakinBlock");
        console.log("LOADED ENEMY anakin");
    }else if(chosenEnemy === "rambo"){
        eIdle = document.querySelector(".ramboIdle");
        eAttackF = document.querySelectorAll(".ramboAttack");
        eFallF = document.querySelector(".ramboFall");
        eMoveF = document.querySelectorAll(".ramboRun");
        eTakeHitF = document.querySelectorAll(".ramboTakeHit");
        eDeathF = document.querySelectorAll(".ramboDeath");
        eBlockF = document.querySelector(".ramboBlock");
    }else if(chosenEnemy === "law"){
        eIdle = document.querySelector(".lawIdle");
        eAttackF = document.querySelectorAll(".lawAttack");
        eFallF = document.querySelector(".lawFall");
        eMoveF = document.querySelectorAll(".lawRun");
        eTakeHitF = document.querySelectorAll(".lawTakeHit");
        eDeathF = document.querySelectorAll(".lawDeath");
        eBlockF = document.querySelector(".lawBlock");
    }else if(chosenEnemy === "death"){
        eIdle = document.querySelector(".deathIdle");
        eAttackF = document.querySelectorAll(".deathAttack");
        eFallF = document.querySelector(".deathFall");
        eMoveF = document.querySelectorAll(".deathRun");
        eTakeHitF = document.querySelectorAll(".deathTakeHit");
        eDeathF = document.querySelectorAll(".deathDeath");
        eBlockF = document.querySelector(".deathBlock");
    }
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    // Track keydown and keyup events
    window.addEventListener('keydown', (event) => {
        // console.log("Key Pressed: ", event.key);
        //lOWER CASE SO THAT IT WORKS FOR BOTH UPPER AND LOWER CASE KEYS
        if(event.key === "A" || event.key === "D" || event.key === "W" || event.key === "S"){
            keysPressed.add(event.key.toLowerCase());
        }
        // keysPressed.add(event.key);
        keysPressed.add(event.key);
    });
    window.addEventListener('keyup', (event) => {
        if(event.key === "A" || event.key === "D" || event.key === "W" || event.key === "S"){
            keysPressed.delete(event.key.toLowerCase());
        }
        // keysPressed.delete(event.key);
        keysPressed.delete(event.key);
    });

    // Start the game loop
    window.requestAnimationFrame(gameLoop);
    // Moving and Attacking Frame Interval
    setInterval(() => {
        if(player.isMoving){
            pMoveFCounter = (pMoveFCounter + 1) % (pMoveF.length);  
        }
        if(enemy.isMoving){
            eMoveFCounter = (eMoveFCounter + 1) % (eMoveF.length);  
        }
        if(enemy.isAttacking){
            eAttackFCounter = (eAttackFCounter+1) % (eAttackF.length);
        }
        if(player.isAttacking){
            pAttackFCounter = (pAttackFCounter+1) % (pAttackF.length);

        }
        
    }, 50);


    //Blocking Effect Frame Interval
    setInterval(() => {

            if(enemy.hasBlocked || player.hasBlocked){

                if(effectOrangeFCounter < 4){
                    effectOrangeFCounter++;
                    
                }else{
                    effectOrangeFCounter = 0;
                }
            }       
                
            
        }, 100);


    //Taking Hit Frame Interval
    setInterval(() => {
        if(player.isTakingHit){
            pTakeHitFCounter = (pTakeHitFCounter+1) % (pTakeHitF.length);
        }
        if(enemy.isTakingHit){
            eTakeHitFCounter = (eTakeHitFCounter+1) % (eTakeHitF.length);
        }
        if(player.isDead){
            if(pDeathFCounter < 5){
                pDeathFCounter++;
            }
        }
        if(enemy.isDead){
            if(eDeathFCounter < 5){
                eDeathFCounter++;
            }
        }
    }, 200);
    
    startCountdown();

    // Initial Cooldown
    player.dashCooldown = true;
    enemy.dashCooldown = true;
    setTimeout(() => {
        player.dashCooldown = false;
        enemy.dashCooldown = false;
        console.log("Initial Cool DOwn Ended!");
    }, globalCooldown);

    startCoolDown("player");
    startCoolDown("enemy");

}

function gameLoop(timeStamp) {
    // Clear the canvas for each frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    characterMovement(player, {
        left: 'a',
        right: 'd',
        attack: 's',
        jump: 'w',
        dash: ' ',
        block: "Shift"
    });
    characterMovement(enemy, {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        attack: 'ArrowDown',
        jump: 'ArrowUp',
        dash: 'Enter',
        block: "Backspace"
    });
    
    //Render BOTH
    playerDraw();
    enemyDraw();

    // drawEffect(effectOrangeF[0], player.effectBoxX-30, enemy.effectBoxY-40, "player");
    // drawEffect(effectOrangeF[0], enemy.effectBoxX, enemy.effectBoxY-40, "enemy");


    if(!winnerDeclared){
        checkHealth();   
        getFlipped();
        getPlayerAttackBoxAndHitBox();
        getEnemyAttackBoxAndHitBox();
    }
        drawEffect(effectOrangeF[effectOrangeFCounter], player.effectBoxX, enemy.effectBoxY-40, "player");
        drawEffect(effectOrangeF[effectOrangeFCounter], enemy.effectBoxX, enemy.effectBoxY-40, "enemy");

    if(debug === true){
        debugPlayerAttackBoxAndHitBox();
        debugEnemyAttackBoxAndHitBox();
        for (let i = 0; i < 12; i++) { // Loop from 0 to 11
            hitBoxCords[i].style.display = "block";
        }
        playerHitBoxBox.style.display = "block";
        enemyHitBoxBox.style.display = "block";
        indicator.style.display = "block";
    }
    if(player.hasBlocked){
        drawEffect(effectOrangeF[effectOrangeFCounter], player.effectBoxX-30, enemy.effectBoxY-40, "player");
    }
    if(enemy.hasBlocked){
        drawEffect(effectOrangeF[effectOrangeFCounter], enemy.effectBoxX, enemy.effectBoxY-40, "enemy");
    }
    
    window.requestAnimationFrame(gameLoop); // Keep requesting new frames
}

function playerDraw(){
    if (player.isDead){
        drawDeath(pDeathF[pDeathFCounter],player.x,player.y,"player");
        return;
    }
    if (player.isAttacking){
        drawAttack(pAttackF[pAttackFCounter],player.x,player.y,"player"); 
    }
    if (player.isBlocking){
        drawBlock(pBlockF,player.x,player.y,"player"); 
    }
    if (player.isTakingHit && !player.isAttacking){
        drawTakeHit(pTakeHitF[pTakeHitFCounter],player.x,player.y,"player"); 
    }
    else if (player.isMoving && !player.isAttacking) {
        drawMove(pMoveF[pMoveFCounter],player.x,player.y,"player");
    } 
    else if (player.isFalling) {
        drawFall(pFallF,player.x,player.y,"player");
    } 
    else if(!player.isAttacking && !player.isFalling && !player.isMoving && !player.isDashing && !player.isDead && !player.isBlocking) { 
        drawIdle(pIdle,player.x,player.y,"player"); 
    }
}

function enemyDraw(){
    if (enemy.isDead) {
        drawDeath(eDeathF[eDeathFCounter],enemy.x,enemy.y,"enemy");
        return;
    }
    if (enemy.isAttacking){   
        drawAttack(eAttackF[eAttackFCounter],enemy.x,enemy.y,"enemy"); 
    }
    if (enemy.isBlocking){   
        drawBlock(eBlockF,enemy.x,enemy.y,"enemy"); 
    }
    if (enemy.isTakingHit && !enemy.isAttacking){
        drawTakeHit(eTakeHitF[eTakeHitFCounter],enemy.x,enemy.y,"enemy"); 
    }
    else if (enemy.isMoving && !enemy.isAttacking) {
        drawMove(eMoveF[eMoveFCounter],enemy.x,enemy.y,"enemy");
    } 
    else if (enemy.isFalling) {
        drawFall(eFallF,enemy.x,enemy.y,"enemy");
    } 
    else if(!enemy.isAttacking && !enemy.isFalling && !enemy.isMoving && !enemy.isDashing && !enemy.isDead && !enemy.isBlocking) { 
        drawIdle(eIdle,enemy.x,enemy.y,"enemy"); 
    }
}

function characterMovement(character, controls) {
    const { left, right, attack, jump, dash, block } = controls;
    if(!character.isDead){
        if (keysPressed.has(right) && character.hitBoxXR < borderRight && !character.playingAnimation) {
            character.x += 15;
        }
        if (keysPressed.has(left) && character.hitBoxXL > 0 && !character.playingAnimation) {
            character.x -= 15;
        }
        if (keysPressed.has(left) || keysPressed.has(right)) {
            character.isMoving = true;
        } else {
            character.isMoving = false;
        }
        if (keysPressed.has(left) && keysPressed.has(right)) {
            character.isMoving = false;
        }
        if (keysPressed.has(attack) && !character.playingAnimation && !character.isAttacking && !character.cooldown) {
            character.attack();
        }
        if (keysPressed.has(jump) && !character.isJumping && !character.isDashing){ 
            character.jump();
        }
        if (keysPressed.has(dash) && !character.isDashing &&!character.dashCooldown && !character.isAttacking) {
            character.dash();
        }
        if (keysPressed.has(block) && !character.isAttacking && !character.isDashing && !character.isFalling && !character.isMoving){
            if(!character.isBlocking){
                character.block();
                character.blockCounter--;
                console.log('character.blockCounter: ', character.blockCounter);
            }
        } else {
            character.isBlocking = false;
        }
    }
}

function checkHealth(){
    indicator.innerText = "Enemy:"+enemy.currentHealth+" Player:"+player.currentHealth+"\n"+ "Player:"+player.isFlipped+" Enemy:"+enemy.isFlipped;
    if(enemy.currentHealth <= 0 ){
        enemy.isDead = true;
        console.log("Enemy Dead");
        indicator.innerText = "Enemy Dead";
        healthBarEnemy.style.width = 0;   
        winnerDeclared = true;
        showResult("Player");
    }
    if(player.currentHealth <= 0){
        player.isDead = true;
        console.log("Player Dead");
        indicator.innerText = "Player Dead";
        healthBarPlayer.style.width = 0;   
        winnerDeclared = true;
        showResult("Enemy");
    }
    if(enemy.currentHealth === player.currentHealth && countdownDuration === 0){
        console.log('showResult: Tie');
        winnerDeclared = true;
        showResult("Tie");
    }
    if(enemy.currentHealth < player.currentHealth && countdownDuration === 0){
        winnerDeclared = true;
        showResult("Player");
    }
    if(player.currentHealth < enemy.currentHealth && countdownDuration === 0){
        winnerDeclared = true;
        showResult("Enemy");
    }
}

//Draw effect
function drawEffect(effectImg, x, y, name){
    console.log("Drawing Effect ");
    console.log(name);


    if(name === "enemy" && !enemy.isFlipped){
        context.save();
        context.translate(x-effectOffset, 0);
        // flip horizontally
        context.scale(-1, 1);
        context.drawImage(effectImg, -effectImg.width, y);
        context.restore();
    }else if(name === "enemy" && enemy.isFlipped ){
        context.drawImage(effectImg, enemy.hitBoxXR-effectOffset, y);
    }


    if(name === "player" && player.isFlipped){
        context.save();
        context.translate(x, 0);
        // flip horizontally
        context.scale(-1, 1);
        context.drawImage(effectImg, -effectImg.width+(effectOffset*3.7 ), y);
        context.restore();
    }else if(name === "player" && !player.isFlipped ){
        context.drawImage(effectImg, player.effectBoxX-effectOffset, y);
    }


}

//FLip when enemy calls this function
function drawIdle(charImg, x, y, name) {
    if(name === "enemy" && !enemy.isFlipped || name === "player" && player.isFlipped){
        context.save();
        context.translate(x + width, y);
        context.scale(-1, 1);
        context.drawImage(charImg, 0, 0, width, height);
        context.restore();
    }else{
        context.drawImage(charImg, x, y, width, height);
        
    }

}

function drawAttack(charAttack,x, y, name) {
    if(name === "enemy" && !enemy.isFlipped || name === "player" && player.isFlipped){
        context.save();
        context.translate(x + width, y);
        context.scale(-1, 1);
        context.drawImage(charAttack, 0, 0, width, height);
        context.restore();
    }else{
        context.drawImage(charAttack, x, y, width, height);
        
    }
}

function drawBlock(charBlock,x, y, name) {
    if(name === "enemy" && !enemy.isFlipped || name === "player" && player.isFlipped){
        context.save();
        context.translate(x + width, y);
        context.scale(-1, 1);
        context.drawImage(charBlock, 0, 0, width, height);
        context.restore();
    }else{
        context.drawImage(charBlock, x, y, width, height);
        
    }
}

function drawTakeHit(charTakeHit,x, y, name) {
    if(name === "enemy" && !enemy.isFlipped || name === "player" && player.isFlipped){
        context.save();
        context.translate(x + width, y);
        context.scale(-1, 1);
        context.drawImage(charTakeHit, 0, 0,width,height); // Draw the scaled image
        context.restore();
    }else{
        context.drawImage(charTakeHit, x, y,width,height); // Draw the scaled image
        
    }
}

function drawMove(charImgMove,x,y, name){
    if(name === "enemy" && !enemy.isFlipped || name === "player" && player.isFlipped){
        context.save();
        context.translate(x + width, y);
        context.scale(-1, 1);
        context.drawImage(charImgMove, 0, 0,width,height); // Draw the scaled image
        context.restore();
    }else{
        context.drawImage(charImgMove, x, y,width,height); // Draw the scaled image
        
    }
}

function drawFall(charFall,x,y, name){
    if(name === "enemy" && !enemy.isFlipped || name === "player" && player.isFlipped){
        context.save();
        context.translate(x + width, y);
        context.scale(-1, 1);
        context.drawImage(charFall, 0, 0,width,height); // Draw the scaled image
        context.restore();
    }else{
        context.drawImage(charFall, x, y,width,height); // Draw the scaled image
        
    }
}

function drawDeath(charDeath,x,y, name){
    if(name === "enemy" && !enemy.isFlipped || name === "player" && player.isFlipped){
        context.save();
        context.translate(x + width, y);
        context.scale(-1, 1);
        context.drawImage(charDeath, 0, 0,width,height); // Draw the scaled image
        context.restore();
    }else{
        context.drawImage(charDeath, x, y,width,height); // Draw the scaled image
        
    }
}

function getFlipped(){
    if(player.hitBoxCenter > enemy.hitBoxCenter){
        player.isFlipped = true;
        enemy.isFlipped = true;
    }else{
        player.isFlipped = false;
        enemy.isFlipped = false;
    }
}

function getPlayerAttackBoxAndHitBox(){
    
    //Left X
    player.hitBoxXL = Math.floor(player.x +(width/2.5));
    //Right X
    player.hitBoxXR = Math.floor(player.x+(width/1.75));
    //Top Y
    player.hitBoxYT = Math.floor(player.y+(height/2));
    //Bottom Y
    player.hitBoxYB = Math.floor(player.y+height);

    //Center
    player.hitBoxCenter = (player.hitBoxXL + player.hitBoxXR) / 2;        

    player.effectBoxX = player.hitBoxXR;
    player.effectBoxY = (player.hitBoxYB + player.hitBoxYT) / 2.25;

    player.attackRangeS = player.hitBoxXR ;
    player.attackRangeE = player.attackRangeS + (width/3);
    player.attackRangeT = player.hitBoxYT;
    player.attackRangeB = player.hitBoxYB;

    player.attackRange = Math.abs(player.attackRangeE - player.attackRangeS);
    
    //WHen flip
    if(player.isFlipped){
        player.attackRangeS = player.hitBoxXL - player.attackRange;
        player.attackRangeE = player.attackRangeS + (width/3);
    }

}

function getEnemyAttackBoxAndHitBox(){
    
    //Left X 
    enemy.hitBoxXL = Math.floor(enemy.x+(width/2.5));
    //Right X
    enemy.hitBoxXR = Math.floor(enemy.x+(width/1.75));
    //Top Y
    enemy.hitBoxYT = Math.floor(enemy.y+(height/2));
    //Bottom Y
    enemy.hitBoxYB = Math.floor(enemy.y+height);
    
    //Center
    enemy.hitBoxCenter = (enemy.hitBoxXL + enemy.hitBoxXR) / 2;

    enemy.effectBoxX = enemy.hitBoxXL;
    enemy.effectBoxY = (enemy.hitBoxYB + enemy.hitBoxYT) / 2.25;

    enemy.attackRangeS = enemy.hitBoxXL;
    enemy.attackRangeE = enemy.attackRangeS - (width/3);
    enemy.attackRangeT = enemy.hitBoxYT;
    enemy.attackRangeB = enemy.hitBoxYB;
    
    enemy.attackRange = Math.abs(enemy.attackRangeE - enemy.attackRangeS);
    
    //WHen flip
    if(enemy.isFlipped){
        enemy.attackRangeS = enemy.hitBoxXR + enemy.attackRange;
        enemy.attackRangeE = enemy.attackRangeS - (width/3);
    }
}

function debugPlayerAttackBoxAndHitBox(){
//Player AttackBox
context.lineWidth = "6";
context.strokeStyle = "green";
    
    context.strokeRect(player.attackRangeS,player.hitBoxYT,1,player.hitBoxYB-player.hitBoxYT);
    context.strokeRect(player.attackRangeE,player.hitBoxYT,1,player.hitBoxYB-player.hitBoxYT);
    context.strokeRect(player.attackRangeS,player.attackRangeT,player.attackRangeE-player.attackRangeS,1);
    context.strokeRect(player.attackRangeS,player.attackRangeB,player.attackRangeE-player.attackRangeS,1);

    //Player HitBox
    context.lineWidth = "6";
    context.strokeStyle = "green";

    //Left X
        context.strokeRect(player.hitBoxXL,player.y+(height/1.3), 1,1);
        hitBoxCords[7].style.top = player.y+(height/1.3)+"px";
        hitBoxCords[7].style.left = player.hitBoxXL+"px";
        hitBoxCords[7].innerText = player.hitBoxXL;
    
    // //Right X
        context.strokeRect(player.hitBoxXR,player.y+(height/1.3), 1,1);
        hitBoxCords[6].style.top = player.y+(height/1.3)+"px";
        hitBoxCords[6].style.left = player.hitBoxXR+"px";
        hitBoxCords[6].innerText = player.hitBoxXR;
        
    // //Top Y
        context.strokeRect(player.x+(width/2),player.hitBoxYT, 1,1);
        hitBoxCords[4].style.top = player.hitBoxYT+"px";
        hitBoxCords[4].style.left = player.x+(width/2)+"px";
        hitBoxCords[4].innerText = player.hitBoxYT;

    // //Bottom Y
        context.strokeRect((player.x+(width/2)),player.hitBoxYB, 1,1);
        hitBoxCords[5].style.top = player.hitBoxYB+"px";
        hitBoxCords[5].style.left = player.x+(width/2)+"px";
        hitBoxCords[5].innerText = player.hitBoxYB;
        
    // //Center
        context.lineWidth = "10";
        context.strokeStyle = "green";
        context.strokeRect(player.hitBoxCenter, (player.hitBoxYB + player.hitBoxYT)/2 , 1 ,1);
        hitBoxCords[8].style.top = (player.hitBoxYB + player.hitBoxYT)/2+"px";
        hitBoxCords[8].style.left = player.hitBoxCenter+"px";
        hitBoxCords[8].innerText = player.hitBoxCenter;
        
    // //Effectbox
        context.lineWidth = "10";
        context.strokeStyle = "blue";
        context.strokeRect(player.effectBoxX, player.effectBoxY, 1 ,1);
        hitBoxCords[10].style.top = player.effectBoxY+"px";
        hitBoxCords[10].style.left = player.effectBoxX+"px";
        

    playerHitBoxBox.innerText = "Left X:"+player.hitBoxXL+"\n"+"Right X:"+player.hitBoxXR+"\n"+"Top Y:"+player.hitBoxYT+"\n"+"Bottom Y:"+player.hitBoxYB+"\n"+"Center:"+player.hitBoxCenter+"\n" + "Attack Range:" +  (player.attackRangeS - player.attackRangeE);



    // context.lineWidth = "5";
    // context.strokeStyle = "blue";
    // context.strokeRect(player.x,player.y,width,height);



}

function debugEnemyAttackBoxAndHitBox(){
    //Enemy AttackBox
    context.lineWidth = "6";
    
    context.strokeStyle = "red";
    
    context.strokeRect(enemy.attackRangeS,enemy.hitBoxYT,1,enemy.hitBoxYB-enemy.hitBoxYT);
    context.strokeRect(enemy.attackRangeE,enemy.hitBoxYT,1,enemy.hitBoxYB-enemy.hitBoxYT);
    context.strokeRect(enemy.attackRangeS,enemy.attackRangeT,enemy.attackRangeE-enemy.attackRangeS,1);
    context.strokeRect(enemy.attackRangeS,enemy.attackRangeB,enemy.attackRangeE-enemy.attackRangeS,1);

    // eAttackRange.innerText = "Attack Range:"+"\n"+"X : "+enemy.attackRangeS +"-"+enemy.attackRangeE +" ("+(enemy.attackRangeS-enemy.attackRangeE)+")"+"\n"+"Y : "+enemy.attackRangeT+"-"+enemy.attackRangeB ;

    //Enemy HitBox    
        context.lineWidth = "6";
        context.strokeStyle = "blue";
    //Left X 
        context.strokeRect(enemy.hitBoxXL,enemy.y+(height/1.3), 1,1);
        hitBoxCords[2].style.top = enemy.y+(height/1.3)+"px";
        hitBoxCords[2].style.left = enemy.hitBoxXL+"px";
        hitBoxCords[2].innerText = enemy.hitBoxXL;
    // //Right X
        context.strokeRect(enemy.hitBoxXR,enemy.y+(height/1.3), 1,1);
        hitBoxCords[3].style.top = enemy.y+(height/1.3)+"px";
        hitBoxCords[3].style.left = enemy.hitBoxXR+"px";
        hitBoxCords[3].innerText = enemy.hitBoxXR;
        
    // //Top Y
        context.strokeRect(enemy.x+(width/2),enemy.hitBoxYT, 1,1);
        hitBoxCords[0].style.top = enemy.hitBoxYT+"px";
        hitBoxCords[0].style.left = enemy.x+(width/2)+"px";
        hitBoxCords[0].innerText = enemy.hitBoxYT;

    // //Bottom Y
        context.strokeRect((enemy.x+(width/2)),enemy.hitBoxYB, 1,1);
        hitBoxCords[1].style.top = enemy.hitBoxYB+"px";
        hitBoxCords[1].style.left = enemy.x+(width/2)+"px";
        hitBoxCords[1].innerText = enemy.hitBoxYB;

    // //Center
        context.lineWidth = "10";
        context.strokeStyle = "blue";
        context.strokeRect(enemy.hitBoxCenter, (enemy.hitBoxYB + enemy.hitBoxYT)/2 , 1 ,1);
        hitBoxCords[9].style.top = (enemy.hitBoxYB + enemy.hitBoxYT)/2+"px";
        hitBoxCords[9].style.left = enemy.hitBoxCenter+"px";
        hitBoxCords[9].innerText = enemy.hitBoxCenter;

    // //Effectbox
        context.lineWidth = "10";
        context.strokeStyle = "blue";
        context.strokeRect(enemy.effectBoxX, enemy.effectBoxY, 1 ,1);
        hitBoxCords[11].style.top = enemy.effectBoxY+"px";
        hitBoxCords[11].style.left = enemy.effectBoxX+"px";
        

        
    pEnemyHitBoxBox.innerText = "Left X:"+enemy.hitBoxXL+"\n"+"Right X:"+enemy.hitBoxXR+"\n"+"Top Y:"+enemy.hitBoxYT+"\n"+"Bottom Y:"+enemy.hitBoxYB+"\n"+"Center:"+enemy.hitBoxCenter+"\n" + "Attack Range:" +  (enemy.attackRangeS - enemy.attackRangeE);    


    // context.lineWidth = "5";
    // context.strokeStyle = "blue";
    // context.strokeRect(enemy.x,enemy.y,width,height);
}


function startCountdown(){
    const interval = setInterval(() => {
        countdownDuration--;

        // Update the display
        time.innerText = countdownDuration;

        // Stop the countdown when it reaches 0
        if (countdownDuration <= 0) {
            clearInterval(interval);
        }
    }, 1000);
}
function resetCoolDown(name) {
    console.log("Reset CoolDown:"+name);
    if(name === "player"){
        glareClassP.style.display = "none"; // Removes from layout
        specialBar1.style.transition = "width 0.1s linear";
        specialBar1.style.width = 0 + '%';
    }
    if(name === "enemy"){
        glareClassE.style.display = "none"; // Removes from layout
        specialBar2.style.transition = "width 0.1s linear";
        specialBar2.style.width = 0 + '%';
    }
}
function startCoolDown(name){
    console.log("Start CoolDown:"+name);
    if(name === "player"){
        specialBar1.style.transition = "width 10s linear";
        specialBar1.style.width = 100 + '%';
        setTimeout(() => {
            glareClassP.style.display = "block"; // Removes from layout
            player.dashCooldown = false; // Reset cooldown after 3 seconds
        }, globalCooldown);
    }
    if(name === "enemy"){
        specialBar2.style.transition = "width 10s linear";
        specialBar2.style.width = 100 + '%';
        setTimeout(() => {
            glareClassE.style.display = "block"; // Removes from layout
            enemy.dashCooldown = false; // Reset cooldown after 3 seconds
        }, globalCooldown);
    }
}
function showResult(winner){
    if(winner != "Tie"){
        resultIndicator.innerText = winner + "Won!";
        resultIndicator.style.display = "block";
        return;
    }
    if(countdownDuration === 0){
        resultIndicator.innerText = "I's a Tie!";
        resultIndicator.style.display = "block";

    }
}
function setScale() {
    if (window.innerWidth > 1300) {
        // return 4.75;
        return 5.4;
    // } else if (window.innerWidth > 1420 && window.innerWidth <= 1440) {
    //     return 4.7;
    // } else if (window.innerWidth > 1400 && window.innerWidth <= 1420) {
    //     return 4.65;
    // } else if (window.innerWidth > 1380 && window.innerWidth <= 1400) {
    //     return 4.6;
    // } else if (window.innerWidth > 1360 && window.innerWidth <= 1380) {
    //     return 4.55;
    // } else if (window.innerWidth > 1340 && window.innerWidth <= 1360) {
    //     return 4.5;
    // } else if (window.innerWidth > 1320 && window.innerWidth <= 1340) {
    //     return 4.45;
    // } else if (window.innerWidth > 1300 && window.innerWidth <= 1320) {
    //     return 4.4;
    } else if (window.innerWidth > 1280 && window.innerWidth <= 1300) {
        return 5.35;
    } else if (window.innerWidth > 1260 && window.innerWidth <= 1280) {
        return 5.2;
    } else if (window.innerWidth > 1240 && window.innerWidth <= 1260) {
        return 4.95;
    } else if (window.innerWidth > 1220 && window.innerWidth <= 1240) {
        return 4.85;
    } else if (window.innerWidth > 1200 && window.innerWidth <= 1220) {
        return 4.75;
    } else if (window.innerWidth > 1180 && window.innerWidth <= 1200) {
        return 4.65;
    } else if (window.innerWidth > 1160 && window.innerWidth <= 1180) {
        return 4.55;
    } else if (window.innerWidth > 1140 && window.innerWidth <= 1160) {
        return 4.45;
    } else if (window.innerWidth > 1120 && window.innerWidth <= 1140) {
        return 4.35;
    } else if (window.innerWidth > 1100 && window.innerWidth <= 1120) {
        return 4.25;
    } else if (window.innerWidth > 1080 && window.innerWidth <= 1100) {
        return 4.15;
    } else if (window.innerWidth > 1060 && window.innerWidth <= 1080) {
        return 4.1;
    } else if (window.innerWidth > 1040 && window.innerWidth <= 1060) {
        return 4.05;
    } else if (window.innerWidth > 1020 && window.innerWidth <= 1040) {
        return 4;
    } else if (window.innerWidth > 1000 && window.innerWidth <= 1020) {
        return 3.95;
    } else if (window.innerWidth > 980 && window.innerWidth <= 1000) {
        return 3.9;
    } else if (window.innerWidth > 960 && window.innerWidth <= 980) {
        return 3.85;
    } else if (window.innerWidth > 940 && window.innerWidth <= 960) {
        return 3.8;
    } else if (window.innerWidth > 900 && window.innerWidth <= 940) {
        return 3.6;
    } else if (window.innerWidth > 880 && window.innerWidth <= 900) {
        return 3.5;
    } else if (window.innerWidth > 860 && window.innerWidth <= 880) {
        return 3.4;
    } else if (window.innerWidth > 840 && window.innerWidth <= 860) {
        return 3.3;
    } else if (window.innerWidth > 820 && window.innerWidth <= 840) {
        return 3.25;
    } else if (window.innerWidth > 800 && window.innerWidth <= 820) {
        return 3.2;
    } else if (window.innerWidth > 780 && window.innerWidth <= 800) {
        return 3.15;
    } else if (window.innerWidth > 760 && window.innerWidth <= 780) {
        return 3;
    } else if (window.innerWidth > 740 && window.innerWidth <= 760) {
        return 2.95;
    } else if (window.innerWidth > 720 && window.innerWidth <= 740) {
        return 2.9;
    } else if (window.innerWidth > 700 && window.innerWidth <= 720) {
        return 2.85;
    } else if (window.innerWidth > 680 && window.innerWidth <= 700) {
        return 2.75;
    } else if (window.innerWidth > 660 && window.innerWidth <= 680) {
        return 2.7;
    } else if (window.innerWidth > 640 && window.innerWidth <= 660) {
        return 2.65;
    } else if (window.innerWidth > 620 && window.innerWidth <= 640) {
        return 2.6;
    } else if (window.innerWidth > 600 && window.innerWidth <= 620) {
        return 2.5;
    } else if (window.innerWidth > 580 && window.innerWidth <= 600) {
        return 2.4;
    } else if (window.innerWidth > 560 && window.innerWidth <= 580) {
        return 2.35;
    } else if (window.innerWidth > 540 && window.innerWidth <= 560) {
        return 2.3;
    } else if (window.innerWidth > 520 && window.innerWidth <= 540) {
        return 2.25;
    } else if (window.innerWidth > 500 && window.innerWidth <= 520) {
        return 2.15;
    } else if (window.innerWidth > 480 && window.innerWidth <= 500) {
        return 2.1;
    } else if (window.innerWidth > 460 && window.innerWidth <= 480) {
        return 2;
    } else if (window.innerWidth > 440 && window.innerWidth <= 460) {
        return 2;
    } else if (window.innerWidth > 420 && window.innerWidth <= 440) {
        return 1.95;
    } else if (window.innerWidth > 400 && window.innerWidth <= 420) {
        return 1.9;
    } else if (window.innerWidth > 380 && window.innerWidth <= 400) {
        return 1.85;
    } else if (window.innerWidth > 360 && window.innerWidth <= 380) {
        return 1.8;
    } else {
        return 1.75; // For anything below 360px
    }

}

