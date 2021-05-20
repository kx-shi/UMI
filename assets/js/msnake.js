// ** CODE DERIVED FROM https://github.com/AlanGuth/SnakeGameJS/blob/master/SnakeFuncionalSiteCorreto.html **//

//* Game setup *//
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = 'white';
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const GAME_SPEED = 500;

let snake = [
        { x: 150, y: 150},
        { x: 140, y: 150},
        { x: 130, y: 150},
        { x: 120, y: 150},
        { x: 110, y: 150}
    ]

let dx = 10; // horizontal velocity
let dy = 0; // vertical velocity

// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");

document.onkeydown = function(e) {
    changeDirection(e);
}

loop();

function loop() { // update game
    setTimeout(function onTick() {
        clearCanvas();
        advanceSnake();
        drawSnake();

        loop();
    }, GAME_SPEED)
}

function clearCanvas() {
    // Select the colour to fill the canvas
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    // Select the colour for the border of the canvas
    ctx.strokeStyle = CANVAS_BORDER_COLOUR;

    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a border around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

//* Functions for snake *//
function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function advanceSnake() {
    const head = {x: snake[0].x+dx, y: snake[0].y+dy};
    snake.unshift(head);
    snake.pop();
}

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
}
