const X = 'X'

export class Maze {
	constructor(width, height, ctx) {
		this.width = width;
		this.height = height;
		this.context = ctx;
		this.cellSize = 40; // base size
		this.scale = 0.3;

		// Maze definition
		this.maze = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		  
			[1,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,2,0,0,1],
			[1,0,X,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,2,0,0,1],
		  
			[1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1],
		  
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		  
			[1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1],
		  
			[1,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
		  
			[1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1],
		  
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		  
			[1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1],
		  
			[1,0,0,2,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,2,0,0,1],
			[1,0,0,2,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,2,0,0,1],
		  
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		  ];
		  

		this.userX = null;
		this.userY = null;

		this.init();
	}

	init() {
		this.drawMaze();
	}

	drawMaze() {
		const cellSize = this.cellSize * this.scale;

		for (let r = 0; r < this.maze.length; r++) {
			for (let c = 0; c < this.maze[r].length; c++) {
				const cell = this.maze[r][c];
				if (cell === 1) {
					this.context.fillStyle = 'black'; // wall
				} else if (cell === 2) {
					this.context.fillStyle = 'red'; // special wall
				} else if (cell === 0) {
					this.context.fillStyle = 'white'; // path
				} else if (cell === 'X') {
					this.context.fillStyle = 'white';
					// set player starting position
					this.userX = Math.round(c * this.cellSize + this.cellSize / 2);
					this.userY = Math.round(r * this.cellSize + this.cellSize / 2);
					// replace 'X' with 0 for path
					this.maze[r][c] = 0;
				}
				this.context.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
			}
		}
	}

	/**
	 * Check if the player reached a special wall (2)
	 * If so, turn it into a normal wall (1) and redraw maze
	 */
	checkSpecialWall(userX, userY) {
		const mazeX = Math.floor(userX / this.cellSize);
		const mazeY = Math.floor(userY / this.cellSize);

		if (this.maze[mazeY][mazeX] === 2) {
			this.maze[mazeY][mazeX] = 1; // convert to normal wall
			this.drawMaze(); // redraw
			return true; // special wall collected
		}
		return false;
	}


	// Optional update call (for consistency with User.js)
	update() {
		this.drawMaze();
	}
}
