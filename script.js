const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");
const gridSize = 10;
let snake = [{x: 50, y: 50}, {x: 40, y: 50}, {x: 30, y: 50}];
let direction = "RIGHT";
let nextDirection = "RIGHT";
let food = {x: 100, y: 100};
let score = 0;
let gameSpeed = 100;
let gameLoop;
document.addEventListener("keydown", handleKeyDown);
function startGame() {
    snake = [{x: 50, y: 50}, {x: 40, y: 50}, {x: 30, y: 50}];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    scoreElement.innerText = score;
    gameOverElement.classList.add("hidden");
    createFood();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}
function update() {
    direction = nextDirection;
    const head = { ...snake[0] };
    if (direction === "UP") head.y -= gridSize;
    if (direction === "DOWN") head.y += gridSize;
    if (direction === "LEFT") head.x -= gridSize;
    if (direction === "RIGHT") head.x += gridSize;
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) return gameOver();
    for (let part of snake) { if (head.x === part.x && head.y === part.y) return gameOver(); }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        createFood();
    } else { snake.pop(); }
    draw();
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f380f";
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize - 1, gridSize - 1));
    ctx.fillRect(food.x, food.y, gridSize - 1, gridSize - 1);
}
function createFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}
function handleKeyDown(e) {
    if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
    if (e.key === " " && !gameOverElement.classList.contains("hidden")) startGame();
}
function gameOver() { clearInterval(gameLoop); gameOverElement.classList.remove("hidden"); }
startGame();
