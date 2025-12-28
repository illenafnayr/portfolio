<template>
  <div id="screen-saver-container">
    <div class="logo" :style="logoStyle">
      <div class="logo-text">Studio Fanelli</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScreenSaver",
  data() {
    return {
      position: { x: 100, y: 100 },
      velocity: { x: 2, y: 2 },
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
      currentColorIndex: 0,
      logoWidth: 200,
      logoHeight: 100,
      animationId: null
    };
  },
  computed: {
    currentColor() {
      return this.colors[this.currentColorIndex];
    },
    logoStyle() {
      return {
        left: this.position.x + 'px',
        top: this.position.y + 'px',
        backgroundColor: this.currentColor,
        fontFamily: '"VT323", monospace'
      };
    }
  },
  mounted() {
    this.animate();
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  },
  methods: {
    animate() {
      const container = document.getElementById('screen-saver-container');
      const maxX = container.clientWidth - this.logoWidth;
      const maxY = container.clientHeight - this.logoHeight;

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.position.x <= 0 || this.position.x >= maxX) {
        this.velocity.x *= -1;
        this.changeColor();
        this.position.x = Math.max(0, Math.min(this.position.x, maxX));
      }

      if (this.position.y <= 0 || this.position.y >= maxY) {
        this.velocity.y *= -1;
        this.changeColor();
        this.position.y = Math.max(0, Math.min(this.position.y, maxY));
      }

      this.animationId = requestAnimationFrame(this.animate);
    },
    changeColor() {
      this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#screen-saver-container {
  height: 100vh;
  width: 100vw;
  background-color: #000;
  position: relative;
  overflow: hidden;
}

.logo {
  position: absolute;
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  transition: background-color 0.3s ease;
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
}
</style>