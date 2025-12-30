<template>
  <div ref="draggableContainer" id="game-selector-container">
    <div id="draggable-header" @mousedown="dragMouseDown" @touchstart="dragMouseDown">
      <span>Games!</span>
      <div class="close" v-on:click="closeGameSelector()">X</div>
    </div>

    <!-- <label @click="playAlienAttack" class="button_faux">
      <button id="blurb">Alien Attack</button>
    </label> -->
    <label @click="playMaze" class="button_faux">
      <button id="blurb">Maze Game</button>
    </label>
  </div>
</template>

<script>
// import AlienAttack from "./AlienAttack.vue";
export default {
  name: "GameSelector",
  components: {},
  created() { },
  mounted() { },
  computed: {},
  data: () => {
    return {};
  },
  methods: {
    playAlienAttack() {
      console.log("Alien Attack! 👽");
      this.$router.push("/games/alien-attack");
    },
    playMaze() {
      console.log("Maze Game! 🐭");
      this.$router.push("/games/maze");
    },
    closeGameSelector() {
      document.querySelector('#game-selector-container').style.display = 'none'
    },
    dragMouseDown(event) {
      const touch = event.touches && event.touches.length ? event.touches[0] : null;
      const target = touch ? touch.target : (event.target || event.srcElement);
      if (target && target.closest && target.closest('.close')) return;
      event.preventDefault();
      const client = touch || event;
      this.positions = this.positions || { clientX: 0, clientY: 0, movementX: 0, movementY: 0 };
      this.positions.clientX = client.clientX;
      this.positions.clientY = client.clientY;
      document.onmousemove = this.elementDrag.bind(this);
      document.onmouseup = this.closeDragElement.bind(this);
      document.ontouchmove = this.elementDrag.bind(this);
      document.ontouchend = this.closeDragElement.bind(this);
    },
    elementDrag(event) {
      event.preventDefault();
      const client = event.touches ? event.touches[0] : event;
      this.positions.movementX = this.positions.clientX - client.clientX;
      this.positions.movementY = this.positions.clientY - client.clientY;
      this.positions.clientX = client.clientX;
      this.positions.clientY = client.clientY;
      const el = this.$refs.draggableContainer;
      el.style.top = (el.offsetTop - this.positions.movementY) + 'px';
      el.style.left = (el.offsetLeft - this.positions.movementX) + 'px';
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchmove = null;
      document.ontouchend = null;
    }
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");

#game-selector-container {
  position: absolute;
  z-index: 10;
  height: 12.42rem;
  width: 16rem;
  border: 2px solid;
  background-color: rgb(192, 192, 192);
  border-width: 1px;
  border-color: #ffffff #808080 #808080 #ffffff;
  resize: both;
  overflow: auto;
  font-family: "VT323", monospace;
  text-align: center;
  display: none;
  justify-content: center;
  align-items: center;
  top: 25%;
  left: 25%;
}

#draggable-header {
  cursor: move;
  z-index: 10;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0, 0, 123), black);
  display: flex;
  justify-content: space-between;
}

#blurb {
  margin: 6.5%;
}
</style>