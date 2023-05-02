// Get canvas element and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Create spaceship object
const spaceship = {
	x: 100,
	y: canvas.height / 2,
	speed: 5,
	width: 50,
	height: 50,
};

// Create asteroid array
const asteroids = [];

// Create score variable
let score = 0;

// Create game loop
function gameLoop() {
	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Move spaceship
	if (keys.up) {
		spaceship.y -= spaceship.speed;
	} else if (keys.down) {
		spaceship.y += spaceship.speed;
	}

	// Draw spaceship
	ctx.fillStyle = '#eee';
	ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

	// Spawn new asteroid
	if (Math.random() < 0.02) {
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

		// Check for collision with spaceship
		const dx = asteroid.x - (spaceship.x + spaceship.width / 2);
		const dy = asteroid.y - (spaceship.y + spaceship.height / 2);
		const distance = Math.sqrt(dx ** 2 + dy ** 2);
		if (distance < asteroid.radius + spaceship.width / 2) {
			// Collision detected, reset game
			asteroids.length = 0;
			score = 0;
			spaceship.y = canvas.height / 2;
			return;
		}

		// Draw asteroid
		ctx.fillStyle = '#FF0000';
		ctx.beginPath();
		ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
		ctx.fill();

		// Remove asteroid if off screen
		if (asteroid.x + asteroid.radius < 0) {
			asteroids.splice(index, 1);
			score++;
		}
	});

	// Draw score
	ctx.fillStyle = '#eee';
	ctx.font = '24px Arial';
	ctx.fillText(`Score: ${score}`, 10, 30);

	// Request next frame
	requestAnimationFrame(gameLoop);
}

// Handle key events
const keys = {
	up: false,
	down: false,
};

document.addEventListener('keydown', (event) => {
	switch (event.code) {
		case 'ArrowUp':
			keys.up = true;
			break;
		case 'ArrowDown':
			keys.down = true;
			break;
	}
});

document.addEventListener('keyup', (event) => {
	switch (event.code) {
		case 'ArrowUp':
			keys.up = false;
			break;
		case 'ArrowDown':
			keys.down = false;
			break;
	}
});

// Start game loop
gameLoop();
