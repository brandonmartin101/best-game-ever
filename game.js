// Get canvas element and context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 700;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
const asteroids = [];
let asteroidWeight = 0.02;

// Create spaceship object
const spaceship = {
	x: 100,
	y: canvas.height / 2,
	speed: 7,
	width: 20,
	height: 20,
};

function gameLoop() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Move spaceship
	if (keys.up) spaceship.y -= spaceship.speed;
	if (keys.down) spaceship.y += spaceship.speed;
	if (keys.left) spaceship.x -= spaceship.speed;
	if (keys.right) spaceship.x += spaceship.speed;

	// Check boundaries
	if (spaceship.x > canvas.width) spaceship.x = canvas.width - spaceship.width;
	if (spaceship.x < 0) spaceship.x = spaceship.width;
	if (spaceship.y > canvas.height) spaceship.y = canvas.height - spaceship.height;
	if (spaceship.y < 0) spaceship.y = spaceship.height;

	// Draw spaceship
	context.strokeStyle = '#eee';
	context.lineWidth = 3;
	context.beginPath();
	context.moveTo(spaceship.x - spaceship.width / 2, spaceship.y + spaceship.height / 2);
	context.lineTo(spaceship.x + spaceship.width / 2, spaceship.y);
	context.lineTo(spaceship.x - spaceship.width / 2, spaceship.y - spaceship.height / 2);
	context.stroke();
	context.strokeStyle = '#eee';
	context.beginPath();
	context.moveTo(spaceship.x - spaceship.width / 2, spaceship.y + spaceship.height / 2 - 4);
	context.lineTo(spaceship.x + spaceship.width / 2 - 8, spaceship.y);
	context.lineTo(spaceship.x - spaceship.width / 2, spaceship.y - spaceship.height / 2 + 4);
	context.stroke();
	context.strokeStyle = '#eee';
	context.beginPath();
	context.moveTo(spaceship.x - spaceship.width / 2, spaceship.y + spaceship.height / 2 - 8);
	context.lineTo(spaceship.x + spaceship.width / 2 - 16, spaceship.y);
	context.lineTo(spaceship.x - spaceship.width / 2, spaceship.y - spaceship.height / 2 + 8);
	context.stroke();

	// Spawn new asteroid
	if (Math.random() < asteroidWeight) {
		const asteroid = {
			x: canvas.width,
			y: Math.random() * canvas.height,
			speed: Math.random() * 5 + 2,
			radius: Math.random() * 30 + 10,
		};
		asteroids.push(asteroid);
	}

	// Move asteroids
	asteroids.forEach((asteroid, index) => {
		asteroid.x -= asteroid.speed;
		// Check for collision
		// const dx = asteroid.x - (spaceship.x + spaceship.width / 2);
		// const dy = asteroid.y - (spaceship.y + spaceship.height);
		// const distance = Math.sqrt(dx ** 2 + dy ** 2);
		// if (distance < asteroid.radius + spaceship.width / 2) {
		const distance1 = Math.sqrt((asteroid.x - spaceship.x + spaceship.width / 2) ** 2 + (asteroid.y - spaceship.y) ** 2);
		const distance2 = Math.sqrt((asteroid.x - spaceship.x - spaceship.width / 2) ** 2 + (asteroid.y - spaceship.y + spaceship.height / 2) ** 2);
		const distance3 = Math.sqrt((asteroid.x - spaceship.x - spaceship.width / 2) ** 2 + (asteroid.y - spaceship.y - spaceship.height / 2) ** 2);
		if (Math.min(distance1, distance2, distance3) < asteroid.radius) {
			// Collision detected, reset game
			asteroids.length = 0;
			score = 0;
			asteroidWeight = 0.02;
			spaceship.y = canvas.height / 2;
			localStorage.setItem('highScore', highScore);
			return;
		}

		// Draw asteroid
		context.fillStyle = '#fa0';
		context.beginPath();
		context.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
		context.fill();

		// Remove asteroid if off screen
		if (asteroid.x + asteroid.radius < 0) {
			asteroids.splice(index, 1);
		}
	});

	// Calculate and draw score
	score++;
	if (score > highScore) highScore = score;
	context.fillStyle = '#eee';
	context.font = '18px Calibri';
	context.fillText(`Score: ${score}    High Score: ${highScore}`, 10, 20);

	// Request next frame
	if (asteroidWeight < 0.2) asteroidWeight += 0.00005;
	requestAnimationFrame(gameLoop);
}

// Handle key events
const keys = {
	up: false,
	down: false,
	left: false,
	right: false,
};
document.addEventListener('keydown', (event) => {
	if (event.code === 'ArrowUp') keys.up = true;
	if (event.code === 'ArrowDown') keys.down = true;
	if (event.code === 'ArrowLeft') keys.left = true;
	if (event.code === 'ArrowRight') keys.right = true;
});
document.addEventListener('keyup', (event) => {
	if (event.code === 'ArrowUp') keys.up = false;
	if (event.code === 'ArrowDown') keys.down = false;
	if (event.code === 'ArrowLeft') keys.left = false;
	if (event.code === 'ArrowRight') keys.right = false;
});

gameLoop();
