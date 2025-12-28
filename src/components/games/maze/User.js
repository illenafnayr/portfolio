import { Maze } from "./Maze.js"
import brickTexture from '@/assets/bricks-texture.jpg';
import specialWallTexture from '@/assets/special-wall.png';
import winTexture from '@/assets/you-won.png';

export class User {
	constructor(width, height, ctx) {
		this.wallTexture = new Image();
		this.wallTexture.src = brickTexture;
		this.wallTextureLoaded = false;

		this.wallTexture.onload = () => {
			this.wallTextureLoaded = true;
			// Redraw the scene once texture is loaded
			if (this.context) {
				this.updatePlayer();
			}
		};

		this.specialWallTexture = new Image();
		this.specialWallTexture.src = specialWallTexture;
		this.specialWallTextureLoaded = false;

		this.specialWallTexture.onload = () => {
			this.specialWallTextureLoaded = true;
		};

		this.winTexture = new Image();
		this.winTexture.src = winTexture;
		this.winTextureLoaded = false;

		this.winTexture.onload = () => {
			this.winTextureLoaded = true;
		};
		this.remainingSpecialWalls = 0;
		this.hasWon = false;
		this.width = width > height ? Math.min(width, 1700) : Math.min(height, 1700);
		this.height = height > width ? height : width;
		this.context = ctx;
		this.maze = new Maze(this.width, this.height, ctx);
		this.userX = this.maze.userX;
		this.userY = this.maze.userY;
		this.mazeX = Math.floor(this.userX / this.maze.cellSize);
		this.mazeY = Math.floor(this.userY / this.maze.cellSize);
		this.color = 'yellow';
		this.speed = 15;
		this.diameter = 25;
		this.radius = this.diameter / 2;
		this.dx;
		this.dy;
		this.userAngle = Math.PI + 2 * (Math.PI / 2);
		this.FOV = this.toRadians(60);
		this.colors = {
			floor: "#FF5733",
			ceiling: "#FFFFFF",
			wall: "#3366FF",
			wallDark: "#003366",
			rays: "#FFA500",
			aux: 'yellow'
		}

		this.init();
	}
	init() {
		this.maze.init();
		this.userX = this.maze.userX;
		this.userY = this.maze.userY;
		this.maze.maze[this.mazeY][this.mazeX] = 0;
		this.dx = Math.cos(this.userAngle) * this.speed;
		this.dy = Math.sin(this.userAngle) * this.speed;
		this.addEventListeners();
		this.updatePlayer();
		this.remainingSpecialWalls = this.maze.maze.flat().filter(v => v === 2).length;
	}
	fixFishEye(distance, angle, userAngle) {
		const diff = angle - userAngle;
		return distance * Math.cos(diff);
	}
	renderScene(rays) {
		// Horizon is at eye level
		const horizon = this.height / 4;

		rays.forEach((ray, i) => {
			// Correct distance for fish-eye effect
			const distance = this.fixFishEye(ray.distance, ray.angle, this.userAngle);

			// Scale wall height proportionally to viewport
			const wallHeight = (this.maze.cellSize / distance) * this.height;

			// Draw ceiling
			this.context.fillStyle = this.colors.ceiling;
			this.context.fillRect(
				i,
				0,
				1,
				horizon - wallHeight / 2
			);

			// Draw wall with texture
			if (this.wallTextureLoaded) {
				// Calculate texture X coordinate based on hit position
				let textureX;
				if (ray.vertical) {
					// For vertical walls, use Y coordinate modulo cell size
					textureX = Math.floor(ray.hitY % this.maze.cellSize);
				} else {
					// For horizontal walls, use X coordinate modulo cell size
					textureX = Math.floor(ray.hitX % this.maze.cellSize);
				}

				// Normalize to texture width
				textureX = Math.floor((textureX / this.maze.cellSize) * this.wallTexture.width);

				// Apply darkening for different wall orientations
				if (ray.vertical) {
					this.context.globalAlpha = ray.aux ? 0.85 : 0.6;
				} else {
					this.context.globalAlpha = ray.aux ? 1 : 0.75;
				}


				let textureToUse = this.wallTexture;

				if (ray.aux && this.specialWallTextureLoaded && !this.hasWon) {
					textureToUse = this.specialWallTexture;
				}

				if (this.hasWon && this.winTextureLoaded) {
					textureToUse = this.winTexture;
				}

				this.context.drawImage(
					textureToUse,
					textureX, 0,
					1, textureToUse.height,
					i, horizon - wallHeight / 2,
					1, wallHeight
				);


				// Reset alpha
				this.context.globalAlpha = 1;
			} else {
				// Fallback to solid colors if texture not loaded
				this.context.fillStyle = ray.vertical
					? ray.aux ? 'yellow' : this.colors.wallDark
					: ray.aux ? 'green' : this.colors.wall;

				this.context.fillRect(
					i,
					horizon - wallHeight / 2,
					1,
					wallHeight
				);
			}

			// Draw floor
			this.context.fillStyle = this.colors.floor;
			this.context.fillRect(
				i,
				horizon + wallHeight / 2,
				1,
				this.height - (horizon + wallHeight / 2)
			);
		});
	}


