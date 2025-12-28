<template>
  <div ref="draggableContainer" id="portfolio-container">
    <div id="portfolio-header" @mousedown="dragMouseDown">
      <span>Portfolio</span>
      <div class="close" v-on:click="closeAboutMe()">X</div>
    </div>
    <div id="links">
      <span>A deck of Cards with some easter egg games if you can find them:</span>
      <a href="https://illenafnayr.github.io/Card-Game/" target="_blank">Deck of Cards</a>
      <hr width="95%">
      <span>A image sharing application that suggests images based on tags you like:</span>
      <a href="https://toast-apples.herokuapp.com/" target="_blank">Toast</a>
      <hr width="95%">
      <span>An anoymous social media application. You must contribute to view the content:</span>
      <a href="https://face-less.herokuapp.com/" target="_blank">Faceless</a>
      <hr width="95%">
      <span>An ecommerce platform for a Boston based Skateboard Company:</span>
      <a href="https://shielded-journey-24875.herokuapp.com/" target="_blank">Corner Store Skateboard Co.</a>
      <hr width="95%">
      <span>Sustainable Cities Hackathon - A 3 day collab between a UX/UI team, a developmetn team and a data scientist</span>
      <a href="https://docs.google.com/presentation/d/1UX7DrJ_IN2ToGuMDl_pClget2u2lVH3yIit7rglrfAc/edit?usp=sharing" target="_blank">Slide Deck</a>
      <a href="https://github.com/SustainableCities">Git Hub Repo</a>
      <hr width="95%">
      <span>A Stock Market Chart viewer, a failed collaboration with a UX/UI team where communication and team organization skills were put to the test, and a lot was learned. (The API's are very limited! 1 search per minute please!)</span>
      <a href="https://hidden-woodland-01560.herokuapp.com/" target="_blank">A finance app</a>
      <hr width="95%">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Portfolio',
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
    closeDragElement () {
      document.onmouseup = null
      document.onmousemove = null
    },
    closeAboutMe () {
      document.querySelector('#portfolio-container').style.display = 'none'
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');


#portfolio-container {
  position: absolute;
  z-index: 10;
  height: auto;
  width: 50%;
  max-width: 600px;
  min-width: 300px;
  border: 2px solid;
  background-color: rgb(192,192,192);
  border-width:1px;
  border-color:#FFFFFF #808080 #808080 #FFFFFF;
  resize: both;
  overflow: hidden;
  font-family: 'VT323', monospace;
  text-align:center;
  display: none;
  top: 5%;
  left: 15%;
}
#portfolio-header {
  cursor:move;
  z-index: 10;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0,0,123), black);
  display: flex;
  justify-content: space-between;
}

#links {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-evenly;
  height: 90%;
  /* border: 1px solid gold; */
  overflow: auto;
  padding: 5%;
}

</style>