<template>
  <div ref="draggableContainer" class="directory-container" :id="`${id}-directory-container`">
    <div class="directory-header" @mousedown="dragMouseDown">
      <span>C: _/{{ name }}</span>
      <div class="close" v-on:click="close()">X</div>
    </div>
    <div class="directoryFiles-container">
      <Icon 
        v-for="(icon, i) in subDirectories"
        :key="i"
        :name=icon.name
        :title=icon.title
        :filename=icon.imgname
        :draggable="false"
        v-on:dblclick="showContents(icon.file)" @touchend="showContents(icon.file)" />
    </div>
  </div>
</template>

<script>
import { createApp } from 'vue';
import Icon from './Icon.vue'
import DocumentWord from './WordFile.vue';

export default {
  name: 'Directory',
  components: {
    Icon,
  },
  props: {
    name: String,
    directories: Array
  },
  data: function () {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
      id: this.name.split(' ').join(''),
      subDirectories: [{
        id: 1,
        name: "new",
        title: "directory",
        imgname: "DocumentsFolder.png",
        file: {
          name: "Tfasdfasd fasd"
        }
      },
      {
        id: 2,
        name: "asdf",
        title: "asdfa",
        imgname: "Pin-sheet.png",
        file: {
          name: "asdf"
        }
      }]
    }
  },
  mounted() {
    document.querySelector(`#${this.id}-directory-container`).style.display = 'none'

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
    close() {
      document.querySelector(`#${this.id}-directory-container`).style.display = 'none'
    },
    showContents(file) {
      const id = file.name.split(' ').join('')
      if (document.querySelector(`#${id}-file-container`) && document.querySelector(`#${id}-file-container`).style.display == 'none') {
        document.querySelector(`#${id}-file-container`).style.display = 'block'
        return
      }

      const componentApp = createApp(DocumentWord, { file: file });
      const componentInstance = componentApp.mount(document.createElement('div'));
      document.getElementById('desktop').appendChild(componentInstance.$el);
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');


.directory-container {
  position: absolute;
  z-index: 10;
  height: auto;
  width: 50%;
  max-width: 600px;
  min-width: 300px;
  border: 2px solid;
  background-color: rgb(192, 192, 192);
  border-width: 1px;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  resize: both;
  overflow: hidden;
  font-family: 'VT323', monospace;
  text-align: center;
  top: 5%;
  left: 15%;
}

.directory-header {
  cursor: move;
  z-index: 10;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0, 0, 123), black);
  display: flex;
  justify-content: space-between;
}

.directoryFiles-container {
  display: flex;
  align-content: center;
  justify-content: space-evenly;
  overflow: auto;
  padding: 3%;
}
</style>