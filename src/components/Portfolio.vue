<template>
  <div ref="draggableContainer" id="portfolio-container">
    <div id="portfolio-header" @mousedown="dragMouseDown">
      <span>Aerospace Portfolio</span>
      <div class="close" v-on:click="closeAboutMe()">X</div>
    </div>
    <div id="portfolio-content">
      <!-- RC Plane Project -->
      <div class="project-section">
        <h3>Custom RC Aircraft Build</h3>
        <p>Construction of a 3d printed radio-controlled aircraft</p>
        <div class="image-gallery">
          <img :src="rcPlane1" alt="RC Plane Build 1" class="project-image" @click="openImage(rcPlane1)" />
          <img :src="rcPlane2" alt="RC Plane Build 2" class="project-image" @click="openImage(rcPlane2)" />
          <img :src="rcPlane3" alt="RC Plane Build 3" class="project-image" @click="openImage(rcPlane3)" />
          <img :src="rcPlane4" alt="RC Plane Build 4" class="project-image" @click="openImage(rcPlane4)" />
        </div>
        <div class="project-details">
          <span>Click images to enlarge</span>
        </div>
      </div>
      <hr width="95%">

      <!-- Hydrogen NOx Research -->
      <div class="project-section">
        <h3>Review of NOx Formation and Mitigation Strategies in Hydrogen Combustion Engines</h3>
        <p>Analysis of Hydrogen Combustion Mechanisms and Strategies for
          Low NOx Emission</p>
        <div class="document-preview">
          <div class="pdf-icon">📄</div>
          <a :href="nOxReductionPdfUrl2" target="_blank" class="doc-link">
            View Document (PDF)
          </a>
        </div>
        <div class="project-details">
          <span>Analysis & literature review</span>
        </div>
      </div>
      <hr width="95%">

      <!-- Hydrogen Fuel Cell VTOL -->
      <div class="project-section">
        <h3>Hydrogen Fuel Cell VTOL Concept</h3>
        <p>Conceptual design study for a hydrogen-powered vertical takeoff and landing aircraft</p>
        <div class="document-preview">
          <div class="pdf-icon">📄</div>
          <a :href="h2vtolPdfUrl" target="_blank" class="doc-link">
            View Document (PDF)
          </a>
        </div>
        <div class="project-details">
          <span>Technical specifications and design analysis</span>
        </div>
      </div>
      <hr width="95%">

      <!-- 3D Aircraft Model Viewer -->
      <div class="project-section">
        <h3>Aircraft Design Concepts</h3>
        <p>3D visualization of aircraft design studies</p>
        <div class="model-viewer-container">
          <div id="model-viewer" class="model-display">
            <button @click="load3DModel" class="load-model-btn">Load 3D Model</button>
            <canvas ref="modelCanvas" id="model-canvas"></canvas>
          </div>
        </div>
        <div class="project-details">
          <span>OpenVSP conceptual design models</span>
        </div>
      </div>
      <hr width="95%">

      <!-- GitHub & Additional Links -->
      <div class="project-section">
        <h3>Additional Work</h3>
        <div class="links-list">
          <a href="https://github.com/illenafnayr" target="_blank" class="portfolio-link">
            <span class="link-icon">🔗</span> GitHub Profile
          </a>
          <a href="https://www.linkedin.com/in/ryan-fanelli/" target="_blank" class="portfolio-link">
            <span class="link-icon">🔗</span> LinkedIn Profile
          </a>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="enlargedImage" class="image-modal" @click.stop="closeImage">
      <div v-if="imageLoading" class="loading-spinner"></div>
      <div class="modal-content" @click.stop>
        <img :src="enlargedImage" alt="Enlarged view" class="enlarged-image" @click="closeImage" @load="onImageLoad" />
      </div>
    </div>
  </div>
</template>

<script>
import rcPlane1 from '/images/rcplane1.png'
import rcPlane2 from '/images/rcplane2.png'
import rcPlane3 from '/images/rcplane3.png'
import rcPlane4 from '/images/rcplane4.png'
import h2vtolPdfUrl from '/images/Hydrogen_Fuel_Cell_VTOL_RC_Aircraft.pdf'
import nOxReductionPdfUrl2 from '/images/NOx_Reduction_Research.pdf'

