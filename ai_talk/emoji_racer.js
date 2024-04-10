// Game configuration
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const canvasWidth = 900;
const canvasHeight = 600;
const trackWidth = 600;
const trackHeight = 5000;
const carWidth = 50;
const carHeight = 80;
const speed = 5;
const opponentSpeed = 3;
const powerUpDuration = 5000;

// Disable arrow key and spacebar scrolling
window.addEventListener('keydown', function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

// Player car
const playerCar = {
  x: canvasWidth / 2 - carWidth / 2,
  y: canvasHeight - carHeight - 10,
  width: carWidth,
  height: carHeight,
  speed: 0,
  powerUp: false,
  update: function() {
    if (keys.ArrowLeft && this.x > 0) {
      this.x -= speed;
    } else if (keys.ArrowRight && this.x < canvasWidth - carWidth) {
      this.x += speed;
    }
  },
  draw: function() {
    ctx.fillStyle = this.powerUp ? 'gold' : 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.font = '30px Arial';
    ctx.fillText('🚗', this.x + 10, this.y + 40);
  }
};

// Opponent cars
const opponentCars = [];
function createOpponentCar() {
  const car = {
    x: Math.random() * (canvasWidth - carWidth),
    y: -carHeight,
    width: carWidth,
    height: carHeight,
    speed: opponentSpeed,
    update: function() {
      this.y += this.speed;
    },
    draw: function() {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.font = '30px Arial';
      ctx.fillText('🚗', this.x + 10, this.y + 40);
    }
  };
  opponentCars.push(car);
}

// Obstacles
const obstacles = [];
function createObstacle() {
  const obstacle = {
    x: Math.random() * (trackWidth - 50) + (canvasWidth - trackWidth) / 2,
    y: -50,
    width: 50,
    height: 50,
    speed: opponentSpeed,
    update: function() {
      this.y += this.speed;
    },
    draw: function() {
      ctx.fillStyle = 'orange';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.font = '30px Arial';
      ctx.fillText('🛢️', this.x + 10, this.y + 35);
    }
  };
  obstacles.push(obstacle);
}

// Power-ups
const powerUps = [];
function createPowerUp() {
  const powerUp = {
    x: Math.random() * (trackWidth - 30) + (canvasWidth - trackWidth) / 2,
    y: -30,
    width: 30,
    height: 30,
    speed: opponentSpeed,
    update: function() {
      this.y += this.speed;
    },
    draw: function() {
      ctx.fillStyle = 'green';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.font = '20px Arial';
      ctx.fillText('⚡', this.x + 5, this.y + 20);
    }
  };
  powerUps.push(powerUp);
}

// Collision detection
function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// Keyboard input handling
const keys = {};
document.addEventListener('keydown', function(e) {
  keys[e.code] = true;
});
document.addEventListener('keyup', function(e) {
  keys[e.code] = false;
});

// Game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw track
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.strokeStyle = 'white';
  ctx.setLineDash([10, 10]);
  ctx.strokeRect((canvasWidth - trackWidth) / 2, 0, trackWidth, canvasHeight);

  // Update and draw player car
  playerCar.update();
  playerCar.draw();

  // Update and draw opponent cars
  opponentCars.forEach((car, index) => {
    car.update();
    car.draw();

    // Check collision with player car
    if (checkCollision(playerCar, car)) {
      if (playerCar.powerUp) {
        opponentCars.splice(index, 1);
      } else {
        alert('Game Over!');
        location.reload();
      }
    }

    // Remove opponent cars that are off the screen
    if (car.y > canvasHeight) {
      opponentCars.splice(index, 1);
    }
  });

  // Update and draw obstacles
  obstacles.forEach((obstacle, index) => {
    obstacle.update();
    obstacle.draw();

    // Check collision with player car
    if (checkCollision(playerCar, obstacle)) {
      if (playerCar.powerUp) {
        obstacles.splice(index, 1);
      } else {
        alert('Game Over!');
        location.reload();
      }
    }

    // Remove obstacles that are off the screen
    if (obstacle.y > canvasHeight) {
      obstacles.splice(index, 1);
    }
  });

  // Update and draw power-ups
  powerUps.forEach((powerUp, index) => {
    powerUp.update();
    powerUp.draw();

    // Check collision with player car
    if (checkCollision(playerCar, powerUp)) {
      playerCar.powerUp = true;
      powerUps.splice(index, 1);
      setTimeout(() => {
        playerCar.powerUp = false;
      }, powerUpDuration);
    }

    // Remove power-ups that are off the screen
    if (powerUp.y > canvasHeight) {
      powerUps.splice(index, 1);
    }
  });

  // Generate opponent cars, obstacles, and power-ups
  if (Math.random() < 0.02) {
    createOpponentCar();
  }
  if (Math.random() < 0.01) {
    createObstacle();
  }
  if (Math.random() < 0.005) {
    createPowerUp();
  }

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();