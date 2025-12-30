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
    const desktop = document.getElementById('desktop');
    const desktopRect = desktop.getBoundingClientRect();
    const iconRect = el.getBoundingClientRect();

    const ICON_RADIUS = 0.08;
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

    // Clamp a candidate point to stay fully inside desktop
    const clampPixelPosition = (x, y) => {
      const left = Math.min(Math.max(0, x), desktopRect.width - iconRect.width);
      const top = Math.min(Math.max(0, y), desktopRect.height - iconRect.height);
      return { left, top };
    };

    if (fixedPositions[this.id]) {
      let posX = fixedPositions[this.id].x * desktopRect.width;
      let posY = fixedPositions[this.id].y * desktopRect.height;
      const clamped = clampPixelPosition(posX, posY);
      el.style.left = clamped.left + 'px';
      el.style.top = clamped.top + 'px';
      placedIcons.push({ x: clamped.left / desktopRect.width, y: clamped.top / desktopRect.height });
      return;
    }

    const fixedPoints = Object.values(fixedPositions).map(p => ({
      x: p.x * desktopRect.width,
      y: p.y * desktopRect.height
    }));

    let point = null;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const candidate = {
        x: random(0, desktopRect.width - iconRect.width),
        y: random(0, desktopRect.height - iconRect.height)
      };

      if (collides(candidate, placedIcons.map(p => ({ x: p.x * desktopRect.width, y: p.y * desktopRect.height })), ICON_RADIUS)) continue;
      if (collides(candidate, fixedPoints, ICON_RADIUS * 1.3 * desktopRect.width)) continue;

      point = candidate;
      break;
    }

    if (!point) point = { x: (desktopRect.width - iconRect.width) / 2, y: (desktopRect.height - iconRect.height) / 2 };

    el.style.left = point.x + 'px';
    el.style.top = point.y + 'px';
    placedIcons.push({ x: point.x / desktopRect.width, y: point.y / desktopRect.height });
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