	toRadians(degrees) {
		return degrees * (Math.PI / 180);
	}
	updatePlayer() {
		this.context.clearRect(0, 0, this.width, this.height);
		const rays = this.getRays()

		this.renderScene(rays);
		this.maze.drawMaze();
		this.drawPlayer();
		this.drawRays(rays);
	}
	drawPlayer() {
		this.context.beginPath();
		this.context.lineWidth = 1;
		this.context.arc(
			this.userX * this.maze.scale,
			this.userY * this.maze.scale,
			this.radius,
			0,
			2 * Math.PI,
			false
		);
		this.context.fillStyle = 'green';
		this.context.fill();

		this.context.strokeStyle = '#003300';
		this.context.stroke();

	}
	drawRays(rays) {
		this.context.strokeStyle = 'pink';
		this.context.lineWidth = 1;

		rays.forEach(ray => {
			this.context.beginPath();
			this.context.moveTo((this.userX + this.dx * 5) * this.maze.scale, (this.userY + this.dy * 5) * this.maze.scale);
			this.context.lineTo((this.userX + Math.cos(ray.angle) * ray.distance) * this.maze.scale, (this.userY + Math.sin(ray.angle) * ray.distance) * this.maze.scale);
			this.context.closePath();
			this.context.stroke();
		});
	}
	outOfMapBounds(x, y) {
		return x < 0 || x >= this.maze.maze[0].length || y < 0 || y >= this.maze.maze.length;
	}
	distance(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}
	getVCollision(angle) {
		const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);
		const firstX = right
			? Math.floor(this.userX / this.maze.cellSize) * this.maze.cellSize + this.maze.cellSize
			: Math.floor(this.userX / this.maze.cellSize) * this.maze.cellSize;

