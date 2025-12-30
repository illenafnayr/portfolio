<template>
  <div id="screen-saver-container">
    <div class="crt-overlay"></div>

    <div class="logo" :style="logoStyle">
      <div class="logo-inner">
        <div class="logo-text">Studio Fanelli</div>
      </div>
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
      colors: [
        '#00ffcc',
        '#ffcc00',
        '#ff6699',
        '#66ff66',
        '#66aaff'
      ],
      currentColorIndex: 0,
      logoWidth: 240,
        logoHeight: 120,
      animationId: null
    }
  },

  computed: {
    currentColor() {
      return this.colors[this.currentColorIndex]
    },

    logoStyle() {
      return {
        left: this.position.x + 'px',
        top: this.position.y + 'px',
        borderColor: this.currentColor,
        color: this.currentColor,
        boxShadow: `
          0 0 12px ${this.currentColor},
          inset 0 0 6px rgba(255,255,255,0.2)
        `,
        fontFamily: '"VT323", monospace'
      }
    }
  },

  mounted() {
    this.ensureWithinBounds()
    window.addEventListener('resize', this.onResize)
    this.animate()
  },

  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    animate() {
      const container = document.getElementById('screen-saver-container')
      const logoEl = container.querySelector('.logo')
      const logoW = logoEl ? logoEl.offsetWidth : this.logoWidth
      const logoH = logoEl ? logoEl.offsetHeight : this.logoHeight
      const maxX = Math.max(0, container.clientWidth - logoW)
      const maxY = Math.max(0, container.clientHeight - logoH)

      this.position.x += this.velocity.x
      this.position.y += this.velocity.y

      if (this.position.x <= 0 || this.position.x >= maxX) {
        this.velocity.x *= -1
        this.changeColor()
        this.position.x = Math.max(0, Math.min(this.position.x, maxX))
      }

      if (this.position.y <= 0 || this.position.y >= maxY) {
        this.velocity.y *= -1
        this.changeColor()
        this.position.y = Math.max(0, Math.min(this.position.y, maxY))
      }

      this.animationId = requestAnimationFrame(() => this.animate())
    },

    ensureWithinBounds() {
      const container = document.getElementById('screen-saver-container')
      if (!container) return
      const logoEl = container.querySelector('.logo')
      const logoW = logoEl ? logoEl.offsetWidth : this.logoWidth
      const logoH = logoEl ? logoEl.offsetHeight : this.logoHeight
      const maxX = Math.max(0, container.clientWidth - logoW)
      const maxY = Math.max(0, container.clientHeight - logoH)

      this.position.x = Math.max(0, Math.min(this.position.x, maxX))
      this.position.y = Math.max(0, Math.min(this.position.y, maxY))
    },

    onResize() {
      // Recalculate bounds and keep logo visible on viewport changes
      this.ensureWithinBounds()
    },

    changeColor() {
      this.currentColorIndex =
        (this.currentColorIndex + 1) % this.colors.length
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

/* RESET */
* {
  box-sizing: border-box;
}

#screen-saver-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: $color-background;
  opacity: 0.8;

  /* subtle pixel grid */
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 4px 4px;
}

/* CRT overlay */
.crt-overlay {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(0,0,0,0.15),
      rgba(0,0,0,0.15) 1px,
      transparent 1px,
      transparent 2px
    );
  z-index: 2;
}

/* LOGO FRAME */
.logo {
  position: absolute;
  width: min(60vw, 240px);
  aspect-ratio: 2 / 1;
  height: auto;

  border: 3px solid;
  background-color: #000;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1;
}

/* Inner bevel */
.logo-inner {
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  border: 2px solid;
  border-color: #444 #111 #111 #444;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* TEXT */
.logo-text {
  font-size: clamp(18px, 4vw, 32px);
  letter-spacing: 3px;
  text-transform: uppercase;

  text-shadow:
    0 0 6px currentColor,
    0 0 12px currentColor;
}
</style>