export default {
  name: 'Portfolio',
  data: function () {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
      enlargedImage: null,
      imageLoading: false,
      modelLoaded: false,
      h2vtolPdfUrl: h2vtolPdfUrl,
      nOxReductionPdfUrl2: nOxReductionPdfUrl2,
      rcPlane1: rcPlane1,
      rcPlane2: rcPlane2,
      rcPlane3: rcPlane3,
      rcPlane4: rcPlane4
    }
  },
  methods: {
    dragMouseDown: function (event) {
      event.preventDefault()
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
      this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
    },
    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
    },
    closeAboutMe() {
      document.querySelector('#portfolio-container').style.display = 'none'
    },
    openImage(imageSrc) {
      this.imageLoading = true
      this.enlargedImage = imageSrc
    },
    closeImage() {
      this.enlargedImage = null
      this.imageLoading = false
    },
    onImageLoad() {
      this.imageLoading = false
    },
    load3DModel() {
      // Placeholder for Three.js model loading
      // You'll need to implement this with your actual .obj/.stl file from OpenVSP
      this.modelLoaded = true
      console.log('Load 3D model from OpenVSP export')
      // Example implementation would use Three.js OBJLoader or STLLoader
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

#portfolio-container {
  position: absolute;
  z-index: 10;
  height: 80vh;
  width: 60%;
  max-width: 800px;
  min-width: 400px;
  border: 2px solid;
  background-color: rgb(192, 192, 192);
  border-width: 1px;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  resize: both;
  overflow: hidden;
  font-family: 'VT323', monospace;
  display: none;
  top: 5%;
  left: 15%;
}

#portfolio-header {
  cursor: move;
  z-index: 10;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0, 0, 123), black);
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  font-size: 1.2rem;
}

#portfolio-content {
  height: calc(100% - 35px);
  overflow-y: auto;
  padding: 20px;
  text-align: center;
}

.project-section {
  margin-bottom: 20px;
}

.project-section h3 {
  margin: 10px 0;
  font-size: 1.5rem;
  color: rgb(0, 0, 123);
}

.project-section p {
  margin: 5px 0 15px 0;
  font-size: 1.1rem;
}

.image-gallery {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 15px 0;
}

.project-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 2px solid #808080;
  cursor: pointer;
  transition: transform 0.2s;
}

.project-image:hover {
  transform: scale(1.05);
  border-color: rgb(0, 0, 123);
}

.document-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: rgb(220, 220, 220);
  border: 1px solid #808080;
  margin: 15px auto;
  max-width: 300px;
}

.pdf-icon {
  font-size: 3rem;
}

.doc-link {
  color: rgb(0, 0, 123);
  text-decoration: none;
  font-size: 1.2rem;
  padding: 8px 16px;
  border: 2px solid rgb(0, 0, 123);
  background-color: rgb(192, 192, 192);
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
}

.doc-link:hover {
  background-color: rgb(0, 0, 123);
  color: white;
}

.model-viewer-container {
  margin: 15px 0;
}

.model-display {
  width: 100%;
  height: 300px;
  background-color: rgb(220, 220, 220);
  border: 2px solid #808080;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

#model-canvas {
  width: 100%;
  height: 100%;
  display: none;
}

.load-model-btn {
  font-family: 'VT323', monospace;
  font-size: 1.2rem;
  padding: 10px 20px;
  background-color: rgb(192, 192, 192);
  border: 2px solid;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  cursor: pointer;
}

.load-model-btn:active {
  border-color: #808080 #FFFFFF #FFFFFF #808080;
}

.project-details {
  margin-top: 10px;
  font-size: 1rem;
  color: #555;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin: 15px 0;
}

.portfolio-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgb(0, 0, 123);
  text-decoration: none;
  font-size: 1.2rem;
  padding: 8px 16px;
  border: 2px solid rgb(192, 192, 192);
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  min-width: 250px;
  justify-content: center;
}

.portfolio-link:hover {
  background-color: rgb(0, 0, 123);
  color: white;
}

.link-icon {
  font-size: 1.2rem;
}

hr {
  margin: 20px auto;
  border: none;
  border-top: 1px solid #808080;
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
}

.enlarged-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border: 3px solid white;
}

.loading-spinner {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>