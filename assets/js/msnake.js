// ** CODE DERIVED FROM https://github.com/AlanGuth/SnakeGameJS/blob/master/SnakeFuncionalSiteCorreto.html **//

//* Game setup *//
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = 'white';
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const STARTBTN = document.getElementById("startGame");
const TONEBTN = document.getElementById("tonebtn");
const WAVEBTN = document.getElementById("wavebtn");
const GAME_SPEED = 100;
const MAX_FREQ = 100;

//* Audio setup *//
const freqValue = document.getElementById("freqValue");
const SINETONE = document.getElementById("sinetone");
const SAWTONE = document.getElementById("sawtone");
const SINECHORD = document.getElementById("sinechord");
const SAWCHORD = document.getElementById("sawchord");
var isTone = true;
var isSine = true;

freqValue.addEventListener("change", (e) => {
    freqValue.setAttribute("value", currentFreq);
    console.log(freqValue.value);
});

SINETONE.addEventListener("change", (e) => {
    SINETONE.setAttribute("value", SINETONE.value);
});

SAWTONE.addEventListener("change", (e) => {
    SAWTONE.setAttribute("value", SAWTONE.value);
});

SINECHORD.addEventListener("change", (e) => {
    SINECHORD.setAttribute("value", SINECHORD.value);
});

SAWCHORD.addEventListener("change", (e) => {
    SAWCHORD.setAttribute("value", SAWCHORD.value);
});

let snake = [
        { x: 40, y: 0},
        { x: 30, y: 0},
        { x: 20, y: 0},
        { x: 10, y: 0},
        { x: 0, y: 0}
    ];

let dx = 10;    // horizontal velocity
let dy = 0;     // vertical velocity
let foodUpX;    // food pitch up x-coordinate
let foodUpY;    // food pitch up y-coordinate
let foodDownX;  // food pitch down x-coordinate
let foodDownY;  // food pitch down y-coordinate
let currentFreq = 50;   // initial frequency being played

// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");

document.onkeydown = function(e) { // listen to key-press events
    changeDirection(e);
};

// Initialize canvas
clearCanvas();

STARTBTN.addEventListener("click", function() {
    loop();                             // start game
    createFood();                       // create initial food
    
    // Initalize sound
    triggerEvent(freqValue, "change");
    changeSound();
});

function loop() { // update game
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        loop();
    }, GAME_SPEED)
};

function clearCanvas() {
    // Select the colour to fill the canvas
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    // Select the colour for the border of the canvas
    ctx.strokeStyle = CANVAS_BORDER_COLOUR;

    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a border around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
};

/**
 * Draw food on the canvas
 */
function drawFood() {
    ctx.fillStyle = 'yellow';
    ctx.strokestyle = 'darkgoldenrod';
    ctx.fillRect(foodDownX, foodDownY, 10, 10);
    ctx.strokeRect(foodDownX, foodDownY, 10, 10);

    ctx.fillStyle = 'red';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(foodUpX, foodUpY, 10, 10);
    ctx.strokeRect(foodUpX, foodUpY, 10, 10);
};

/**
 * Draw snake on the canvas
 */
function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
};

/**
 * Advance snake position
 */
function advanceSnake() {
    const head = {x: snake[0].x+dx, y: snake[0].y+dy};

    // if snake hits walls, wrap around
    if(head.x > gameCanvas.width - 10) {
        head.x = 0;
    }else if(head.x < 0) {
        head.x = gameCanvas.width - 10;
    }else if(head.y > gameCanvas.height - 10) {
        head.y = 0;
    }else if(head.y < 0) {
        head.y = gameCanvas.height - 10;
    }

    snake.unshift(head);
    snake.pop();

    const didEatFoodUp = snake[0].x === foodUpX && snake[0].y === foodUpY;
    const didEatFoodDown = snake[0].x === foodDownX && snake[0].y === foodDownY;
    if (didEatFoodUp) {
        currentFreq = getRandomFreq(currentFreq, MAX_FREQ);
        triggerEvent(freqValue, "change");
        createFood();
        console.log(currentFreq);
    }else if(didEatFoodDown) {
        currentFreq = getRandomFreq(0, currentFreq);
        triggerEvent(freqValue, "change");
        createFood();
        console.log(currentFreq);
    }
};

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if(keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }else if(keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }else if(keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }else if(keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
};

/**
 * Get random position for foor generation
 */
function getRandomPos(min, max) {
    return (Math.floor((Math.random() * (max-min) + min)/10) * 10 );
};

/**
 * Get random frequency
 */
function getRandomFreq(min, max) {
    return ( Math.floor((Math.random() * (max-min) + min)) );
};

/**
 * Create food
 */
function createFood() {
    foodUpX = getRandomPos(0, gameCanvas.width - 10);
    foodUpY = getRandomPos(0, gameCanvas.height - 10);
    foodDownX = getRandomPos(0, gameCanvas.width - 10);
    foodDownY = getRandomPos(0, gameCanvas.height - 10);

    snake.forEach(function isFoodOnSnake(snakePart) { // make sure we don't generate food on snake
        const foodIsOnSnake = (snakePart.x == foodUpX && snakePart.y == foodUpY);
        if(foodIsOnSnake) {
            createFood();
        }
    })
};

function triggerEvent(el, type) {
    // IE9+ and other modern browsers
    if ('createEvent' in document) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    } else {
        // IE8
        var e = document.createEventObject();
        e.eventType = type;
        el.fireEvent('on' + e.eventType, e);
    }
};

TONEBTN.addEventListener("click", function() {
    var currentHTML = TONEBTN.innerHTML;
    if(currentHTML == "tone") {
        TONEBTN.innerHTML = "chord";
        isTone = false;
    }else {
        TONEBTN.innerHTML = "tone";
        isTone = true;
    }
    changeSound();
});

WAVEBTN.addEventListener("click", function() {
    var currentHTML = WAVEBTN.innerHTML;
    if(currentHTML == "sine") {
        WAVEBTN.innerHTML = "sawtooth";
        isSine = false;
    }else {
        WAVEBTN.innerHTML = "sine";
        isSine = true;
    }
    changeSound();
});

function changeSound() {
    if(isTone && isSine) {
        SINETONE.value = 1;
        SAWTONE.value = 0;
        SINECHORD.value = 0;
        SAWCHORD.value = 0;
    }else if(isTone && !isSine) {
        SINETONE.value = 0;
        SAWTONE.value = 1;
        SINECHORD.value = 0;
        SAWCHORD.value = 0;
    }else if(!isTone && isSine) {
        SINETONE.value = 0;
        SAWTONE.value = 0;
        SINECHORD.value = 1;
        SAWCHORD.value = 0;
    }else {
        SINETONE.value = 0;
        SAWTONE.value = 0;
        SINECHORD.value = 0;
        SAWCHORD.value = 1;
    }
    triggerEvent(SINETONE, "change");
    triggerEvent(SAWTONE, "change");
    triggerEvent(SINECHORD, "change");
    triggerEvent(SAWCHORD, "change");
}
