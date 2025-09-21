// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameRunning = false;
let gameStarted = false;

// Game objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 3,
    reset: function() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
        this.speedY = (Math.random() - 0.5) * 6;
    }
};

const leftPaddle = {
    x: 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 7
};

const rightPaddle = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 7
};

// Score
let player1Score = 0;
let player2Score = 0;

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    
    // Start/pause game with spacebar
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted) {
            gameStarted = true;
            gameRunning = true;
            gameLoop();
        } else {
            gameRunning = !gameRunning;
            if (gameRunning) {
                gameLoop();
            }
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Update paddles based on input
function updatePaddles() {
    // Left paddle (Player 1) - W/S keys
    if (keys['w'] && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.speed;
    }
    if (keys['s'] && leftPaddle.y < canvas.height - leftPaddle.height) {
        leftPaddle.y += leftPaddle.speed;
    }
    
    // Right paddle (Player 2) - Arrow keys
    if (keys['arrowup'] && rightPaddle.y > 0) {
        rightPaddle.y -= rightPaddle.speed;
    }
    if (keys['arrowdown'] && rightPaddle.y < canvas.height - rightPaddle.height) {
        rightPaddle.y += rightPaddle.speed;
    }
}

// Update ball position and handle collisions
function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Top and bottom wall collisions
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.speedY = -ball.speedY;
    }
    
    // Left paddle collision
    if (ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
        ball.y >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height &&
        ball.speedX < 0) {
        ball.speedX = -ball.speedX;
        // Add some angle based on where the ball hits the paddle
        const hitPos = (ball.y - leftPaddle.y) / leftPaddle.height;
        ball.speedY = (hitPos - 0.5) * 10;
    }
    
    // Right paddle collision
    if (ball.x + ball.radius >= rightPaddle.x &&
        ball.y >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height &&
        ball.speedX > 0) {
        ball.speedX = -ball.speedX;
        // Add some angle based on where the ball hits the paddle
        const hitPos = (ball.y - rightPaddle.y) / rightPaddle.height;
        ball.speedY = (hitPos - 0.5) * 10;
    }
    
    // Score when ball goes off screen
    if (ball.x < 0) {
        player2Score++;
        updateScore();
        ball.reset();
    } else if (ball.x > canvas.width) {
        player1Score++;
        updateScore();
        ball.reset();
    }
}

// Update score display
function updateScore() {
    document.getElementById('player1Score').textContent = player1Score;
    document.getElementById('player2Score').textContent = player2Score;
}

// Render everything
function render() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    // Draw start message if game hasn't started
    if (!gameStarted) {
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2 + 50);
    } else if (!gameRunning) {
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED - Press SPACE to Resume', canvas.width / 2, canvas.height / 2 + 50);
    }
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    updatePaddles();
    updateBall();
    render();
    
    requestAnimationFrame(gameLoop);
}

// Initial render
render();