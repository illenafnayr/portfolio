<template>
  <div :ref="draggable ? 'draggableContainer' : undefined" :id="`${id}-icon-container`" class="icon-container"
    :class="draggable ? undefined : 'icon-grid'">
    <div class="icon-header" @mousedown="dragMouseDown">
      <img :id="`${id}-icon-img`" :src="getImageUrl()" class="icon-img" :alt="name">
    </div>
    <span class="icon-body">{{ title }}</span>
  </div>
</template>

<script>

  // Shared state
  const placedIcons = [];
  
  export default {
    name: 'Icon',
    props: {
      name: String,
      filename: String,
      title: String,
      draggable: Boolean,
    },
    data() {
      return {
        positions: {
          clientX: undefined,
          clientY: undefined,
          movementX: 0,
          movementY: 0
        },
        id: this.name.split(' ').join('')
      }
    },
  
    mounted() {
      if (!this.draggable) return;
  
      const el = document.getElementById(`${this.id}-icon-container`);
  
      const ICON_RADIUS = 0.08;
      const MAX_ATTEMPTS = 200;
  
      const fixedPositions = {
        cli:      { x: 0.20, y: 0.25 },
        cfd:      { x: 0.30, y: 0.25 },
        airfoil:  { x: 0.40, y: 0.25 },
        resume:   { x: 0.55, y: 0.30 }
      };
  
      // Helpers
      const distance = (a, b) =>
        Math.hypot(a.x - b.x, a.y - b.y);
  
      const collides = (point, others, radius) =>
        others.some(o => distance(point, o) < radius);
  
      const random = (min, max) =>
        Math.random() * (max - min) + min;
  
      if (fixedPositions[this.id]) {
        const pos = fixedPositions[this.id];
  
        el.style.left = `${pos.x * 100}%`;
        el.style.top  = `${pos.y * 100}%`;
  
        placedIcons.push(pos);
        return;
      }
  
      const fixedPoints = Object.values(fixedPositions);
      let point = null;
  
      for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const candidate = {
          x: random(0.08, 0.92),
          y: random(0.15, 0.88)
        };
  
        if (collides(candidate, placedIcons, ICON_RADIUS)) continue;
        if (collides(candidate, fixedPoints, ICON_RADIUS * 1.3)) continue;
  
        point = candidate;
        break;
      }
  
      // Fallback
      if (!point) {
        point = { x: 0.5, y: 0.5 };
      }
  
      el.style.left = `${point.x * 100}%`;
      el.style.top  = `${point.y * 100}%`;
  
      placedIcons.push(point);
    },
  
    methods: {
      dragMouseDown(event) {
        if (!this.draggable) return;
        event.preventDefault();
        this.positions.clientX = event.clientX;
        this.positions.clientY = event.clientY;
        document.onmousemove = this.elementDrag;
        document.onmouseup = this.closeDragElement;
      },
      elementDrag(event) {
        event.preventDefault();
        this.positions.movementX = this.positions.clientX - event.clientX;
        this.positions.movementY = this.positions.clientY - event.clientY;
        this.positions.clientX = event.clientX;
        this.positions.clientY = event.clientY;
        this.$refs.draggableContainer.style.top =
          this.$refs.draggableContainer.offsetTop - this.positions.movementY + 'px';
        this.$refs.draggableContainer.style.left =
          this.$refs.draggableContainer.offsetLeft - this.positions.movementX + 'px';
      },
      closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      },
      getImageUrl() {
        return new URL(`../assets/${this.filename}`, import.meta.url).href;
      }
    }
  }
  </script>  

<style lang="scss">
@import '../styles/global.scss';
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.icon-container {
  position: absolute;
  z-index: 9;
  font-family: 'VT323', monospace;
  text-align: center;
  margin: 0%;
  padding: 0%;
}

.icon-container:active {
  background-color: blue;
  color: white;
}

.icon-header {
  cursor: move;
  z-index: 10;
  color: white;
}

.icon-body {
  font-size: 1.25rem;
  color: white;
}

.icon-img {
  height: 3.5rem;
}

.icon-grid {
  left: auto;
  top: auto;
  position: relative;
}
</style>
