<template>
	<div>
		<canvas id="mazeCanvas"></canvas>
		<div class="ui-overlay">

			<p class="instructions">Use W / A / S / D keys to move!</p>
			<p class="instructions">Find all of the Special walls with ducks on them, walk through them to turn them back to bricks. After finding all of them you win!</p>
			<button @click="goHome" class="back-button">Back to Home</button>
		</div>
	</div>
</template>

<script>
import { User } from './User';
import { useRouter } from 'vue-router';

export default {
	name: "MazeVue",
	setup() {
		const router = useRouter();

		const goHome = () => {
			router.push({ name: 'Home' });
		};

		return { goHome };
	},
	mounted() {
		const canvas = document.getElementById('mazeCanvas');
		const ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const user = new User(canvas.width, canvas.height, ctx);
		console.log(user);

		// Listen for WASD key presses
		window.addEventListener('keydown', (e) => {
			switch (e.key.toLowerCase()) {
				case 'w':
					user.moveUp();
					break;
				case 'a':
					user.moveLeft();
					break;
				case 's':
					user.moveDown();
					break;
				case 'd':
					user.moveRight();
					break;
			}
		});
	}
};
</script>

<style scoped>
body {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

#mazeCanvas {
	position: absolute;
	top: 0;
	left: 0;
}

.ui-overlay {
	position: absolute;
	top: 20px;
	right: 5%;
	z-index: 10;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	font-family: monospace;
	padding: 1rem 1.5rem;
	border-radius: 12px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
	gap: 0.75rem;
	/* space between children */
}

.instructions {
	font-size: 1rem;
	margin: 0;
	max-width: 200px;
	/* remove default margin */
	text-align: center;
}

.back-button {
	padding: 0.6rem 1.2rem;
	font-size: 1rem;
	font-weight: bold;
	background-color: #1e40af;
	color: white;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.back-button:hover {
	background-color: #1e3a8a;
	transform: translateY(-2px);
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>