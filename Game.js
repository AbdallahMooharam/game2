const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dynamically resize the canvas based on window size
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;  // 90% of screen width
    canvas.height = window.innerHeight * 0.9; // 90% of screen height
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let snake = [{ x: 50, y: 50 }];
let direction = 'RIGHT';
let food = { x: 200, y: 200 };
let snakeSize = 10;
let speed = 100;

function drawSnake() {
    ctx.fillStyle = 'green';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

function moveSnake() {
    let head = Object.assign({}, snake[0]);

    if (direction === 'UP') head.y -= snakeSize;
    if (direction === 'DOWN') head.y += snakeSize;
    if (direction === 'LEFT') head.x -= snakeSize;
    if (direction === 'RIGHT') head.x += snakeSize;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = randomPosition();
    } else {
        snake.pop();
    }

    // Check for wall collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver();
    }

    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver();
        }
    }
}

function randomPosition() {
    const x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    const y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
    return { x, y };
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// Mobile controls using touch events
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    // Calculate movement direction
    if (Math.abs(touchEndX - touchStartX) > Math.abs(touchEndY - touchStartY)) {
        if (touchEndX > touchStartX) {
            if (direction !== 'LEFT') direction = 'RIGHT';
        } else {
            if (direction !== 'RIGHT') direction = 'LEFT';
        }
    } else {
        if (touchEndY > touchStartY) {
            if (direction !== 'UP') direction = 'DOWN';
        } else {
            if (direction !== 'DOWN') direction = 'UP';
        }
    }

    touchStartX = touchEndX;
    touchStartY = touchEndY;
});

setInterval(gameLoop, speed);

// Game over handling
function gameOver() {
    // Handle game over logic (e.g., showing message and restart button)
    alert('Game Over');
}
