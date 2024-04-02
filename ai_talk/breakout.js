// Get the canvas element
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game variables
let paddle, ball, bricks, score, lives, level;

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 10;
const paddleSpeed = 5;

// Ball properties
const ballRadius = 5;
const ballSpeed = 3;

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 70;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Initialize the game
function init() {
  paddle = {
    x: (canvas.width - paddleWidth) / 2,
    y: canvas.height - paddleHeight - 10,
    width: paddleWidth,
    height: paddleHeight,
    dx: 0
  };

  ball = {
    x: canvas.width / 2,
    y: paddle.y - ballRadius,
    radius: ballRadius,
    speed: ballSpeed,
    dx: ballSpeed,
    dy: -ballSpeed
  };

  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  score = 0;
  lives = 3;
  level = 1;
}

// Draw the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// Draw the bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Draw the score
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// Draw the lives
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// Draw the level
function drawLevel() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Level: ${level}`, canvas.width / 2 - 20, 20);
}

// Move the paddle
function movePaddle() {
  paddle.x += paddle.dx;

  // Keep the paddle within the canvas bounds
  if (paddle.x < 0) {
    paddle.x = 0;
  } else if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
}

// Move the ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Collision detection with walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.radius > canvas.height) {
    lives--;
    if (lives === 0) {
      alert('Game Over');
      document.location.reload();
    } else {
      resetBall();
    }
  }

  // Collision detection with paddle
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width &&
    ball.y > paddle.y &&
    ball.y < paddle.y + paddle.height
  ) {
    ball.dy = -ball.dy;
  }

  // Collision detection with bricks
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brickWidth &&
          ball.y > brick.y &&
          ball.y < brick.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            level++;
            if (level === 4) {
              alert('You Win!');
              document.location.reload();
            } else {
              resetBricks();
              resetBall();
              increaseDifficulty();
            }
          }
        }
      }
    }
  }
}

// Reset the ball position
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = paddle.y - ballRadius;
  ball.dx = ballSpeed;
  ball.dy = -ballSpeed;
}

// Reset the bricks
function resetBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
    }
  }
}

// Increase the difficulty
function increaseDifficulty() {
  ball.speed += 0.5;
  paddle.width -= 10;
}

// Keyboard event listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Keyboard event handlers
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddleSpeed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddleSpeed;
  }
}

function keyUpHandler(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

// Mouse event listener
document.addEventListener('mousemove', mouseMoveHandler, false);

// Mouse event handler
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
}

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  drawLives();
  drawLevel();
  movePaddle();
  moveBall();
  requestAnimationFrame(draw);
}

// Start the game
init();
draw();