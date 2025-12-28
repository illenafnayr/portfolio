<template>
  <div ref="draggableContainer" id="aboutme-container">
    <div id="aboutme-header" @mousedown="dragMouseDown">
      <span>About Me</span>
      <div class="close" v-on:click="closeAboutMe()">X</div>
    </div>
    <p id="blurb">My mission is to empower a better planet through innovation and sustainability.
      <br/>
      <br/>

      A dedicated engineer and entrepreneur passionate about transforming ideas into meaningful, technology-driven
      solutions through diverse ways of thinking. With a background spanning software engineering, biological sciences,
      and a growing expertise in aerospace systems, I thrive at the intersection of innovation and practicality, driving
      progress through creativity, precision, and diverse ways of thinking. I combine analytical rigor with curiosity
      and empathy inspiring confidence within teams and sparking collaboration that leads to real-world impact and a
      more sustainable future.</p>
  </div>
</template>

<script>
export default {
  name: 'AboutMe',
  data: function () {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      }
    }
  },
  methods: {
    dragMouseDown: function (event) {
      event.preventDefault()
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },
    elementDrag: function (event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      // set the element's new position:
      this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
    },
    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
    },
    closeAboutMe() {
      document.querySelector('#aboutme-container').style.display = 'none'
    }
  }
}
</script>

<style lang="scss">
@import '../styles/global.scss';
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');


#aboutme-container {
  position: absolute;
  z-index: 10;
  height: 12.42rem;
  width: 16rem;
  border: 2px solid;
  background-color: rgb(192, 192, 192);
  border-width: 1px;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  resize: both;
  overflow: auto;
  font-family: 'VT323', monospace;
  text-align: center;
  display: none;
  justify-content: center;
  align-items: center;
  top: 25%;
  left: 25%;
}

#aboutme-header {
  cursor: move;
  z-index: 10;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0, 0, 123), black);
  display: flex;
  justify-content: space-between;
}

.close {
  border: 1px solid;
  border-width: 1px;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  background-color: rgb(192, 192, 192);
  width: 3%;
}

.close:active {
  border-color: #808080 #FFFFFF #FFFFFF #808080;
}

#blurb {
  margin: 6.5%;
  font-size: 1.2rem;
}
</style>