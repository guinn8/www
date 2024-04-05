// Game configuration
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const blockSize = 30;
const numResources = 3;
const levelTargets = [10, 15, 20];

// Game variables
let level = 0;
let resources = [0, 0, 0];
let miner = { x: 1, y: 1 };
let gameGrid = [];
let isSwinging = false;

// Disable arrow key scrolling
window.addEventListener('keydown', function(e) {
    if(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Move miner based on user input
    if (isKeyPressed('ArrowUp') && miner.y > 0) miner.y--;
    if (isKeyPressed('ArrowDown') && miner.y < gridSize - 1) miner.y++;
    if (isKeyPressed('ArrowLeft') && miner.x > 0) miner.x--;
    if (isKeyPressed('ArrowRight') && miner.x < gridSize - 1) miner.x++;

    // Check for block breaking
    if (isKeyPressed('Space') && !isSwinging) {
        isSwinging = true;
        const block = gameGrid[miner.y][miner.x];
        if (block !== ' ') {
            gameGrid[miner.y][miner.x] = ' ';
            resources[block]++;
        }
        setTimeout(() => {
            isSwinging = false;
        }, 300);
    }

    // Check if level complete
    if (resources.every((count, index) => count >= levelTargets[level])) {
        level++;
        if (level === levelTargets.length) {
            alert('Congratulations! You have completed all levels!');
            level = 0;
        }
        resources = [0, 0, 0];
        generateLevel();
    }
}

// Render game graphics
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game grid
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const block = gameGrid[y][x];
            ctx.fillText(block === ' ' ? '◻️' : ['💎', '💰', '⭐'][block], x * blockSize, y * blockSize);
        }
    }

    // Draw miner
    ctx.fillText(isSwinging ? '⛏️' : '👷‍♂️', miner.x * blockSize, miner.y * blockSize);

    // Draw resource counts
    ctx.fillText(`💎: ${resources[0]}/${levelTargets[level]}`, 10, canvas.height - 50);
    ctx.fillText(`💰: ${resources[1]}/${levelTargets[level]}`, 10, canvas.height - 30);
    ctx.fillText(`⭐: ${resources[2]}/${levelTargets[level]}`, 10, canvas.height - 10);
}

// Generate a new level
function generateLevel() {
    gameGrid = [];
    for (let y = 0; y < gridSize; y++) {
        gameGrid[y] = [];
        for (let x = 0; x < gridSize; x++) {
            gameGrid[y][x] = Math.random() < 0.2 ? Math.floor(Math.random() * numResources) : ' ';
        }
    }
    miner.x = 1;
    miner.y = 1;
}

// Check if a key is currently pressed
function isKeyPressed(key) {
    return keys[key];
}

// Keyboard event listeners
const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

// Start the game
generateLevel();
gameLoop();