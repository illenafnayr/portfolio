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
export default {
  name: 'Icon',
  props: {
    name: String,
    filename: String,
    title: String,
    draggable: Boolean
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
    if (this.draggable) {
      // Fixed positions for specific icons
      const fixedPositions = {
        'cli': { left: '20%', top: '25%' },
        'cfd': { left: '30%', top: '25%' },
        'airfoil': { left: '40%', top: '25%' }
      };

      const pos = fixedPositions[this.id];
      if (pos) {
        const el = document.getElementById(`${this.id}-icon-container`);
        el.style.left = pos.left;
        el.style.top = pos.top;
      } else {
        // fallback to random for other icons
        const el = document.getElementById(`${this.id}-icon-container`);
        el.style.left = `${Math.floor(Math.random() * 90)}%`;
        el.style.top = `${Math.floor(Math.random() * 75)}%`;
      }
    }
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
