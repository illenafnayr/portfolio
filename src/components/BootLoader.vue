<template>
  <div class="boot-screen" v-if="active">
    <pre class="boot-text">{{ displayedText }}</pre>
  </div>
</template>

<script>
export default {
  name: "BootLoader",
  props: {
    active: Boolean,
    minDuration: { type: Number, default: 2000 }
  },
  data() {
    return {
      fullText: `STUDIO FANELLI OS v1.0.3

BIOS Version 2024.12
Detecting hardware...
CPU: Intel Core i7-13700K @ 3.40GHz
RAM: 32768 MB OK
GPU: NVIDIA GeForce RTX 4070 Ti

Loading kernel modules................ [OK]
Initializing system services.......... [OK]
Mounting file systems................. [OK]
Starting network subsystem............ [OK]
Loading mesh geometry: 2.4M cells..... [OK]
Initializing solver routines.......... [OK]
Loading user interface................ [OK]

System ready.`,
      displayedText: "",
      currentIndex: 0
    }
  },
  mounted() {
    // Start animation if active on mount
    if (this.active) {
      this.startAnimation();
    }
  },
  watch: {
    active(newVal) {
      if (newVal) this.startAnimation();
    }
  },
  methods: {
    startAnimation() {
      const startTime = Date.now();

      const typeNext = () => {
        if (this.currentIndex < this.fullText.length) {
          this.displayedText += this.fullText[this.currentIndex];
          this.currentIndex++;
          setTimeout(typeNext, 15);
        } else {
          const elapsed = Date.now() - startTime;
          const remaining = this.minDuration - elapsed;
          setTimeout(() => {
            this.$emit('finished');
          }, remaining > 0 ? remaining : 0);
        }
      }

      typeNext();
    }
  }
}
</script>

<style scoped>
.boot-screen {
  width: 100%;
  position: fixed;
  inset: 0;
  background-color: black;
  color: #00ff00;
  font-family: "VT323", monospace;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  white-space: pre-wrap;
  overflow: hidden;
}

.boot-text {
  text-shadow: 0 0 2px #00ff00;
}
</style>