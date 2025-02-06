const spaceship = document.getElementById('spaceship');
const planet = document.getElementById('planet');
const scoreElement = document.getElementById('score');
const gameContainer = document.getElementById('game-container');
let spaceshipX = 0;
let spaceshipY = 0;
let score = 0;
let asteroidSpeed = 3;  
let asteroidSize = 50;  
let asteroids = [];
let gameOver = false;

function moveSpaceship(dx, dy) {
    spaceshipX = Math.min(Math.max(0, spaceshipX + dx), gameContainer.clientWidth - spaceship.offsetWidth);
    spaceshipY = Math.min(Math.max(0, spaceshipY + dy), gameContainer.clientHeight - spaceship.offsetHeight);
    spaceship.style.left = `${spaceshipX}px`;
    spaceship.style.top = `${spaceshipY}px`;
}

function createAsteroid() {
    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');
    asteroid.style.position = 'absolute';
    asteroid.style.width = `${asteroidSize}px`;
    asteroid.style.height = `${asteroidSize}px`;
    asteroid.style.backgroundColor = 'gray';
    asteroid.style.top = `${Math.random() * gameContainer.clientHeight}px`;
    asteroid.style.left = `${gameContainer.clientWidth}px`;
    gameContainer.appendChild(asteroid);

    function moveAsteroid() {
        const asteroidX = parseInt(asteroid.style.left);
        if (asteroidX <= 0) {
            asteroid.remove();
        } else {
            asteroid.style.left = `${asteroidX - asteroidSpeed}px`;
            if (checkCollision(asteroid)) {
                endGame();
            } else {
                requestAnimationFrame(moveAsteroid);
            }
        }
    }
    requestAnimationFrame(moveAsteroid);
    asteroids.push(asteroid);
}

function checkCollision(asteroid) {
    const asteroidRect = asteroid.getBoundingClientRect();
    const spaceshipRect = spaceship.getBoundingClientRect();
    return asteroidRect.left < spaceshipRect.right && asteroidRect.right > spaceshipRect.left &&
           asteroidRect.top < spaceshipRect.bottom && asteroidRect.bottom > spaceshipRect.top;
}

function endGame() {
    gameOver = true;
    alert(`Game Over! Tu puntuación fue: ${score}`);
    location.reload(); 
}

function showVictory() {
    gameOver = true;
    alert(`¡You Win! Puntuación: ${score}`);
    location.reload(); 
}

function updateScore() {
    score++;
    scoreElement.innerText = `Puntos: ${score}`;
}

document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    switch (event.key) {
        case 'ArrowUp':
            moveSpaceship(0, -10);
            break;
        case 'ArrowDown':
            moveSpaceship(0, 10);
            break;
        case 'ArrowLeft':
            moveSpaceship(-10, 0);
            break;
        case 'ArrowRight':
            moveSpaceship(10, 0);
            break;
    }
});

function checkWin() {
    const spaceshipRect = spaceship.getBoundingClientRect();
    const planetRect = planet.getBoundingClientRect();
    if (
        spaceshipRect.left < planetRect.right &&
        spaceshipRect.right > planetRect.left &&
        spaceshipRect.top < planetRect.bottom &&
        spaceshipRect.bottom > planetRect.top
    ) {
        showVictory();
    }
}


function gameLoop() {
    if (gameOver) return;
    updateScore();
    checkWin();  
    if (Math.random() < 0.03) {  
        createAsteroid();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
