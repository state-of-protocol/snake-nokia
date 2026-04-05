const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");

const gridSize = 20; // Ditingkatkan untuk skrin besar
let snake, direction, nextDirection, food, score, gameLoop;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
document.addEventListener("keydown", handleKeyDown);

function startGame() {
    resizeCanvas();
    const centerX = Math.floor(canvas.width / 2 / gridSize) * gridSize;
    const centerY = Math.floor(canvas.height / 2 / gridSize) * gridSize;
    
    snake = [
        {x: centerX, y: centerY},
        {x: centerX - gridSize, y: centerY},
        {x: centerX - (gridSize * 2), y: centerY}
    ];
    
    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    scoreElement.innerText = score;
    gameOverElement.classList.add("hidden");
    createFood();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, 80); // Laju sedikit untuk skrin besar
}

function update() {
    direction = nextDirection;
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= gridSize;
    if (direction === "DOWN") head.y += gridSize;
    if (direction === "LEFT") head.x -= gridSize;
    if (direction === "RIGHT") head.x += gridSize;

    // Check collisions (walls)
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) return gameOver();

    // Check collisions (self)
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return gameOver();
    }

    snake.unshift(head);

    if (Math.abs(head.x - food.x) < gridSize && Math.abs(head.y - food.y) < gridSize) {
        score += 10;
        scoreElement.innerText = score;
        createFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.fillStyle = "#9bbc0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "#0f380f";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = "#0f380f";
    ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

function handleKeyDown(e) {
    if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
    if (e.key === " " && !gameOverElement.classList.contains("hidden")) startGame();
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverElement.classList.remove("hidden");
}

startGame();
