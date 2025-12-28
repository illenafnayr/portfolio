<template>
  <div
    v-show="!screenSaverActive"
    @keydown="handleKeyPress"
    @click="startScreenSaver"
    @mousemove="startScreenSaver"
    class="home"
  >
    <CyanCat />
    <Desktop />
    <NavBar />
  </div>
  <div
    v-if="screenSaverActive"
    @keydown="handleKeyPress"
    @click="stopScreenSaver"
    @mousemove="stopScreenSaver"
    class="screen-saver"
  >
    <ScreenSaver />
  </div>
</template>

<script>
// @ is an alias to /src
import Desktop from "@/components/Desktop.vue";
import NavBar from "@/components/NavBar.vue";
import CyanCat from "@/components/CyanCat.vue";
import ScreenSaver from "@/components/ScreenSaver.vue"

export default {
  name: "Home",
  components: {
    CyanCat,
    Desktop,
    NavBar,
    ScreenSaver,
  },
  created() {
    window.addEventListener("keydown", () => {
      this.screenSaverActive = undefined;
      this.startScreenSaver();
    });
  },
  mounted() {
    console.warn("this message will self destruct in 30s");
    setTimeout(() => {
      console.error("💥 boom 💥");
    }, 1000 * 30);
  },
  data() {
    return {
      screenSaverActive: undefined,
    };
  },
  methods: {
    startScreenSaver() {
      this.screenSaverActive = undefined;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.screenSaverActive = true;
      }, 1000 * 30);
    },
    stopScreenSaver() {
      clearTimeout(this.timer);
      this.screenSaverActive = undefined;
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

.screen-saver {
  width: 100vw;
  height: 100vh;
}
</style>
