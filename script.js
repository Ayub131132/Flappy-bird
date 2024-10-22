const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.4, velocity: 0 }; // Decreased gravity
let pipes = [];
let pipeWidth = 40;
let pipeGap = 100;
let pipeSpeed = 2;
let gameStarted = false;
let gameOver = false;
let score = 0;
let animationFrame;

const birdImage = new Image();
birdImage.src = 'https://raw.githubusercontent.com/CodeExplainedRepo/FlappyBird-JavaScript/master/images/bird.png';

// Start game function
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        bird.velocity = -6; // Adjust jump strength for a slower ascent
        loop();
    }
}

// Main game loop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    // Apply gravity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Create pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        let pipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({ x: canvas.width, y: pipeHeight });
    }

    // Draw pipes
    pipes.forEach((pipe, index) => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height);

        pipe.x -= pipeSpeed;

        // Check for collisions
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
        ) {
            endGame();
        }

        // Remove pipes that go off screen and increase score
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });

    // Check if bird hits the boundaries
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }

    // Update score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (!gameOver) {
        animationFrame = requestAnimationFrame(loop);
    }
}

// End game function
function endGame() {
    gameOver = true;
    cancelAnimationFrame(animationFrame);
    document.getElementById('scoreDisplay').innerText = score;
    document.getElementById('gameOverPopup').style.display = 'block';
}

// Retry game function
function retryGame() {
    bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.4, velocity: 0 }; // Reset gravity
    pipes = [];
    score = 0;
    gameStarted = false;
    gameOver = false;
    document.getElementById('gameOverPopup').style.display = 'none';
    loop();
}

// Event listener for click
canvas.addEventListener('click', function() {
    if (gameOver) return;
    bird.velocity = -6; // Jump strength when clicking
    startGame();
});