		const firstY = this.userY + (firstX - this.userX) * Math.tan(angle);
		const xA = right ? this.maze.cellSize : -this.maze.cellSize;
		const yA = xA * Math.tan(angle);
		let wall;
		let nextX = firstX;
		let nextY = firstY;
		let aux;
		while (!wall) {
			const cellX = right
				? Math.floor(nextX / this.maze.cellSize)
				: Math.floor(nextX / this.maze.cellSize) - 1;

			const cellY = Math.floor(nextY / this.maze.cellSize);
			if (this.outOfMapBounds(cellX, cellY)) {
				break;
			}
			wall = this.maze.maze[cellY] && this.maze.maze[cellY][cellX];
			if (wall === 2) {
				aux = true;
			}
			if (!wall) {
				nextX += xA;
				nextY += yA;
			}
		}
		return { angle, distance: this.distance(this.userX, this.userY, nextX, nextY), vertical: true, aux, hitX: nextX, hitY: nextY };
	}

	getHCollision(angle) {
		const up = Math.abs(Math.floor(angle / Math.PI) % 2);

		const firstY = up
			? Math.floor(this.userY / this.maze.cellSize) * this.maze.cellSize
			: Math.floor(this.userY / this.maze.cellSize) * this.maze.cellSize + this.maze.cellSize;

		const firstX = this.userX + (firstY - this.userY) / Math.tan(angle);

		const yA = up ? -this.maze.cellSize : this.maze.cellSize;
		const xA = yA / Math.tan(angle);

		let wall;
		let nextX = firstX;
		let nextY = firstY;
		let aux;

		while (!wall) {
			const cellX = Math.floor(nextX / this.maze.cellSize);
			const cellY = up
				? Math.floor(nextY / this.maze.cellSize) - 1
				: Math.floor(nextY / this.maze.cellSize);
			if (this.outOfMapBounds(cellX, cellY)) {
				break;
			}
			wall = this.maze.maze[cellY] && this.maze.maze[cellY][cellX];
			if (wall === 2) {
				aux = true;
			}
			if (!wall) {
				nextX += xA;
				nextY += yA;
			}
		}
		return { angle, distance: this.distance(this.userX, this.userY, nextX, nextY), vertical: false, aux, hitX: nextX, hitY: nextY };
	}
	castRay(angle) {
		const vCollision = this.getVCollision(angle);
		const hCollision = this.getHCollision(angle);
		return hCollision.distance >= vCollision.distance ? vCollision : hCollision;
	}
	getRays() {
		const initialAngle = this.userAngle - this.FOV / 2;
		const numberOfRays = this.maze.width;
		const angleStep = this.FOV / numberOfRays;

		return Array.from({ length: numberOfRays }, (_, i) => {
			const angle = initialAngle + i * angleStep;
			const ray = this.castRay(angle);
			return ray
		});
	}
	addEventListeners() {
		window.addEventListener('keydown', (event) => {
			if (event.key === 'w') {
				this.moveForward();
			}
			if (event.key === 'a') {
				this.lookLeft();
			}
			if (event.key === 'd') {
				this.lookRight();
			}
			if (event.key === 's') {
				this.moveBackward();
			}
		});
		// window.addEventListener('mousemove', this.throttle((event) => {
		// 	console.log(event)
		// 	const mouseX = this.toRadians(event.x) * 0.5
		// 	this.mouseLook(mouseX);
		// }, 10));
	}
	debounce(func, delay) {
		let timeoutId;

		return function (...args) {
			clearTimeout(timeoutId);

			timeoutId = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}
	throttle(func, delay) {
		let isThrottled = false;

		return function (...args) {
			if (!isThrottled) {
				func.apply(this, args);
				isThrottled = true;

				setTimeout(() => {
					isThrottled = false;
				}, delay);
			}
		};
	}
	moveForward() {
		const nextX = this.userX + Math.cos(this.userAngle) * this.speed;
		const nextY = this.userY + Math.sin(this.userAngle) * this.speed;
		const nextMazeX = Math.floor(nextX / this.maze.cellSize);
		const nextMazeY = Math.floor(nextY / this.maze.cellSize);

		if (
			nextMazeY >= 0 &&
			nextMazeY < this.maze.maze.length &&
			nextMazeX >= 0 &&
			nextMazeX < this.maze.maze[0].length &&
			this.maze.maze[nextMazeY][nextMazeX] !== 1
		) {
			this.userX = nextX;
			this.userY = nextY;

			// Check special wall
			if (this.maze.checkSpecialWall(this.userX, this.userY)) {
				console.log('Found a special wall!');
				this.remainingSpecialWalls--;

				if (this.remainingSpecialWalls === 0) {
					this.hasWon = true;
					this.showWinModal();
				}
			}
		}

		this.updatePlayer();
	}

	moveBackward() {
		const nextX = this.userX - Math.cos(this.userAngle) * this.speed;
		const nextY = this.userY - Math.sin(this.userAngle) * this.speed;
		const nextMazeX = Math.floor(nextX / this.maze.cellSize);
		const nextMazeY = Math.floor(nextY / this.maze.cellSize);

		if (
			nextMazeY >= 0 &&
			nextMazeY < this.maze.maze.length &&
			nextMazeX >= 0 &&
			nextMazeX < this.maze.maze[0].length &&
			this.maze.maze[nextMazeY][nextMazeX] !== 1
		) {
			this.userX = nextX;
			this.userY = nextY;

			if (this.maze.checkSpecialWall(this.userX, this.userY)) {
				console.log('Found a special wall!');
				this.remainingSpecialWalls--;

				if (this.remainingSpecialWalls === 0) {
					this.hasWon = true;
					this.showWinModal();
				}
			}
		}

		this.updatePlayer();
	}

	showWinModal() {
		// Create overlay
		const modal = document.createElement('div');
		modal.style.position = 'fixed';
		modal.style.top = 0;
		modal.style.left = 0;
		modal.style.width = '100%';
		modal.style.height = '100%';
		modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
		modal.style.display = 'flex';
		modal.style.alignItems = 'center';
		modal.style.justifyContent = 'center';
		modal.style.zIndex = 1000;

		// Create modal content
		const content = document.createElement('div');
		content.style.backgroundColor = 'white';
		content.style.padding = '2rem';
		content.style.borderRadius = '12px';
		content.style.textAlign = 'center';
		content.style.fontSize = '2rem';
		content.style.fontWeight = 'bold';
		content.innerText = '🎉 You Won! 🎉';

		modal.appendChild(content);
		document.body.appendChild(modal);

		// Optional: remove modal after 5 seconds
		setTimeout(() => {
			modal.remove();
		}, 5000);
	}


	mouseLook(dX) {
		this.updateIndex();

		if (
			this.mazeX >= 0 &&
			this.mazeX < this.maze.maze[0].length &&
			this.maze.maze[this.mazeY][this.mazeX] !== 1
		) {
			this.userAngle = dX;
			if (this.userAngle < 0) {
				this.userAngle += 2 * Math.PI;
			}
			this.dx = Math.cos(this.userAngle) * 5;
			this.dy = Math.sin(this.userAngle) * 5;
		}

		this.updatePlayer();
	}
	lookLeft() {
		this.updateIndex();

		if (
			this.mazeX >= 0 &&
			this.mazeX < this.maze.maze[0].length &&
			this.maze.maze[this.mazeY][this.mazeX] !== 1
		) {
			this.userAngle -= 0.1;
			if (this.userAngle < 0) {
				this.userAngle += 2 * Math.PI;
			}
			this.dx = Math.cos(this.userAngle) * 5;
			this.dy = Math.sin(this.userAngle) * 5;
		}

		this.updatePlayer();
	}
	lookRight() {
		this.updateIndex();

		if (
			this.mazeX >= 0 &&
			this.mazeX < this.maze.maze[0].length &&
			this.maze.maze[this.mazeY][this.mazeX] !== 1
		) {
			this.userAngle += 0.1;
			if (this.userAngle > 2 * Math.PI) {
				this.userAngle -= 2 * Math.PI;
			}
			this.dx = Math.cos(this.userAngle) * 5;
			this.dy = Math.sin(this.userAngle) * 5;
		}

		this.updatePlayer();
	}
	updateIndex() {
		const clearX = Math.floor(this.userX);
		const clearY = Math.floor(this.userY);
		const clearWidth = Math.ceil(this.diameter);
		const clearHeight = Math.ceil(this.diameter);
		this.context.clearRect(clearX, clearY, clearWidth, clearHeight);
		this.mazeX = Math.floor(this.userX / this.maze.cellSize);
		this.mazeY = Math.floor(this.userY / this.maze.cellSize);
	}
}