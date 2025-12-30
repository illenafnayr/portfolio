<template>
  <div ref="draggableContainer" :id="`${id}-file-container`" class="file-container">
    <div :id="`${id}-header`" class="file-header" @mousedown="dragMouseDown" @touchstart="dragMouseDown">
      <span>{{ documentName }}</span>
      <div class="close" @click="closeDocument()">X</div>
    </div>
    <!-- <iframe src="https://drive.google.com/file/d/1KP3j4HTnb6PT7QXT_49KP7CdftAgPvc7/preview" width="640" height="480"></iframe> -->
    <div :id="`${id}-body`" class="file-body">
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'WordFile',
  props: {
    file: Object
  },
  data: function () {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
      documentName: this.file.name,
      id: this.file.name.split(' ').join('')
    }
  },
  methods: {
    dragMouseDown: function (event) {
      event.preventDefault()
      const client = event.touches ? event.touches[0] : event
      this.positions.clientX = client.clientX
      this.positions.clientY = client.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
      document.ontouchmove = this.elementDrag
      document.ontouchend = this.closeDragElement
    },
    elementDrag: function (event) {
      event.preventDefault()
      const client = event.touches ? event.touches[0] : event
      this.positions.movementX = this.positions.clientX - client.clientX
      this.positions.movementY = this.positions.clientY - client.clientY
      this.positions.clientX = client.clientX
      this.positions.clientY = client.clientY
      this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
    },
    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
      document.ontouchmove = null
      document.ontouchend = null
    },
    closeDocument() {
      document.querySelector(`#${this.id}-file-container`).style.display = 'none'
    }
  }
}
</script>
  
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.file-container {
  position: absolute;
  z-index: 10;
  height: 55%;
  width: 50%;
  border: 2px solid;
  background-color: rgb(192, 192, 192);
  border-width: 1px;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  resize: both;
  overflow: hidden;
  font-family: 'VT323', monospace;
  text-align: center;
  top: 21%;
  left: 30%;
}

.file-header {
  cursor: move;
  z-index: 10;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0, 0, 123), black);
  display: flex;
  justify-content: space-between;
}

.file-Body {
  height: 95%;
  width: 100%;
  /* border: 1px solid gold; */
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  /* justify-content: center; */
}
</style>