<template>
  <div v-show="!screenSaverActive" @keydown="resetScreenSaverTimer" @click="resetScreenSaverTimer"
    @mousemove="resetScreenSaverTimer" class="home" tabindex="0">
    <CyanCat />
    <Desktop />
    <NavBar @activate-screensaver="activateScreenSaverImmediately" />
  </div>

  <div v-if="screenSaverActive" @keydown="stopScreenSaver" @click="stopScreenSaver" @mousemove="stopScreenSaver"
    class="screen-saver" tabindex="0">
    <ScreenSaver />
  </div>
</template>

<script>
import Desktop from "@/components/Desktop.vue";
import NavBar from "@/components/NavBar.vue";
import CyanCat from "@/components/CyanCat.vue";
import ScreenSaver from "@/components/ScreenSaver.vue";

export default {
  name: "Home",
  components: {
    CyanCat,
    Desktop,
    NavBar,
    ScreenSaver,
  },
  data() {
    return {
      screenSaverActive: false,
      timer: null,
      inactivityDelay: 1000 * 15,
    };
  },
  mounted() {
    this.resetScreenSaverTimer();
    this.$nextTick(() => {
      const homeEl = this.$el.querySelector(".home");
      if (homeEl) homeEl.focus();
    });
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    resetScreenSaverTimer() {
      if (this.screenSaverActive) return;

      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.screenSaverActive = true;
      }, this.inactivityDelay);
    },

    stopScreenSaver() {
      clearTimeout(this.timer);
      this.screenSaverActive = false;
      this.resetScreenSaverTimer();
    },

    activateScreenSaverImmediately() {
      clearTimeout(this.timer);
      this.screenSaverActive = true;
    },
  },
};
</script>

<style lang="scss">
@use "../styles/global.scss" as *;

body {
  margin: 0;
  background-color: $color-background;
}

.home {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.screen-saver {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: black;
}
</style>
