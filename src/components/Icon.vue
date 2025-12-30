<template>
  <div :ref="draggable ? 'draggableContainer' : undefined" :id="`${id}-icon-container`" class="icon-container"
    :class="draggable ? undefined : 'icon-grid'">
    <div class="icon-header" @mousedown="dragMouseDown" @touchstart="dragMouseDown">
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
    const desktop = document.getElementById('desktop');
    const desktopRect = desktop.getBoundingClientRect();
    const iconRect = el.getBoundingClientRect();

    // Get NavBar height to exclude it from available space
    const navBar = document.getElementById('navbar');
    const navBarHeight = navBar ? navBar.getBoundingClientRect().height : 37; // Fallback to 37px (35px + 2px border)

    const ICON_RADIUS = Math.max(iconRect.width, iconRect.height) * 1.5;
    const MAX_ATTEMPTS = 200;

    const fixedPositions = {
      cli: { x: 0.20, y: 0.23 },
      cfd: { x: 0.30, y: 0.23 },
      airfoil: { x: 0.40, y: 0.23 },
      resume: { x: 0.30, y: 0.51 },
      portfolio: { x: 0.37, y: 0.51 },
    };

    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const collides = (point, others, radius) => others.some(o => distance(point, o) < radius);
    const random = (min, max) => Math.random() * (max - min) + min;

    // Clamp position to stay within desktop bounds and above NavBar
    const clampPixelPosition = (x, y) => {
      const maxHeight = desktopRect.height - navBarHeight - iconRect.height;
      const left = Math.min(Math.max(0, x), desktopRect.width - iconRect.width);
      const top = Math.min(Math.max(0, y), maxHeight);
      return { left, top };
    };

    if (fixedPositions[this.id]) {
      let posX = fixedPositions[this.id].x * desktopRect.width;
      let posY = fixedPositions[this.id].y * desktopRect.height;
      const clamped = clampPixelPosition(posX, posY);
      el.style.left = clamped.left + 'px';
      el.style.top = clamped.top + 'px';
      placedIcons.push({ x: clamped.left, y: clamped.top });
      return;
    }

    // Convert fixed positions to pixel coordinates for collision detection
    const fixedPoints = Object.values(fixedPositions).map(p => {
      const px = p.x * desktopRect.width;
      const py = p.y * desktopRect.height;
      const clamped = clampPixelPosition(px, py);
      return { x: clamped.left, y: clamped.top };
    });

    let point = null;
    const maxHeight = desktopRect.height - navBarHeight - iconRect.height;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const candidate = {
        x: random(0, desktopRect.width - iconRect.width),
        y: random(0, maxHeight)
      };

      // Check collision with already placed icons
      if (collides(candidate, placedIcons, ICON_RADIUS)) continue;

      // Check collision with fixed position icons
      if (collides(candidate, fixedPoints, ICON_RADIUS)) continue;

      point = candidate;
      break;
    }

    // Fallback to center if no valid position found
    if (!point) {
      point = {
        x: (desktopRect.width - iconRect.width) / 2,
        y: Math.min((desktopRect.height - iconRect.height) / 2, maxHeight)
      };
    }

    el.style.left = point.x + 'px';
    el.style.top = point.y + 'px';
    placedIcons.push({ x: point.x, y: point.y });
  },

  methods: {
    dragMouseDown(event) {
      if (!this.draggable) return;
      const touch = event.touches && event.touches.length ? event.touches[0] : null;
      const target = touch ? touch.target : (event.target || event.srcElement);
      if (target && target.closest && target.closest('.close')) return;
      event.preventDefault();
      const client = touch || event;
      this.positions.clientX = client.clientX;
      this.positions.clientY = client.clientY;
      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
      document.ontouchmove = this.elementDrag;
      document.ontouchend = this.closeDragElement;
    },
    elementDrag(event) {
      event.preventDefault();
      const client = event.touches ? event.touches[0] : event;
      this.positions.movementX = this.positions.clientX - client.clientX;
      this.positions.movementY = this.positions.clientY - client.clientY;
      this.positions.clientX = client.clientX;
      this.positions.clientY = client.clientY;

      // Get NavBar height - CRITICAL for mobile
      const navBar = document.getElementById('navbar');
      const navBarHeight = navBar ? navBar.offsetHeight : 37;

      // Get icon dimensions
      const iconWidth = this.$refs.draggableContainer.offsetWidth;
      const iconHeight = this.$refs.draggableContainer.offsetHeight;

      // Use window dimensions for reliable boundaries on mobile
      const viewportWidth = window.visualViewport.width;
      const viewportHeight = window.visualViewport.height;

      // Calculate new position
      let newTop = this.$refs.draggableContainer.offsetTop - this.positions.movementY;
      let newLeft = this.$refs.draggableContainer.offsetLeft - this.positions.movementX;

      // STRICT CLAMPING - icons must stay above NavBar and within screen
      const maxWidth = viewportWidth - iconWidth;
      const maxHeight = viewportHeight - navBarHeight - iconHeight - 50;

      // Clamp with explicit boundaries
      if (newLeft < 0) newLeft = 0;
      if (newLeft > maxWidth) newLeft = maxWidth;
      if (newTop < 0) newTop = 0;
      if (newTop > maxHeight) newTop = maxHeight;

      this.$refs.draggableContainer.style.top = newTop + 'px';
      this.$refs.draggableContainer.style.left = newLeft + 'px';
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchmove = null;
      document.ontouchend = null;
    },
    getImageUrl() {
      return `/images/${this.filename}`;
    }
  }
}
</script>

<style lang="scss">
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